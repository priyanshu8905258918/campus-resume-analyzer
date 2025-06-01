use actix_cors::Cors;
use actix_multipart::Multipart;
use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use futures::{StreamExt, TryStreamExt};
use serde::{Deserialize, Serialize};
use log::info;
use std::io::Write;
use std::fs;
use std::path::Path;
use actix_web::middleware::Logger;
use env_logger::Env;
use chrono::Utc;
use std::collections::HashMap;
use std::sync::Mutex;
use lazy_static::lazy_static;

#[derive(Serialize, Deserialize)]
struct Response {
    message: String,
}

#[derive(Serialize, Deserialize)]
struct UploadResponse {
    message: String,
    file_id: String,
}

#[derive(Deserialize)]
struct LoginRequest {
    name: String,
}

#[derive(Serialize)]
struct LoginResponse {
    user_id: String,
    name: String,
}

#[derive(Serialize, Clone)]
struct AnalysisResponse {
    score: i32,
    improvements: Vec<String>,
    created_at: String,
    resume_id: String,
}

// Store analyses in memory with thread-safe access
lazy_static! {
    static ref ANALYSES: Mutex<HashMap<String, Vec<AnalysisResponse>>> = Mutex::new(HashMap::new());
}

fn analyze_resume_content(content: &str) -> AnalysisResponse {
    let mut score = 0;
    let mut improvements = Vec::new();

    // Convert content to lowercase for case-insensitive matching
    let content_lower = content.to_lowercase();

    // Check for key sections and their content quality
    let sections = [
        ("education", vec!["degree", "university", "college", "gpa", "graduation"]),
        ("experience", vec!["work", "job", "employment", "position", "role"]),
        ("skills", vec!["technical", "programming", "software", "tools", "languages"]),
        ("projects", vec!["project", "development", "implementation", "created", "built"]),
        ("achievements", vec!["achieved", "award", "recognition", "certified", "completed"])
    ];

    let mut found_sections = 0;
    let mut section_scores = Vec::new();
    
    for (section, keywords) in sections.iter() {
        let mut section_score = 0;
        if content_lower.contains(section) {
            found_sections += 1;
            info!("Found section: {}", section);
            
            // Check for keywords in this section
            for keyword in keywords {
                if content_lower.contains(keyword) {
                    section_score += 2;
                }
            }
            
            // Check for metrics and achievements
            if content_lower.matches("%").count() > 0 || 
               content_lower.matches("$").count() > 0 ||
               content_lower.matches("increased").count() > 0 ||
               content_lower.matches("improved").count() > 0 {
                section_score += 5;
            }
            
            section_scores.push(section_score);
        } else {
            improvements.push(format!("Add a {} section", section));
        }
    }
    
    // Base score on number of sections found (up to 50 points)
    score += found_sections * 10;
    info!("Base score from sections: {}", score);

    // Add section quality scores (up to 50 points)
    let quality_score: i32 = section_scores.iter().sum();
    score += quality_score.min(50);
    info!("Quality score: {}", quality_score);

    // Check for professional formatting
    if content.matches("\n\n").count() > 5 {
        score += 5;
        info!("Good formatting detected");
    } else {
        improvements.push("Improve formatting with clear section breaks".to_string());
    }

    // Check for action verbs
    let action_verbs = ["developed", "implemented", "created", "managed", "led", "increased", "improved", "achieved"];
    let mut verb_count = 0;
    for verb in action_verbs.iter() {
        verb_count += content_lower.matches(verb).count();
    }
    if verb_count > 5 {
        score += 5;
        info!("Good use of action verbs");
    } else {
        improvements.push("Use more action verbs to describe your achievements".to_string());
    }

    // Check for technical skills
    let tech_skills = ["python", "java", "javascript", "react", "node", "sql", "aws", "docker", "kubernetes"];
    let mut skill_count = 0;
    for skill in tech_skills.iter() {
        if content_lower.contains(skill) {
            skill_count += 1;
        }
    }
    if skill_count > 3 {
        score += 5;
        info!("Good technical skills");
    } else {
        improvements.push("Add more technical skills relevant to your field".to_string());
    }

    // Add specific improvements based on content
    if content_lower.matches("experience").count() > 0 && content_lower.matches("years").count() == 0 {
        improvements.push("Add duration for your work experience".to_string());
    }

    if content_lower.matches("education").count() > 0 && content_lower.matches("gpa").count() == 0 {
        improvements.push("Include your GPA if it's above 3.0".to_string());
    }

    if content_lower.matches("project").count() > 0 && content_lower.matches("github").count() == 0 {
        improvements.push("Add links to your project repositories".to_string());
    }

    // Ensure score doesn't exceed 100
    score = score.min(100);
    info!("Final score: {}", score);

    // Add general improvements if score is low
    if score < 60 {
        improvements.push("Add more specific details about your achievements".to_string());
        improvements.push("Include relevant certifications and training".to_string());
        improvements.push("Quantify your achievements with numbers and metrics".to_string());
    }

    AnalysisResponse {
        score,
        improvements,
        created_at: Utc::now().to_rfc3339(),
        resume_id: String::new(),
    }
}

