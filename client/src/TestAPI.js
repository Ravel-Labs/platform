import { useEffect, useState } from 'react';
import axios from 'axios';

function TestAPI() {
  const [message, setMessage] = useState(null)
  useEffect(() => {
    async function callAPI() {
      const res = await axios.get('/testAPI')
      setMessage(res.data)
    }
    callAPI();
  }, [])

  return (
    <div>
      {message && (
        <div>{message}</div>
      )}
    </div>
  )
}

export default TestAPI;