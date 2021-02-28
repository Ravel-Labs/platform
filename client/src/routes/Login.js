import axios from 'axios';
import { useContext, useState } from 'react';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";

import PageWrapper from '../PageWrapper';
import SimpleForm from '../lib/SimpleForm';
import { UserContext } from '../Context';

const loginFields = [
  {
    label: "Email",
    name: "email",
    type: "email",
    required: true,
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    required: true,
  },
]

function LoginFooter() {
  return (
    <Grid container>
      <Grid item>
        <Link to="/signup" component={RouterLink} variant="body2">
          {"New to Ravel? Sign up."}
        </Link>
      </Grid>
    </Grid>
  );
}

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const { user, onUpdateUser } = useContext(UserContext)

  const onLoginSubmit = async (values) => {
    setIsLoading(true)
    try {
      const res = await axios.post("/api/auth/login", values);
      setIsLoading(false)
      if (res.status === 200) {
        setFormError(null)
        onUpdateUser(res.data.user)
      }
    } catch(e) {
      setIsLoading(false)
      setFormError(e.response.data.errorMessage)
    }
  }
  return (
    <PageWrapper>
      {user?.username && <Redirect to={`/${user?.username}`} />}
      <SimpleForm 
        formTitle="Sign In"
        fields={loginFields}
        isLoading={isLoading}
        onSubmit={onLoginSubmit}
        FooterComponent={LoginFooter}
        errorText={formError}
      />
    </PageWrapper>
  )
}

export default Login;