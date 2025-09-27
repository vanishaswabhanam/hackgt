const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Sample data from the Augmented Clinical Notes dataset
const sampleData = [
  {
    idx: "1",
    note: "Patient presents with acute onset lower back pain during coitus, radiating down the right leg. Initially suspected acute disc prolapse, but MRI showed no evidence of spinal cord pathology. Patient has claudication-type pain in right leg after walking 100 meters. Physical examination revealed absent right leg pulses and blood pressure discrepancy between arms. Abdominal ultrasound demonstrated dissection of the intra-abdominal aorta. CT scan confirmed Type A dissection extending from aortic valve to aortic bifurcation.",
    full_note: "47-year-old male presents with acute onset lower back pain during coitus, radiating down the right leg. Initially suspected acute disc prolapse, but MRI showed no evidence of spinal cord pathology. Patient has claudication-type pain in right leg after walking 100 meters. Physical examination revealed absent right leg pulses and blood pressure discrepancy between arms. Abdominal ultrasound demonstrated dissection of the intra-abdominal aorta. CT scan confirmed Type A dissection extending from aortic valve to aortic bifurcation. Patient has past medical history of hypertension and hyperlipidaemia. Urgent vascular surgical opinion arranged.",
    conversation: "Doctor: Good morning, how can I help you today? Patient: Good morning doctor, I have been experiencing severe lower back pain for the past few weeks. Doctor: I see. Can you tell me more about the pain? When did it start? Patient: It started during coitus and it radiates down my right leg. Doctor: Hmm, I understand. Did you see a doctor before coming here? Patient: Yes, I was referred to a neurosurgeon for an urgent opinion. They thought it might be a disc prolapse. Doctor: I see. And did you have an MRI scan? Patient: Yes, I did. The results showed no evidence of spinal cord pathology. Doctor: That's good news. The findings probably indicate that the pain is musculoskeletal in origin and should settle on its own. Patient: But the pain has increased in severity and I have claudication-type pain in my right leg after walking about 100 meters. Doctor: I see. And has the pain resolved after 6 weeks? Patient: No, it has not. That's why I came back to see my general practitioner. Doctor: Okay, I understand. Can I perform a physical examination on you now? Patient: Yes, of course. Doctor: (performing the examination) There's a past medical history of marked hypertension and hyperlipidaemia, for which you take relevant medications, but none of angina, myocardial infarct or valvular heart disease, correct? Patient: Yes, that's correct. Doctor: Your heart rate is 68 beats per minute and it's regular. The blood pressure in your right arm is 130/70 mmHg, which is lower than that of the left arm 160/80. Cardiac examination is normal. There's no clinical evidence of an abdominal aortic aneurysm. (Examining the limbs) The right lower limb pulses are all absent whilst those of the left leg are present and of good volume. Patient: Hmm, okay. Doctor: I think we need to do an abdominal ultrasound scan to check what's causing the pain. Patient: Okay, sounds good. Doctor: (after the scan) The scan has demonstrated dissection of the intra-abdominal aorta. I would like to arrange a CT scan to confirm the findings. Patient: Sure, I understand. Doctor: (after the CT scan) The CT scan has confirmed that the dissection is a Type A dissection extending from the aortic valve down to the aortic bifurcation. A dissection flap has been identified in the ascending aorta and also in the postero-inferior aspect of the descending aorta. Both lumens. Patient: What does that mean, doctor? Doctor: It means that there's a tear in the wall of your aorta, which is the main blood vessel that carries blood from your heart to the rest of your body. This is a serious condition and requires immediate attention. Patient: What should I do now? Doctor: You need to be admitted to the hospital as soon as possible for further treatment. I will arrange for you to be seen by a vascular surgical team. Patient: Okay, I understand. Thank you, doctor.",
    summary: JSON.stringify({
      "visit motivation": "Acute onset lower back pain during coitus, radiating down the right leg",
      "admission": [{
        "reason": "Acute disc prolapse initially suspected, later vascular surgical opinion for absent right leg pulses and claudication",
        "date": "None",
        "duration": "None",
        "care center details": "None"
      }],
      "patient information": {
        "age": "47",
        "sex": "Male",
        "ethnicity": "None",
        "weight": "None",
        "height": "None",
        "family medical history": "None",
        "recent travels": "None",
        "socio economic context": "None",
        "occupation": "None"
      },
      "patient medical history": {
        "physiological context": "Hypertension, Hyperlipidaemia",
        "psychological context": "None",
        "vaccination history": "None",
        "allergies": "None",
        "exercise frequency": "None",
        "nutrition": "None",
        "sexual history": "None",
        "alcohol consumption": "None",
        "drug usage": "None",
        "smoking status": "None"
      },
      "surgeries": [{
        "reason": "None",
        "Type": "None",
        "time": "None",
        "outcome": "None",
        "details": "None"
      }],
      "symptoms": [{
        "name of symptom": "Lower back pain, Claudication-type pain",
        "intensity of symptom": "Increased severity over 6 weeks",
        "location": "Lower back, right leg",
        "time": "Acute onset, persisted over 6 weeks",
        "temporalisation": "Pain noted after walking approximately 100 metres",
        "behaviours affecting the symptom": "Coitus, walking",
        "details": "Radiated down the right leg"
      }],
      "medical examinations": [{
        "name": "Clinical examination",
        "result": "Absent right leg pulses, blood pressure discrepancy between arms, normal cardiac examination",
        "details": "Right lower limb pulses absent, left leg pulses present and of good volume"
      }],
      "diagnosis tests": [{
        "test": "MRI scan",
        "severity": "None",
        "result": "No evidence of spinal cord pathology",
        "condition": "Initially suspected acute disc prolapse",
        "time": "None",
        "details": "Reassured pain was musculoskeletal in origin"
      }, {
        "test": "Abdominal ultrasound scan",
        "severity": "None",
        "result": "Demonstrated dissection of the intra-abdominal aorta",
        "condition": "None",
        "time": "None",
        "details": "None"
      }, {
        "test": "CT scan",
        "severity": "None",
        "result": "Confirmed Type A dissection from the aortic valve down to the aortic bifurcation",
        "condition": "Aortic dissection",
        "time": "None",
        "details": "Dissection flap identified in the ascending aorta and in the postero-inferior aspect of the descending aorta"
      }],
      "treatments": [{
        "name": "None",
        "related condition": "None",
        "dosage": "None",
        "time": "None",
        "frequency": "None",
        "duration": "None",
        "reason for taking": "None",
        "reaction to treatment": "None",
        "details": "None"
      }],
      "discharge": {
        "reason": "None",
        "referral": "Urgent vascular surgical opinion",
        "follow up": "None",
        "discharge summary": "None"
      }
    })
  },
  {
    idx: "2",
    note: "65-year-old female presents with chest pain and shortness of breath. Patient has history of diabetes and hypertension. ECG shows ST-elevation myocardial infarction. Troponin levels elevated. Patient taken to cardiac catheterization lab for primary PCI.",
    full_note: "65-year-old female with diabetes and hypertension presents with acute chest pain and shortness of breath. ECG shows ST-elevation myocardial infarction in leads II, III, and aVF. Troponin levels significantly elevated. Patient taken emergently to cardiac catheterization lab for primary percutaneous coronary intervention. Successful stent placement in right coronary artery.",
    conversation: "Doctor: What brings you in today? Patient: I have terrible chest pain and can't breathe. Doctor: When did this start? Patient: About 2 hours ago. Doctor: Can you describe the pain? Patient: It's crushing, like an elephant sitting on my chest. Doctor: Any history of heart problems? Patient: I have diabetes and high blood pressure. Doctor: Let me get an ECG right away.",
    summary: JSON.stringify({
      "visit motivation": "Chest pain and shortness of breath",
      "admission": [{
        "reason": "ST-elevation myocardial infarction",
        "date": "None",
        "duration": "None",
        "care center details": "None"
      }],
      "patient information": {
        "age": "65",
        "sex": "Female",
        "ethnicity": "None",
        "weight": "None",
        "height": "None",
        "family medical history": "None",
        "recent travels": "None",
        "socio economic context": "None",
        "occupation": "None"
      },
      "patient medical history": {
        "physiological context": "Diabetes, Hypertension",
        "psychological context": "None",
        "vaccination history": "None",
        "allergies": "None",
        "exercise frequency": "None",
        "nutrition": "None",
        "sexual history": "None",
        "alcohol consumption": "None",
        "drug usage": "None",
        "smoking status": "None"
      },
      "surgeries": [{
        "reason": "None",
        "Type": "None",
        "time": "None",
        "outcome": "None",
        "details": "None"
      }],
      "symptoms": [{
        "name of symptom": "Chest pain, Shortness of breath",
        "intensity of symptom": "Severe",
        "location": "Chest",
        "time": "2 hours ago",
        "temporalisation": "Acute onset",
        "behaviours affecting the symptom": "None",
        "details": "Crushing chest pain"
      }],
      "medical examinations": [{
        "name": "ECG",
        "result": "ST-elevation myocardial infarction",
        "details": "ST-elevation in leads II, III, aVF"
      }],
      "diagnosis tests": [{
        "test": "Troponin",
        "severity": "Elevated",
        "result": "Significantly elevated",
        "condition": "Myocardial infarction",
        "time": "None",
        "details": "None"
      }],
      "treatments": [{
        "name": "Primary PCI",
        "related condition": "STEMI",
        "dosage": "None",
        "time": "None",
        "frequency": "None",
        "duration": "None",
        "reason for taking": "None",
        "reaction to treatment": "None",
        "details": "Successful stent placement in right coronary artery"
      }],
      "discharge": {
        "reason": "None",
        "referral": "None",
        "follow up": "None",
        "discharge summary": "None"
      }
    })
  }
];

// Database setup
const dbPath = path.join(__dirname, 'clinical_notes.db');
const db = new sqlite3.Database(dbPath);

// Initialize database and insert sample data
db.serialize(() => {
  // Create table
  db.run(`CREATE TABLE IF NOT EXISTS clinical_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idx TEXT UNIQUE,
    note TEXT,
    full_note TEXT,
    conversation TEXT,
    summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert sample data
  const stmt = db.prepare(`INSERT OR REPLACE INTO clinical_notes (idx, note, full_note, conversation, summary) VALUES (?, ?, ?, ?, ?)`);
  
  sampleData.forEach((data) => {
    stmt.run(data.idx, data.note, data.full_note, data.conversation, data.summary);
  });
  
  stmt.finalize();
  
  console.log('Sample data inserted successfully!');
  
  // Verify data
  db.all("SELECT COUNT(*) as count FROM clinical_notes", (err, rows) => {
    if (err) {
      console.error('Error counting records:', err);
    } else {
      console.log(`Total records in database: ${rows[0].count}`);
    }
  });
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err);
  } else {
    console.log('Database connection closed.');
  }
});
