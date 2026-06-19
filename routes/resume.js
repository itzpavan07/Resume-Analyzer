const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/resumes/upload
// form-data: file (file)
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { originalname, buffer, mimetype } = req.file;
    let text = '';

    // simple PDF parsing
    if (mimetype === 'application/pdf' || originalname.toLowerCase().endsWith('.pdf')) {
      try {
        const data = await pdfParse(buffer);
        text = data.text || '';
      } catch (e) {
        console.warn('pdf-parse failed, falling back to raw buffer toString', e.message);
        text = buffer.toString('utf8');
      }
    } else {
      // For other types (docx, txt) we fallback to buffer->string. For production, use specialized parsers.
      text = buffer.toString('utf8');
    }

    // basic email extraction
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/i);
    const email = emailMatch ? emailMatch[0] : '';

    // basic skills extraction: look for a 'skills' line and split by commas
    const skills = [];
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      if (/^skills[:\-]/i.test(line) || /\bskills\b:/i.test(line) || /\bskills\b/i.test(line)) {
        // remove leading label
        const after = line.replace(/.*skills[:\-]?/i, '').trim();
        if (after) {
          const parts = after.split(/[;,|]/).map(s => s.trim()).filter(Boolean);
          parts.forEach(p => skills.push(p));
          break;
        }
      }
    }

    const resume = new Resume({
      name: originalname,
      email,
      text,
      skills,
      fileName: originalname
    });

    await resume.save();

    return res.json({ id: resume._id, email, skills });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/resumes
router.get('/', async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ uploadedAt: -1 }).limit(50);
    return res.json(resumes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/resumes/:id
router.get('/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ error: 'Not found' });
    return res.json(resume);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
