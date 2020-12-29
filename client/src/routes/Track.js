import { useState, useEffect } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import axios from 'axios';

import PageWrapper from '../PageWrapper';
import TrackDisplay from '../TrackDisplay';

function Track() {
  let match = useRouteMatch();
  const { trackSlug } = match.params;
  const [track, setTrack] = useState(null)

  useEffect(() => {
    async function fetchTrack() {
      try {
        const res = await axios.get(`/tracks/${trackSlug}`)
        setTrack(res.data)
      } catch(err) {
        console.error("failed fetching track", err)
      }
    }
    fetchTrack();
  }, [trackSlug])
  return (
    <PageWrapper>
      <TrackDisplay track={track} />
      {/* TODO: Restrict to only uploader of this track. */}
      <Link to={`${match.url}/feedback`}>View track feedback</Link>
    </PageWrapper>
  )
}

export default Track;