// app/lib/resumeParser.js - Extract text from PDF/DOCX resumes

import pdf from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';

/**
 * Extract text from uploaded resume file
 * @param {File} file - Resume file (PDF or DOCX)
 * @returns {Promise<string>} - Extracted text content
 */
export async function parseResume(file) {
  try {
    const fileType = file.type;
    
    if (fileType === 'application/pdf') {
      return await parsePDF(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               fileType === 'application/msword') {
      return await parseDOCX(file);
    } else {
      throw new Error('Unsupported file type. Please upload PDF or DOCX.');
    }
  } catch (error) {
    console.error('Resume parsing error:', error);
    throw error;
  }
}

/**
 * Parse PDF resume
 */
async function parsePDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const data = await pdf(buffer);
  return data.text;
}

/**
 * Parse DOCX resume
 */
async function parseDOCX(file) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

/**
 * Client-side file reader (for browser environment)
 * Use this in components since pdf-parse doesn't work in browser
 */
export async function readResumeFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        resolve(text);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = reject;
    reader.readAsText(file);
  });
}