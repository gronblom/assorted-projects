import React from "react";
import { Field } from "formik";
import { Form } from "semantic-ui-react";
import { HealthCheckRating } from "../types";
//import { HealthCheckRating } from "../types";

// structure of a single option
export type HealthCheckRatingOption = {
  value: HealthCheckRating;
  label: string
};

// props for select field component
type SelectFieldProps = {
  name: string;
  label: string;
  options: HealthCheckRatingOption[];
};

export const SelectField = ({
  name,
  label,
  options
}: SelectFieldProps) => (
  <Form.Field>
    <label>{label}</label>
    <Field as="select" name={name} className="ui dropdown">
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Field>
  </Form.Field>
);