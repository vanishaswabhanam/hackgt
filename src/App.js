import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import SimpleApolloHomePage from './components/SimpleApolloHomePage';
import ResultsPage from './components/ResultsPage';
import TreatmentPathwayPage from './components/TreatmentPathwayPage';
import ClinicalTrialPage from './components/ClinicalTrialPage';
import ResearchPage from './components/ResearchPage';
import PatientProfilePage from './components/PatientProfilePage';
import FixedHeader from './components/FixedHeader';

function App() {
  return (
    <div className="App">
      <FixedHeader />
      <Routes>
        <Route path="/" element={<SimpleApolloHomePage />} />
        <Route path="/medical" element={<HomePage />} />
        <Route path="/patient-profile" element={<PatientProfilePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/treatment-pathway" element={<TreatmentPathwayPage />} />
        <Route path="/clinical-trials" element={<ClinicalTrialPage />} />
        <Route path="/research" element={<ResearchPage />} />
      </Routes>
    </div>
  );
}

export default App;

