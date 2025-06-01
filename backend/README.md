# Rust Backend

A modern Rust backend using Actix-web framework.

## Prerequisites

- Rust (latest stable version)
- Cargo (comes with Rust)

## Setup

1. Make sure you have Rust installed:
```bash
rustc --version
```

2. Build the project:
```bash
cargo build
```

3. Run the server:
```bash
cargo run
```

The server will start at http://127.0.0.1:8080

## API Endpoints

- GET `/`: Returns a hello message

## Features

- Modern async/await syntax
- CORS enabled for frontend integration
- JSON serialization/deserialization
- Error handling
- Logging support 