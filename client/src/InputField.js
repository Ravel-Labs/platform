import React from "react";
import { TextField } from "@material-ui/core";

export default function InputField({ label, name, type, required, defaultValue, shouldAutoFocus }) {
  return (
    <TextField
      fullWidth
      autoFocus={shouldAutoFocus}
      autoComplete={type}
      defaultValue={defaultValue}
      id={name}
      label={label}
      margin="normal"
      name={name}
      required={required}
      type={type}
      variant="outlined"
    />
  );
}
