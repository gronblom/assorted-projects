import React from "react";
import { Diagnosis } from "../types";

type DiagnosisListProps = {
    diagnosisCodes?: Array<Diagnosis['code']>,
    diagnoses: { [code: string]: Diagnosis }
};

const DiagnosisList = ({ diagnosisCodes, diagnoses }: DiagnosisListProps) => {
    return (
        <ul>
            {diagnosisCodes && diagnosisCodes.map((code: Diagnosis['code']) => (
                <li key={code}>{code} {diagnoses && diagnoses[code] && diagnoses[code].name}</li>
            ))}
        </ul>
    );
};

export default DiagnosisList;