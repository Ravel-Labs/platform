import React from "react";
import { Avatar, Button, Box, Container, Typography } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import InputField from "./InputField";
import useFormStyles from "./useFormStyles";

/* 
field:
  defaultValue
  label
  name
  required
  type
*/

export default function Form({
  errorText,
  fields,
  FooterComponent,
  formTitle,
  isLoading,
  onSubmit,
  submitText,
}) {
  const classes = useFormStyles();

  const onFormSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const values = {};
    fields.forEach((field) => {
      values[field.name] = form[field.name].value;
    });

    onSubmit(values);
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {formTitle}
        </Typography>
        <form className={classes.form} onSubmit={onFormSubmit} disabled={isLoading}>
          <>
            {fields.map((field, i) => (
              <InputField shouldAutoFocus={i === 0} key={field.name} {...field} />
            ))}
          </>
          {errorText && (<Box color="error.main">{errorText}</Box>)}
          <Button
            fullWidth
            disabled={isLoading}
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {submitText || "Submit"}
          </Button>
          {FooterComponent && <FooterComponent/>}
        </form>
      </div>
    </Container>
  );
}
