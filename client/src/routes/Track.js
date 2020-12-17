import { Link, useRouteMatch } from 'react-router-dom';

import PageWrapper from '../PageWrapper';
import AudioPlayer from '../AudioPlayer';

function Track() {
  let match = useRouteMatch();
  return (
    <PageWrapper>
      <h1>Track {match.params.trackSlug}</h1>
      <AudioPlayer />

      {/* TODO: Restrict to only uploader of this track. */}
      <Link to={`${match.url}/feedback`}>View track feedback</Link>
    </PageWrapper>
  )
}

export default Track;