async fn hello() -> impl Responder {
    info!("Received request to / endpoint");
    let response = Response {
        message: "Hello from Rust Backend!".to_string(),
    };
    HttpResponse::Ok().json(response)
}

async fn login(req: web::Json<LoginRequest>) -> impl Responder {
    info!("Received login request for user: {}", req.name);
    let user_id = format!("user_{}", req.name);
    HttpResponse::Ok().json(LoginResponse {
        user_id,
        name: req.name.clone(),
    })
}

async fn upload_file(mut payload: Multipart) -> impl Responder {
    info!("Received file upload request");
    
    // Create uploads directory if it doesn't exist
    let upload_dir = Path::new("uploads");
    if !upload_dir.exists() {
        fs::create_dir_all(upload_dir).expect("Failed to create uploads directory");
    }

    let mut user_id = String::new();
    let mut content = Vec::new();
    let mut filename = String::new();

    while let Ok(Some(mut field)) = payload.try_next().await {
        let content_disposition = field.content_disposition();
        
        if let Some(name) = content_disposition.get_name() {
            if name == "userId" {
                let mut data = Vec::new();
                while let Some(chunk) = field.next().await {
                    data.extend_from_slice(&chunk.unwrap());
                }
                user_id = String::from_utf8_lossy(&data).to_string();
                info!("Received user ID: {}", user_id);
                continue;
            }
        }

        if let Some(f) = content_disposition.get_filename() {
            filename = f.to_string();
            let filepath = format!("uploads/{}", filename);
            info!("Saving file to: {}", filepath);

            let mut f = web::block(move || std::fs::File::create(&filepath))
                .await
                .unwrap()
                .expect("Failed to create file");

            while let Some(chunk) = field.next().await {
                let data = chunk.unwrap();
                content.extend_from_slice(&data);
                f = web::block(move || {
                    f.write_all(&data).expect("Failed to write to file");
                    f
                })
                .await
                .unwrap();
            }
        }
    }

    if content.is_empty() || user_id.is_empty() {
        info!("Upload failed: No file or user ID");
        return HttpResponse::BadRequest().json(serde_json::json!({
            "error": "No file uploaded or missing user ID"
        }));
    }

    // Generate a unique resume ID
    let resume_id = format!("resume_{}", chrono::Utc::now().timestamp_millis());

    // Analyze the resume content
    let content_str = String::from_utf8_lossy(&content);
    info!("Analyzing resume content for user: {}", user_id);
    let mut analysis = analyze_resume_content(&content_str);
    analysis.resume_id = resume_id.clone();

    // Store the analysis
    let mut analyses = ANALYSES.lock().unwrap();
    analyses.entry(user_id.clone())
        .or_insert_with(Vec::new)
        .push(analysis);

    info!("File uploaded and analyzed successfully for user: {}", user_id);
    HttpResponse::Ok().json(serde_json::json!({
        "message": "File uploaded and analyzed successfully",
        "filename": filename,
        "resume_id": resume_id
    }))
}

async fn get_history(path: web::Path<String>) -> impl Responder {
    let user_id = path.into_inner();
    info!("Received history request for user: {}", user_id);
    
    let analyses = ANALYSES.lock().unwrap();
    let user_analyses = analyses.get(&user_id)
        .cloned()
        .unwrap_or_default();

    info!("Returning {} analyses for user: {}", user_analyses.len(), user_id);
    HttpResponse::Ok().json(user_analyses)
}

async fn analyze_resume(path: web::Path<String>) -> impl Responder {
    let resume_id = path.into_inner();
    info!("Received analysis request for resume: {}", resume_id);
    
    let analyses = ANALYSES.lock().unwrap();
    
    // Find the analysis for this resume ID across all users
    let mut found_analysis = None;
    for (_, user_analyses) in analyses.iter() {
        if let Some(analysis) = user_analyses.iter().find(|a| a.resume_id == resume_id) {
            found_analysis = Some(analysis.clone());
            break;
        }
    }

    let analysis = found_analysis.unwrap_or_else(|| AnalysisResponse {
        score: 0,
        improvements: vec!["No analysis available".to_string()],
        created_at: Utc::now().to_rfc3339(),
        resume_id: resume_id.clone(),
    });

    HttpResponse::Ok().json(analysis)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(Env::default().default_filter_or("info"));
    
    info!("Starting server at http://127.0.0.1:8080");
    
    HttpServer::new(|| {
        let cors = Cors::permissive()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(cors)
            .wrap(Logger::default())
            .route("/", web::get().to(hello))
            .route("/login", web::post().to(login))
            .route("/upload", web::post().to(upload_file))
            .route("/analyze/{resume_id}", web::get().to(analyze_resume))
            .route("/history/{user_id}", web::get().to(get_history))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
} 