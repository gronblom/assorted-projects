import { v4 as uuidv4 } from 'uuid';

import { NewPatient, Gender, Entry, Diagnosis, HealthCheckEntry, HealthCheckRating, BaseEntry, OccupationalHealthcareEntry, HospitalEntry } from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isNumber = (text: unknown): text is number => {
  return typeof text === "number";
};

const getString = (text: unknown, name: string): string => {
  if (!text || !isString(text)) {
    throw new Error('Incorrect or missing field for ' + name);
  }
  return text;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};


const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

type Fields = { name: unknown, ssn: unknown, dateOfBirth: unknown, occupation: unknown, gender: unknown };

export const toNewPatient = ({ name, ssn, dateOfBirth, occupation, gender }: Fields): NewPatient => {

  const newPatient: NewPatient = {
    name: getString(name, "name"),
    ssn: getString(ssn, "ssn"),
    dateOfBirth: parseDate(dateOfBirth),
    occupation: getString(occupation, "occupation"),
    gender: parseGender(gender),
    entries: []
  };

  return newPatient;
};

type EntryFields = {
  type: unknown,
  description: unknown,
  date: unknown,
  specialist: unknown,
  diagnosisCodes: unknown,
  healthCheckRating: unknown,
  discharge: unknown,
  employerName: unknown,
  sickLeave: unknown
};

export const toNewEntry = (fields: EntryFields): Entry => {
  const commonFields: BaseEntry = {
    id: uuidv4(),
    description: getString(fields.description, "description"),
    date: getString(fields.date, "date"),
    specialist: getString(fields.specialist, "specialist"),
    diagnosisCodes: getDiagnosisCodes(fields.diagnosisCodes)
  };
  const type: string = getString(fields.type, "type");
  switch (type) {
    case "HealthCheck":
      return toNewHealthCheckEntry(commonFields, fields.healthCheckRating);
    case "OccupationalHealthcare":
      return toNewOccupationalHealthEntry(commonFields, fields.employerName, fields.sickLeave);
    case "Hospital":
      return toNewHospitalEntry(commonFields, fields.discharge);
    default:
      throw new Error('Invalid entry type ' + type);
  }
};



const isDiagnosisCodes = (diagnosisCodes: unknown): diagnosisCodes is Array<Diagnosis['code']> => {
  if (!Array.isArray(diagnosisCodes)) {
    return false;
  }
  // Could, of course, also check that the codes are valid
  if (diagnosisCodes.some(value => !isString(value))) {
    return false;
  }
  return true;
};



const getDiagnosisCodes = (diagnosisCodes: unknown): Array<Diagnosis['code']> => {
  if (isDiagnosisCodes(diagnosisCodes)) {
    return diagnosisCodes;
  } else {
    return [];
  }
};


const toNewHealthCheckEntry = (commonFields: BaseEntry, healthCheckRating: unknown): HealthCheckEntry => {
  return {
    type: "HealthCheck",
    ...commonFields,
    healthCheckRating: getHealthCheckRating(healthCheckRating),
  };
};

function getHealthCheckRating(healthCheckRating: unknown): HealthCheckRating {
  if (isNumber(healthCheckRating) && healthCheckRating in HealthCheckRating) {
    return healthCheckRating;
  } else if (isString(healthCheckRating)) {
    // Formik sends as string TODO make it a number
    const ratingEnum = parseInt(healthCheckRating);
    if (ratingEnum && ratingEnum in HealthCheckRating) {
      return ratingEnum;
    }
  }
  throw new Error('Incorrect or missing healthCheckRating ' + healthCheckRating);
}

const toNewOccupationalHealthEntry = (commonFields: BaseEntry, employerName: unknown, sickLeave: unknown): OccupationalHealthcareEntry => {
  return {
    type: "OccupationalHealthcare",
    ...commonFields,
    employerName: getString(employerName, "employerName"),
    sickLeave: getSickLeave(sickLeave)
  };
};

type SickleaveFields = {
  startDate: unknown,
  endDate: unknown
};

const getSickLeave = (sickLeave: unknown): { startDate: string; endDate: string; } | undefined => {

  if (!sickLeave) {
    return undefined;
  }
  if (sickLeave && typeof sickLeave === "object" && "startDate" in sickLeave && "endDate" in sickLeave) {
    return {
      startDate: getString((sickLeave as SickleaveFields).startDate, "startDate"),
      endDate: getString((sickLeave as SickleaveFields).endDate, "endDate")
    };
  }
  throw new Error('Incorrect sickLeave' + sickLeave);
};

const toNewHospitalEntry = (commonFields: BaseEntry, discharge: unknown): HospitalEntry => {
  return {
    type: "Hospital",
    ...commonFields,
    discharge: getDischarge(discharge)
  };
};

type DischargeFields = {
  date: unknown,
  criteria: unknown
};

const getDischarge = (discharge: unknown): { date: string, criteria: string } => {
  if (discharge && typeof discharge === "object" && "date" in discharge && "criteria" in discharge) {
    return {
      date: getString((discharge as DischargeFields).date, "date"),
      criteria: getString((discharge as DischargeFields).criteria, "criteria")
    };
  }
  throw new Error('Incorrect or missing discharge ' + discharge);
};
