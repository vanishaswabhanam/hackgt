const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyCTKecnUk1-OtyI3gqlHe1dFpf5xgQ8cOA');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

// Database setup
const dbPath = path.join(__dirname, 'clinical_notes.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Clinical notes table
  db.run(`CREATE TABLE IF NOT EXISTS clinical_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idx TEXT UNIQUE,
    note TEXT,
    full_note TEXT,
    conversation TEXT,
    summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create index for text search
  db.run(`CREATE INDEX IF NOT EXISTS idx_note_text ON clinical_notes(note)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_conversation_text ON clinical_notes(conversation)`);
});

// Medical information template (from the dataset)
const MEDICAL_TEMPLATE = {
  "visit motivation": "string",
  "admission": [{
    "reason": "string",
    "date": "string",
    "duration": "string",
    "care center details": "string"
  }],
  "patient information": {
    "age": "string",
    "sex": "string",
    "ethnicity": "string",
    "weight": "string",
    "height": "string",
    "family medical history": "string",
    "recent travels": "string",
    "socio economic context": "string",
    "occupation": "string"
  },
  "patient medical history": {
    "physiological context": "string",
    "psychological context": "string",
    "vaccination history": "string",
    "allergies": "string",
    "exercise frequency": "string",
    "nutrition": "string",
    "sexual history": "string",
    "alcohol consumption": "string",
    "drug usage": "string",
    "smoking status": "string"
  },
  "surgeries": [{
    "reason": "string",
    "Type": "string",
    "time": "string",
    "outcome": "string",
    "details": "string"
  }],
  "symptoms": [{
    "name of symptom": "string",
    "intensity of symptom": "string",
    "location": "string",
    "time": "string",
    "temporalisation": "string",
    "behaviours affecting the symptom": "string",
    "details": "string"
  }],
  "medical examinations": [{
    "name": "string",
    "result": "string",
    "details": "string"
  }],
  "diagnosis tests": [{
    "test": "string",
    "severity": "string",
    "result": "string",
    "condition": "string",
    "time": "string",
    "details": "string"
  }],
  "treatments": [{
    "name": "string",
    "related condition": "string",
    "dosage": "string",
    "time": "string",
    "frequency": "string",
    "duration": "string",
    "reason for taking": "string",
    "reaction to treatment": "string",
    "details": "string"
  }],
  "discharge": {
    "reason": "string",
    "referral": "string",
    "follow up": "string",
    "discharge summary": "string"
  }
};

// Function to search similar clinical notes
async function searchSimilarNotes(query, limit = 5) {
  return new Promise((resolve, reject) => {
    const searchQuery = `
      SELECT idx, note, conversation, summary 
      FROM clinical_notes 
      WHERE note LIKE ? OR conversation LIKE ?
      ORDER BY 
        CASE 
          WHEN note LIKE ? THEN 1
          WHEN conversation LIKE ? THEN 2
          ELSE 3
        END
      LIMIT ?
    `;
    
    const searchTerm = `%${query}%`;
    db.all(searchQuery, [searchTerm, searchTerm, searchTerm, searchTerm, limit], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Function to generate structured JSON using Gemini
async function generateStructuredJSON(inputText, similarNotes) {
  try {
    const contextNotes = similarNotes.map(note => ({
      note: note.note.substring(0, 1000), // Truncate for context
      summary: note.summary
    }));

    const prompt = `
You are a medical AI assistant that extracts structured patient information from clinical text. 

Based on the input text and similar clinical notes provided, generate a JSON response following this exact template structure:

${JSON.stringify(MEDICAL_TEMPLATE, null, 2)}

Input text: "${inputText}"

Similar clinical notes for reference:
${JSON.stringify(contextNotes, null, 2)}

Instructions:
1. Extract relevant medical information from the input text
2. Follow the exact JSON structure provided
3. Use "None" for missing information
4. Be precise and medical-accurate
5. Return ONLY valid JSON, no additional text

Generate the structured JSON:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('No valid JSON found in response');
    }
  } catch (error) {
    console.error('Error generating structured JSON:', error);
    throw error;
  }
}

// API Routes
app.post('/api/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text input is required' });
    }

    // Search for similar notes
    const similarNotes = await searchSimilarNotes(text, 3);
    
    // Generate structured JSON using Gemini
    const structuredData = await generateStructuredJSON(text, similarNotes);
    
    res.json({
      success: true,
      input: text,
      similarNotes: similarNotes.length,
      structuredData: structuredData
    });
    
  } catch (error) {
    console.error('Error in /api/analyze:', error);
    res.status(500).json({ 
      error: 'Failed to analyze text',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Medical RAG API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
