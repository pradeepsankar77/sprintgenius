const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

/**
 * Extracts plain text from an uploaded file based on its extension.
 * Supports PDF, DOCX, and plain .txt as a fallback for user stories.
 */
async function extractText(filePath, originalName) {
  const ext = originalName.split(".").pop().toLowerCase();

  if (ext === "pdf") {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (ext === "docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  if (ext === "txt" || ext === "md" || ext === "markdown" || ext === "json") {
    return fs.readFileSync(filePath, "utf-8");
  }

  throw new Error(`Unsupported file type: .${ext}`);
}

module.exports = { extractText };
