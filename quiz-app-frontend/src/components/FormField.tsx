import React from "react";
import { ErrorMessage, Field, FieldProps, FormikProps } from "formik";
import { Dropdown, DropdownProps, Form } from "semantic-ui-react";
import { Category } from "../graphql/generated";

interface TextProps extends FieldProps {
  label: string;
  placeholder: string;
}

export const TextField = ({
  field,
  label,
  placeholder
}: TextProps) => (
  <Form.Field>
    <label>{label}</label>
    <Field placeholder={placeholder} {...field} />
    <div style={{ color: 'red' }}>
      <ErrorMessage name={field.name} />
    </div>
  </Form.Field>
);

interface NumberProps extends FieldProps {
  label: string;
  errorMessage?: string;
  min: number;
  max: number;
}

export const NumberField = ({ field, label, min, max }: NumberProps) => (
  <Form.Field>
    <label>{label}</label>
    <Field {...field} type='number' min={min} max={max} />

    <div style={{ color: 'red' }}>
      <ErrorMessage name={field.name} />
    </div>
  </Form.Field>
);

export const CategorySelection = ({
  categories,
  setFieldValue,
  setFieldTouched
}: {
  categories: Category[],
  setFieldValue: FormikProps<{ categories: Category[] }>["setFieldValue"];
  setFieldTouched: FormikProps<{ categories: Category[] }>["setFieldTouched"];
}) => {
  const field = "categories";
  const onChange = (
    _event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => {
    setFieldTouched(field, true);
    setFieldValue(field, data.value);
  };
  const stateOptions = categories.map(category => ({
    key: category.id,
    text: category.name,
    value: category.id
  }));

  return (
    <Form.Field>
      <label>Categories</label>
      <Dropdown
        fluid
        multiple
        search
        selection
        options={stateOptions}
        onChange={onChange}
        placeholder="All categories"
      />
      <ErrorMessage name={field} />
    </Form.Field>
  );
};

