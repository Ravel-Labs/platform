import axios from 'axios';
import { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';

import PageWrapper from '../PageWrapper';
import SimpleForm from '../lib/SimpleForm';
import { UserContext } from '../Context';

const loginFields = [
  {
    label: "Email",
    name: "email",
    type: "email",
  },
  {
    label: "Password",
    name: "password",
    type: "password",
  },
]

function Login() {
  const [shouldDisableForm, setShouldDisableForm] = useState(true);
  const [formError, setFormError] = useState(null);
  const { user, onUpdateUser } = useContext(UserContext)

  const onLoginSubmit = async (values) => {
    setShouldDisableForm(true)
    try {
      const res = await axios.post("/auth/login", values);
      setShouldDisableForm(false)
      if (res.status === 200) {
        setFormError(null)
        onUpdateUser(res.data.user)
      }
    } catch(e) {
      setShouldDisableForm(false)
      setFormError(e.message)
    }
  }
  return (
    <PageWrapper>
      <h1>Login</h1>
      {user?.username && <Redirect to={`/${user?.username}`} />}
      <SimpleForm 
        fields={loginFields}
        isDisabled={shouldDisableForm}
        onSubmit={onLoginSubmit}
      />
      <div>
        {formError && <div>{formError}</div>}
      </div>
    </PageWrapper>
  )
}

export default Login;