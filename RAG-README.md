# Medical RAG System with Gemini API

A complete medical research assistant that uses Google's Gemini AI to analyze clinical text and generate structured JSON output based on the [Augmented Clinical Notes dataset](https://huggingface.co/datasets/AGBonnet/augmented-clinical-notes).

## 🏗️ Architecture

- **Frontend**: React application with dark navy blue theme
- **Backend**: Node.js/Express API with Gemini integration
- **Database**: SQLite with clinical notes and structured summaries
- **AI Model**: Google Gemini Pro for text analysis and JSON generation

## 🚀 Quick Start

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Database

```bash
# Populate database with sample data
node populate-db.js
```

### 3. Start Backend Server

```bash
# Start the API server
npm start
# or for development with auto-reload
npm run dev
```

### 4. Start Frontend (in a new terminal)

```bash
cd ../
npm start
```

## 📋 Features

### Frontend
- **Text Input**: Enter medical queries or symptoms
- **File Upload**: Upload medical images (X-ray, MRI, CT scans)
- **Real-time Analysis**: Get instant structured JSON output
- **Three Service Cards**: Treatment Pathway, Clinical Trials, Research

### Backend API
- **RAG Pipeline**: Retrieval-Augmented Generation using similar clinical notes
- **Gemini Integration**: Uses Google's Gemini Pro for text analysis
- **Structured Output**: Generates JSON following medical information template
- **Database Search**: Finds similar cases from clinical notes database

## 🔧 API Endpoints

### POST `/api/analyze`
Analyzes medical text and returns structured JSON.

**Request:**
```json
{
  "text": "Patient presents with chest pain and shortness of breath"
}
```

**Response:**
```json
{
  "success": true,
  "input": "Patient presents with chest pain and shortness of breath",
  "similarNotes": 2,
  "structuredData": {
    "visit motivation": "Chest pain and shortness of breath",
    "patient information": {
      "age": "65",
      "sex": "Female"
    },
    "symptoms": [{
      "name of symptom": "Chest pain, Shortness of breath",
      "intensity of symptom": "Severe",
      "location": "Chest"
    }],
    // ... more structured fields
  }
}
```

### GET `/api/health`
Health check endpoint.

## 📊 Database Schema

The system uses SQLite with the following structure:

```sql
CREATE TABLE clinical_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idx TEXT UNIQUE,
  note TEXT,
  full_note TEXT,
  conversation TEXT,
  summary TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 Medical Information Template

The system generates JSON following this structure:

- **Visit Motivation**: Reason for visit
- **Admission**: Admission details
- **Patient Information**: Demographics and context
- **Medical History**: Physiological and psychological context
- **Surgeries**: Surgical history
- **Symptoms**: Current symptoms with details
- **Medical Examinations**: Physical examination results
- **Diagnosis Tests**: Lab tests and imaging
- **Treatments**: Medications and interventions
- **Discharge**: Discharge planning and follow-up

## 🔑 Configuration

### Environment Variables
Create `backend/config.env`:
```
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
NODE_ENV=development
```

### Gemini API Key
The system is configured with the provided Gemini API key. For production, store it securely in environment variables.

## 🧪 Testing

### Test the API directly:
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Patient has chest pain and difficulty breathing"}'
```

### Test the frontend:
1. Go to `http://localhost:3000`
2. Enter medical text in the text area
3. Click "Analyze & Get Recommendations"
4. View the structured JSON output

## 📁 Project Structure

```
├── backend/
│   ├── server.js              # Main API server
│   ├── populate-db.js         # Database population script
│   ├── package.json           # Backend dependencies
│   └── clinical_notes.db      # SQLite database
├── src/
│   ├── components/
│   │   ├── HomePage.js        # Main input page
│   │   ├── ResultsPage.js     # Three service cards
│   │   └── ...                # Other pages
│   └── App.js                 # React app
└── README.md
```

## 🚨 Important Notes

- **Medical Disclaimer**: This is a research/educational tool, not for medical diagnosis
- **Data Privacy**: Ensure HIPAA compliance for production use
- **API Limits**: Monitor Gemini API usage and costs
- **Database**: Consider upgrading to PostgreSQL for production

## 🔄 Next Steps

1. **Add More Data**: Import more records from the Augmented Clinical Notes dataset
2. **Improve Search**: Implement vector similarity search with embeddings
3. **Add Authentication**: Secure the API endpoints
4. **Deploy**: Deploy to cloud platform (AWS, GCP, Azure)
5. **Monitoring**: Add logging and monitoring

## 🆘 Troubleshooting

### Backend not starting:
- Check if port 5000 is available
- Verify Gemini API key is valid
- Ensure all dependencies are installed

### Frontend can't connect:
- Verify backend is running on port 5000
- Check browser console for CORS errors
- Ensure both servers are running

### Database issues:
- Run `node populate-db.js` to reset database
- Check file permissions for SQLite database
