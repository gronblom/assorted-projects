import { State } from "./state";
import { Diagnosis, Entry, Patient } from "../types";

export type Action =
  | {
    type: "SET_PATIENT_LIST";
    payload: Patient[];
  }
  | {
    type: "SET_DIAGNOSES";
    payload: Diagnosis[];
  }
  | {
    type: "SELECT_PATIENT";
    payload: Patient;
  }
  | {
    type: "ADD_PATIENT";
    payload: Patient;
  }
  | {
    type: "ADD_ENTRY";
    payload: { patientId: string, entry: Entry }
  };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "SET_DIAGNOSES":
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
        }

      };
    case "SELECT_PATIENT":
      return {
        ...state,
        selectedPatient: action.payload
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "ADD_ENTRY":
      let updatedState = state;
      const patientId = action.payload.patientId;
      // Add entry to patient in patient list, even if not in use currently
      if (patientId in state.patients) {
        const patient = state.patients[action.payload.patientId];
        updatedState = {
          ...state,
          patients: {
            ...state.patients,
            [patientId]: {
              ...patient,
              entries: patient.entries.concat(action.payload.entry)
            }
          }
        };
      }
      // Also updated selectedPatient entries (if applies)
      if (!state.selectedPatient || action.payload.patientId !== state.selectedPatient.id) {
        console.log(`Added entry not for currently selected patient ${action.payload.patientId}`);
        return updatedState;
      } else {
        const updatedSelectedPatient = {
          ...state.selectedPatient,
          entries: state.selectedPatient.entries.concat(action.payload.entry)
        };
        return {
          ...updatedState,
          selectedPatient: updatedSelectedPatient
        };
      }
    default:
      return state;
  }
};

export const setPatientList = (patientList: Patient[]): Action => {
  return { type: "SET_PATIENT_LIST", payload: patientList };
};

export const setDiagnoses = (diagnoses: Diagnosis[]): Action => {
  return { type: "SET_DIAGNOSES", payload: diagnoses };
};

export const addPatient = (patient: Patient): Action => {
  return { type: "ADD_PATIENT", payload: patient };
};

export const selectPatient = (patient: Patient): Action => {
  return { type: "SELECT_PATIENT", payload: patient };
};

export const addEntry = (patientId: string, entry: Entry): Action => {
  return { type: "ADD_ENTRY", payload: { patientId, entry } };
};


