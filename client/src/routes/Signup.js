import axios from "axios";
import { useContext, useState } from "react";
import { Link as RouterLink, Redirect, useLocation } from "react-router-dom";
import {
  Container,
  FormHelperText,
  Grid,
  Link,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import useNextParam from "../useNextParam";
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
    label: "Display Name",
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
    paddingTop: "2vw",
  },
  termsText: {
    textAlign: "center",
  },
}));

function SignupFooter() {
  let { search } = useLocation();
  return (
    <Grid container>
      <Grid item>
        <Link to={`/login${search}`} component={RouterLink} variant="body2">
          {"Already have an account? Sign in."}
        </Link>
      </Grid>
    </Grid>
  );
}

const subtitleStyles = makeStyles((theme) => ({
  subtitle: {
    paddingTop: "2vw",
    paddingBottom: "1vw",
    fontSize: "0.9rem",
  },
}));

function SignupSubtitle() {
  const classes = subtitleStyles();
  return (
    <Typography variant="subtitle1" className={classes.subtitle}>
      <strong>Create an account. Listen to tracks. Help music happen.</strong>{" "}
      Give rising artists feedback on their upcoming releases.
    </Typography>
  );
}

function Signup() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const { user, onUpdateUser } = useContext(UserContext);
  const [formError, setFormError] = useState(null);
  const fallback = user?.username ? `/${user.username}` : "/";
  let nextRoute = useNextParam(fallback);

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
      {user?.username && <Redirect to={nextRoute} />}
      <SimpleForm
        formTitle="Join Ravel"
        fields={signupFields}
        isLoading={isLoading}
        onSubmit={onSignupSubmit}
        SubtitleComponent={SignupSubtitle}
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
