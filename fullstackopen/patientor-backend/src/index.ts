import express from 'express';
const app = express();
const cors = require('cors');

import diagnosisService from './service/diagnosisService';
import patientService from './service/patientService';
import { toNewPatient, toNewEntry } from './utils';


app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.get('/api/diagnoses', (_req, res) => {
  res.send(diagnosisService.getEntries());
});

app.get('/api/patients', (_req, res) => {
  res.send(patientService.getPatientsSansSsn());
});

app.get('/api/patients/:patientId', (req, res) => {
  const patient = patientService.getEntries().find(patient => patient.id === req.params.patientId);
  if (patient) {
    res.send(patient);
  } else {
    res.status(400).send("Patient with id does not exist");
  }
});

app.post('/api/patients', (req, res) => {
  try {
    console.log(req.body);
    const newPatientEntry = toNewPatient(req.body);
    const addedEntry = patientService.addPatient(newPatientEntry);
    res.json(addedEntry);
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});

app.post('/api/patients/:patientId/entries', (req, res) => {
  try {
    console.log(req.params);
    console.log(req.body);
    const entry = toNewEntry(req.body);
    const addedEntry = patientService.addEntry(req.params.patientId, entry);
    if (addedEntry) {
      res.json(addedEntry);
    } else {
      res.status(400).send("Failed to add entry");
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
