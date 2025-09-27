# Medical Research Assistant

A React web application that helps users get medical treatment recommendations, find clinical trials, and access relevant research papers using AI-powered analysis.

## Features

- **AI-Powered Analysis**: Uses Gemini API to extract structured medical data from text
- **Clinical Trial Finder**: Real-time search of ClinicalTrials.gov with filtering
- **Research Papers**: PubMed integration for relevant medical literature
- **Treatment Pathways**: Personalized recommendations based on analysis
- **Multi-level Search**: Smart search strategies for better results

## Design

- Dark navy blue color scheme (#1a237e)
- Modern, clean interface
- Responsive design
- Smooth navigation between pages
- Real-time data from medical APIs

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- API keys for Gemini and NCBI

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vanishaswabhanam/hackgt.git
   cd hackgt
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

4. **Set up environment variables:**
   ```bash
   # Copy the example file
   cp config.env.example config.env
   
   # Edit config.env and add your API keys:
   # GEMINI_API_KEY=your_gemini_api_key_here
   # NCBI_API_KEY=your_ncbi_api_key_here
   ```

5. **Get API Keys:**
   - **Gemini API**: Get free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **NCBI API**: Get free API key from [NCBI Account Settings](https://www.ncbi.nlm.nih.gov/account/settings/)

6. **Populate the database:**
   ```bash
   node populate-db.js
   ```

7. **Start the servers:**
   
   **Terminal 1 (Backend):**
   ```bash
   cd backend
   npm start
   ```
   
   **Terminal 2 (Frontend):**
   ```bash
   npm start
   ```

8. **Open the application:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5001](http://localhost:5001)

## Usage

1. **Enter medical text** in the input field (e.g., "Patient has breast cancer and needs chemotherapy")
2. **Click "Analyze & Get Recommendations"** to get structured JSON output
3. **Click "View Service Options →"** to see available services
4. **Explore the three services:**
   - **Treatment Pathway Recommendation**: AI-generated treatment suggestions
   - **Clinical Trial Finder**: Real clinical trials with filtering options
   - **Relevant Research**: Latest PubMed articles

## Project Structure

```
src/
├── components/
│   ├── HomePage.js
│   ├── ResultsPage.js
│   ├── TreatmentPathwayPage.js
│   ├── ClinicalTrialPage.js
│   └── ResearchPage.js
├── App.js
├── index.js
└── index.css
```

## Technologies Used

- React 18
- React Router DOM
- CSS3
- HTML5

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

