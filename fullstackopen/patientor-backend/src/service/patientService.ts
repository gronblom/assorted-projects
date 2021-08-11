import { Entry, NewPatient, Patient, PatientSansSsn } from '../types';
import { v1 as uuid } from 'uuid';
import patientData from '../data/patients';

const patients: Array<Patient> = patientData;

const getEntries = (): Array<Patient> => {
  return patients;
};

const getPatientsSansSsn = (): PatientSansSsn[] => {
  return patients.map(patient => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ssn, ...rest } = { ...patient };
    return rest;
  });
};

const addPatient = (patient: NewPatient): Patient | null => {
  const newPatient = { ...patient, id: uuid() } as Patient;
  patientData.push(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, entry: Entry): Entry | null => {
  console.log(patientId, entry);
  const patient = getEntries().find(patient => patient.id === patientId);
  if (patient) {
      patient.entries.push(entry);
      return entry;
  } else {
    // Note, should not leak whether patient id exists or not
    console.log("Patient id not found " + patientId);
    return null;
  }
};

export default {
  addPatient,
  getEntries,
  addEntry,
  getPatientsSansSsn
};