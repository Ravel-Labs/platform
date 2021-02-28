import axios from "axios";
import { useContext, useState } from "react";
import { Link as RouterLink, Redirect } from 'react-router-dom';
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";

import { UserContext } from '../Context';
import PageWrapper from "../PageWrapper";
import SimpleForm from "../lib/SimpleForm";

const signupFields = [
  {
    label: "Email",
    name: "email",
    type: "email",
    required: true,
  },
  {
    label: "Username",
    name: "username",
    type: "text",
    required: true,
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    required: true,
  },
];

function SignupFooter() {
  return (
    <Grid container>
      <Grid item>
        <Link to="/login" component={RouterLink} variant="body2">
          {"Already have an account? Sign in."}
        </Link>
      </Grid>
    </Grid>
  );
}

function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, onUpdateUser } = useContext(UserContext)
  const [formError, setFormError] = useState(null);

  const onSignupSubmit = async (values) => {
    setIsLoading(true);
    
    try {
      const res = await axios.post("/api/auth/signup", values);
      setIsLoading(false);
      if (res.status === 201) {
        onUpdateUser(res.data.user);
        setFormError(null);
      } else {
        console.log(res)
        setFormError(res.data.errorMessage);
      }
    } catch (e) {
      setIsLoading(false);
      setFormError(e.response.data.errorMessage);
    }
  };

  return (
    <PageWrapper>
      {user?.username && <Redirect to={`/${user?.username}`} />}
      <SimpleForm
        formTitle="Sign Up"
        fields={signupFields}
        isLoading={isLoading}
        onSubmit={onSignupSubmit}
        FooterComponent={SignupFooter}
        errorText={formError}
      />
    </PageWrapper>
  );
}

export default Signup;
