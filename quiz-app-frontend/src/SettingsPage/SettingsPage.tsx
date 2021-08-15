import { Field, Form, Formik } from "formik";
import { Button } from "semantic-ui-react";
import { TextField } from "../components/FormField";

interface Props {
    username: string
    setUsername: (username: string) => void
}

const SettingsPage = ({ username, setUsername }: Props) => {
    return (
        <div>
            <Formik
                initialValues={{ username: username }}
                onSubmit={(values, _actions) => {
                    setUsername(values.username);
                    window.localStorage.setItem('username', values.username);
                }}
                validate={values => {
                    const requiredError = "Field is required";
                    const errors: { [field: string]: string } = {};
                    if (!values.username) {
                        errors.name = requiredError;
                    }
                    return errors;
                }}
                enableReinitialize={true}
            >
                {({ isValid, dirty }) => {
                    return (
                        <Form className="form ui">
                            <Field
                                label="Username"
                                name="username"
                                component={TextField}
                            />
                            <Button
                                type="submit"
                                floated="right"
                                color="teal"
                                disabled={!dirty || !isValid}
                            >
                                Save
                            </Button>
                        </Form>
                    );
                }}

            </Formik>
        </div>
    );
};

export default SettingsPage;