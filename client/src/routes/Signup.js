import axios from 'axios';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';

import PageWrapper from '../PageWrapper';
import SimpleForm from '../lib/SimpleForm';

const signupFields = [
  {
    label: "Email",
    name: "email",
    type: "email",
  },
  {
    label: "Username",
    name: "username",
    type: "text",
  },
  {
    label: "Password",
    name: "password",
    type: "password",
  },
]

function Signup() {
  const [shouldDisableForm, setShouldDisableForm] = useState(true);
  const [user, setUser] = useState(null);
  const [formError, setFormError] = useState(null);

  const onSignupSubmit = async (values) => {
    setShouldDisableForm(true)
    try {
      const res = await axios.post("/api/auth/signup", values);
      setShouldDisableForm(false)
      if (res.status === 201) {
        setUser(res.data.user)
        setFormError(null)
      }
    } catch(e) {
      setShouldDisableForm(false)
      setFormError(e.message)
    }
  }

  return (
    <PageWrapper>
      <h1>Signup</h1>
      {user?.username && <Redirect to={`/${user?.username}`} />}
      <SimpleForm 
        fields={signupFields}
        isDisabled={shouldDisableForm}
        onSubmit={onSignupSubmit}
      />
      <div>
        {formError && <div>{formError}</div>}
      </div>
    </PageWrapper>
  )
}

export default Signup;