import axios from "axios";
import { useContext, useState } from "react";
import { Link as RouterLink, Redirect } from "react-router-dom";
import { Container, FormHelperText, Grid, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { UserContext } from "../Context";
import PageWrapper from "../PageWrapper";
import SimpleForm from "../SimpleForm";

const signupFields = [
  {
    label: "Invite Code",
    name: "code",
    type: "text",
    required: true,
    helperText: "Don't have an invite? Reach out to info@ravelmusic.io.",
  },
  {
    label: "Dislay Name",
    name: "displayName",
    type: "text",
    required: true,
    helperText: "Your artist name, or how you want to appear on Ravel.",
  },
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

const useStyles = makeStyles((theme) => ({
  termsContainer: {
    paddingTop: "3vw",
  },
  termsText: {
    textAlign: "center",
  },
}));

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
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const { user, onUpdateUser } = useContext(UserContext);
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
        console.log(res);
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
        formTitle="Join Ravel"
        fields={signupFields}
        isLoading={isLoading}
        onSubmit={onSignupSubmit}
        FooterComponent={SignupFooter}
        errorText={formError}
      />
      <Container className={classes.termsContainer}>
        <FormHelperText className={classes.termsText}>
          By signing up, you agree to our{" "}
          <Link
            href="https://docs.google.com/document/d/1o66wU5GrbpQg6vhLRfke-lf6wnmIVJmY03cAT2_kn0c/edit?usp=sharing"
            target="_blank"
          >
            terms of use
          </Link>{" "}
          and{" "}
          <Link
            href="https://docs.google.com/document/d/1Kui9Ao_1MixtJeVHR47rRTjkQYy9kIKz7DIwJYhtNIA/edit?usp=sharing"
            target="_blank"
          >
            privacy policy
          </Link>
          .
        </FormHelperText>
      </Container>
    </PageWrapper>
  );
}

export default Signup;
