import { Field, Formik, Form } from 'formik';
import React from 'react';
import { Button, Grid } from 'semantic-ui-react';
import { DiagnosisSelection, TextField } from '../AddPatientModal/FormField';
import { useStateValue } from '../state';
import { HealthCheckEntry, HealthCheckRating, HospitalEntry, OccupationalHealthcareEntry } from '../types';
import { HealthCheckRatingOption, SelectField } from './FormField';

type HealthCheckEntryFormValues = Omit<HealthCheckEntry, "id" | "type">;
type OccupationalHealthcareEntryFormValues = Omit<OccupationalHealthcareEntry, "id" | "type">;
type HospitalEntryFormValues = Omit<HospitalEntry, "id" | "type">;

type MultiType = {
  type: HealthCheckEntry["type"] | OccupationalHealthcareEntry["type"] | HospitalEntry["type"]
};

export type MultiEntryFormValues = MultiType & HealthCheckEntryFormValues & OccupationalHealthcareEntryFormValues & HospitalEntryFormValues;

interface Props {
  onSubmit: (values: MultiEntryFormValues) => void;
  onCancel: () => void;
}

const healthCheckRatingOptions: HealthCheckRatingOption[] = [
  { value: HealthCheckRating.Healthy, label: "Healthy" },
  { value: HealthCheckRating.LowRisk, label: "Low Risk" },
  { value: HealthCheckRating.HighRisk, label: "High Risk" },
  { value: HealthCheckRating.CriticalRisk, label: "Critical Risk" }
];

const isIsoDateFormat = (text: string) => {
  return /\d{4}-\d{2}-\d{2}/.exec(text);
};

const validateForm = (values: MultiEntryFormValues) => {
  const requiredError = "Field is required";
  const invalidDateFormat = `Invalid date, not in format YYYY-MM-DD.`;
  type ValidationErrors = { [field: string]: string | ValidationErrors };
  const errors: ValidationErrors = {};
  if (!values.description) {
    errors.description = requiredError;
  }
  if (!values.date) {
    errors.date = requiredError;
  } else if (!isIsoDateFormat(values.date)) {
    errors.date = invalidDateFormat;
  }
  if (!values.specialist) {
    errors.specialist = requiredError;
  }
  switch (values.type) {
    case ("HealthCheck"):
      // Dropdown menu forces value for HealthCheckRating
      break;
    case ("OccupationalHealthcare"):
      if (!values.employerName) {
        errors.employerName = requiredError;
      }
      if (values.sickLeave) {
        const sickLeaveErrors: ValidationErrors = {};
        if (values.sickLeave.endDate && !values.sickLeave.startDate) {
          sickLeaveErrors.startDate = "Start date is required if end date is set";
        }
        if (values.sickLeave.startDate && !isIsoDateFormat(values.sickLeave.startDate)) {
          sickLeaveErrors.startDate = invalidDateFormat;
        }
        if (values.sickLeave.endDate && !isIsoDateFormat(values.sickLeave.endDate)) {
          sickLeaveErrors.endDate = invalidDateFormat;
        }
        if (Object.keys(sickLeaveErrors).length > 0) {
          errors.sickLeave = sickLeaveErrors;
        }
      }
      break;
    case ("Hospital"):
      const dischargeErrors: ValidationErrors = {};
      if (!values.discharge.criteria) {
        dischargeErrors.criteria = requiredError;
      }
      if (!values.discharge.date) {
        dischargeErrors.date = requiredError;
      } else if (!isIsoDateFormat(values.discharge.date)) {
        dischargeErrors.date = invalidDateFormat;
      }
      if (Object.keys(dischargeErrors).length > 0) {
        errors.discharge = dischargeErrors;
      }
      break;
  }
  return errors;
};

const initialValues = {
  description: "",
  date: "",
  specialist: "",
  diagnosisCodes: [],
  healthCheckRating: HealthCheckRating.Healthy,
  discharge: {
    date: "",
    criteria: ""
  },
  employerName: "",
  sickLeave: {
    startDate: "",
    endDate: ""
  }
};

// Currently all fields are being sent to server. Would be good to prune extra fields type-wise.
const AddMultiEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Formik
      // type is defined here as I did not get the "HealthCheck" typing to work outside Formik
      initialValues={{ ...initialValues, type: "HealthCheck" }}
      onSubmit={onSubmit}
      validate={validateForm}
    >
      {({ values, isValid, dirty, setFieldValue, setFieldTouched, isSubmitting }) => {
        return (
          <Form className="form ui">
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <div id="entry-group">Entry type</div>
            <div role="group" aria-labelledby="entry-group">
              <label>
                <Field type="radio" name="type" value="HealthCheck" />
                Health check
              </label>
              <label>
                <Field type="radio" name="type" value="OccupationalHealthcare" />
                Occupational healthcare
              </label>
              <label>
                <Field type="radio" name="type" value="Hospital" />
                Hospital
              </label>
            </div>

            {values.type === "HealthCheck" && (
              <div>
                <SelectField
                  label="HealthCheckRating"
                  name="healthCheckRating"
                  options={healthCheckRatingOptions}
                />
                <DiagnosisSelection
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  diagnoses={Object.values(diagnoses)}
                />
              </div>)
            }
            {values.type === "OccupationalHealthcare" && (
              <div>
                <Field
                  label="Employer name"
                  placeholder="Employer name"
                  name="employerName"
                  component={TextField}
                />
                <Field
                  label="Sick leave start date"
                  placeholder="Sick leave start date"
                  name="sickLeave.startDate"
                  component={TextField}
                />
                <Field
                  label="Sick leave end date"
                  placeholder="Sick leave end date"
                  name="sickLeave.endDate"
                  component={TextField}
                />
              </div>
            )}
            {values.type === "Hospital" && (
              <div>
                <Field
                  label="Discharge date"
                  placeholder="Discharge date"
                  name="discharge.date"
                  component={TextField}
                />
                <Field
                  label="Discharge criteria"
                  placeholder="Discharge criteria"
                  name="discharge.criteria"
                  component={TextField}
                />
              </div>
            )}
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid || isSubmitting}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddMultiEntryForm;