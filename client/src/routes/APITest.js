import { useEffect, useState } from 'react';
import axios from 'axios';

import PageWrapper from '../PageWrapper.js';

function APITest() {
  const [message, setMessage] = useState(null)
  useEffect(() => {
    async function callAPI() {
      const res = await axios.get('/testAPI')
      setMessage(res.data)
    }
    callAPI();
  }, [])

  return (
    <PageWrapper>
      <h1>{message ? message : ""}</h1>
    </PageWrapper>
  )
}

export default APITest;