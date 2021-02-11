import { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import axios from 'axios';

import PageWrapper from '../PageWrapper';

function StatDisplay({ stat }) {
  return (
    <div>
      {Object.entries(stat).map(([key, val]) => {
        return (
          <div key={key}>
            <span>{key}: </span>
            <span>{val}</span>
          </div>
        )
      })}
    </div>
  )
}

function StatGroupDisplay({ title, stats }) {
  return (
    <div>
      <h2>{title}</h2>
      {(!stats || stats.length === 0) && (
        <div>No stats.</div>
      )}
      {stats?.map((stat) => <div key={stat.promptId}> <StatDisplay stat={stat} /> </div>)}
    </div>
  )
}

function TrackStats() {
	let match = useRouteMatch();
	const trackSlug = match.params.trackSlug;
  const [stats, setStats] = useState([]);

	useEffect(() => {
		async function fetchStats() {
			try {
				const payload = { trackSlug };
        const res = await axios.post(`/stats/${trackSlug}`, payload)
        setStats(res.data)
			} catch(err) {
				console.log("failed fetching stats: ", err);
			}
		}
    fetchStats()
	}, [trackSlug])
  return (
    <PageWrapper>
      <StatGroupDisplay stats={stats?.playbackStats} title="Playback stats" />
      <StatGroupDisplay stats={stats?.feedbackStats} title="Feedback stats" />
    </PageWrapper>
  )
}



export default TrackStats;