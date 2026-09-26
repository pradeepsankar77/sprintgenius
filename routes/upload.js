const express = require("express");
const multer = require("multer");
const fs = require("fs");
const Project = require("../models/Project");
const { extractText } = require("../services/docParser");

const router = express.Router();

// Store uploads temporarily in an "uploads" folder, then delete after parsing.
const upload = multer({ dest: "uploads/" });

// POST /upload
// form-data: file=<the PDF/DOCX/TXT>, projectName=<string>
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const text = await extractText(req.file.path, req.file.originalname);
    fs.unlinkSync(req.file.path); // clean up temp file

    const project = await Project.create({
      name: req.body.projectName || req.file.originalname,
      rawText: text,
    });

    res.status(201).json({
      message: "Document uploaded and parsed successfully",
      project,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
