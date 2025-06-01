# Campus Resume Analyzer

A web application that helps students analyze and improve their resumes. The application provides detailed feedback and suggestions to enhance your resume's effectiveness.

## Features

- Resume Upload: Upload your resume in PDF format
- AI Analysis: Get detailed analysis of your resume content
- Scoring System: Receive a comprehensive score based on various factors
- Improvement Suggestions: Get specific recommendations to enhance your resume
- Modern UI: Clean and responsive user interface
- User Authentication: Simple name-based login system

## Tech Stack

Frontend:
- React.js
- Tailwind CSS
- Heroicons
- Axios for API calls

Backend:
- Rust
- Actix-web framework
- CORS support
- File handling
- Content analysis

## Prerequisites

- Node.js (v14 or higher)
- Rust (latest stable version)
- Cargo (Rust package manager)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/priyanshu8905258918/campus-resume-analyzer.git
cd campus-resume-analyzer
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
cargo build
```

## Running the Application

1. Start the backend server:
```bash
cd backend
cargo run
```
The backend will run on http://localhost:8080

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```
The frontend will run on http://localhost:5173

## Usage

1. Open http://localhost:5173 in your browser
2. Log in with your name
3. Upload your resume (PDF format)
4. View the analysis and improvement suggestions
5. Check your resume history

## Project Structure

```
campus-resume-analyzer/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── src/
│   │   └── main.rs
│   └── Cargo.toml
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Priyanshu - [@priyanshu8905258918](https://github.com/priyanshu8905258918)

Project Link: [https://github.com/priyanshu8905258918/campus-resume-analyzer](https://github.com/priyanshu8905258918/campus-resume-analyzer) 