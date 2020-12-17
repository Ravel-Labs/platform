import { useState, useEffect } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import axios from 'axios';

import PageWrapper from '../PageWrapper';
import AudioPlayer from '../AudioPlayer';

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
      <h1>{track ? track.title : `Fetching ${trackSlug}...`}</h1>
      <div>slug: {trackSlug}</div>
      <AudioPlayer url={track?.url}/>

      {/* TODO: Restrict to only uploader of this track. */}
      <Link to={`${match.url}/feedback`}>View track feedback</Link>
    </PageWrapper>
  )
}

export default Track;