# Resume Analyzer - Backend

This branch adds a minimal Node.js + Express backend that allows uploading resumes (PDFs) and stores parsed text into MongoDB. It's a lightweight starting point you can extend.

Features included:
- Express server with routes to upload and list resumes
- Multer memory storage for file upload
- pdf-parse to extract text from PDF resumes
- Simple email and skills extraction heuristics

Quick start
1. Clone the repo and checkout the new branch:
   git checkout feature/backend-express-mongo
2. Install dependencies:
   npm install
3. Create a .env file with MONGO_URI (see .env.example)
4. Run in development:
   npm run dev
5. Use Postman to POST a file to POST http://localhost:5000/api/resumes/upload (form-data, key `file`)

Notes
- This is a basic prototype. For production you should:
  - Use GridFS or cloud storage for files
  - Use better parsers for docx/rtf
  - Add authentication, validation, and rate limiting
  - Add tests and CI

