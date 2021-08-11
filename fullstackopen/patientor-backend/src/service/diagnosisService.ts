import { Diagnosis } from '../types';
import diagnosisData from '../data/diagnoses.json';


const diagnoses: Array<Diagnosis> = diagnosisData as Array<Diagnosis>;

const getEntries = (): Array<Diagnosis> => {
  return diagnoses;
};

export default {
  getEntries
};