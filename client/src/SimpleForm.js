import React from "react";
import {
  Avatar,
  Button,
  Box,
  Container,
  TextField,
  Typography,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

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
  SubtitleComponent,
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
        <Typography component="h1" variant="h4">
          {formTitle}
        </Typography>
        {SubtitleComponent && <SubtitleComponent />}
        <form
          className={classes.form}
          onSubmit={onFormSubmit}
          disabled={isLoading}
        >
          <>
            {fields.map((field, i) => (
              <TextField
                fullWidth
                key={field.name}
                autoFocus={i === 0}
                autoComplete={field.type}
                defaultValue={field.defaultValue}
                id={field.name}
                label={field.label}
                margin="normal"
                name={field.name}
                required={field.required}
                type={field.type}
                helperText={field.helperText || ""}
                variant="outlined"
              />
            ))}
          </>
          {errorText && <Box color="error.main">{errorText}</Box>}
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
          {FooterComponent && <FooterComponent />}
        </form>
      </div>
    </Container>
  );
}
