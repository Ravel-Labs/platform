import { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import axios from 'axios';

import PageWrapper from '../PageWrapper';

function TrackStats() {
	let match = useRouteMatch();
	const trackSlug = match.params.trackSlug;
  const [stats, setStats] = useState(null);

	useEffect(() => {
		async function fetchStats() {
			try {
				const res = await axios.post(`stats/${trackSlug}`)
        setStats(res.data)
			} catch(err) {
				console.log("failed fetching stats: ", err);
			}
		}
    fetchStats()
	}, [trackSlug])
  return (
    <PageWrapper>
      <div>
        <p>{stats}</p>
      </div>
    </PageWrapper>
  )
}



export default TrackStats;