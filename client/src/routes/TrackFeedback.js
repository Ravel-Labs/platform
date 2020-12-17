import { Link, useRouteMatch } from 'react-router-dom';

import PageWrapper from '../PageWrapper';

function TrackFeedback() {
  let match = useRouteMatch();
  return (
    <PageWrapper>
      <h1>Feedback for {match.params.trackSlug}</h1>
      <Link to={`/track/${match.params.trackSlug}`}>Back to track</Link>
    </PageWrapper>
  )
}

export default TrackFeedback;