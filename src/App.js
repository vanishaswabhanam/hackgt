import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ResultsPage from './components/ResultsPage';
import TreatmentPathwayPage from './components/TreatmentPathwayPage';
import ClinicalTrialPage from './components/ClinicalTrialPage';
import ResearchPage from './components/ResearchPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/treatment-pathway" element={<TreatmentPathwayPage />} />
        <Route path="/clinical-trials" element={<ClinicalTrialPage />} />
        <Route path="/research" element={<ResearchPage />} />
      </Routes>
    </div>
  );
}

export default App;

