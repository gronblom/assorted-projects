import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";
import { Form as SemantikForm } from "semantic-ui-react";

import { TextField, CategorySelection, NumberField } from "../components/FormField";
import { Difficulty, MutationCreateQuizArgs, QuestionType } from "../graphql/generated";
import { useQuery } from "@apollo/client";
import { GetCategoriesResponse, GET_CATEGORIES } from "../graphql/queries";
import { LoadingIcon } from "../components/LoadingIcon";

interface Props {
  username: string;
  onSubmit: (values: MutationCreateQuizArgs) => void;
  onCancel: () => void;
}

export const CreateQuizForm = ({ username, onSubmit, onCancel }: Props) => {
  const { loading, data } = useQuery<GetCategoriesResponse>(GET_CATEGORIES);
  if (loading) {
    return (<LoadingIcon />);
  } else if (!data) {
    return (<div>Failed to init form</div>);
  }

  return (
    <Formik
      initialValues={{
        name: "My Quiz",
        created_by: username,
        question_amount: 10,
        difficulty: Difficulty.Any,
        type: QuestionType.Any,
        categories: []
      }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.name) {
          errors.name = requiredError;
        }
        if (!values.question_amount && values.question_amount !== 0) {
            errors.amount = "Field is required to have a numeric value";
        } else if (values.question_amount < 1 || values.question_amount > 1000) {
          errors.amount = "Amount has to be between 1 and 1000 (inclusive interval)";
        }
        return errors;
      }}
    >
      {({ isValid, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <Field
              label="Name"
              placeholder="Name"
              name="name"
              component={TextField}
            />
            <Field
              component={NumberField}
              name="question_amount"
              label="Question amount"
              min={1}
              max={1000}
            />
            <SemantikForm.Field>
              <label>Difficulty</label>
              <Field as="select" name="difficulty" className="ui dropdown">
                {Object.values(Difficulty).map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty.toString().toLowerCase().replace('_', ' ')}
                  </option>
                ))}
              </Field>
            </SemantikForm.Field>
            <SemantikForm.Field>
              <label>Question type</label>
              <Field as="select" name="type" className="ui dropdown">
                {Object.values(QuestionType).map(questionType => (
                  <option key={questionType} value={questionType}>
                    {questionType.toString().toLowerCase().replace('_', ' ')}
                  </option>
                ))}
              </Field>
            </SemantikForm.Field>
            <CategorySelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              categories={data ? Object.values(data.getCategories.categories) : []}
            />
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
                  disabled={!isValid}
                >
                  Create
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CreateQuizForm;
