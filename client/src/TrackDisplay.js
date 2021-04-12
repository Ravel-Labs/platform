import { useContext } from "react";
import { Box, Chip, Grid, Link, Typography } from "@material-ui/core";
import {
  Link as RouterLink,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import { TrendingUp } from "@material-ui/icons";

import { UserContext } from "./Context";
import AudioPlayer from "./AudioPlayer";
import FeedbackPromptForm from "./FeedbackPromptForm";

import styles from "./TrackDisplay.module.css";

function TrackDisplay({ track, onFeedbackSubmitted }) {
  const { user } = useContext(UserContext);
  let match = useRouteMatch();
  let location = useLocation();

  const feedbackByPrompt = {};
  const feedback = track?.userFeedback || [];
  feedback.forEach(
    (feedback) => (feedbackByPrompt[feedback.promptId] = feedback)
  );

  return (
    <div className={styles.TrackDisplayGridContainer}>
      <Grid container spacing={6} className={styles.TrackDisplayGrid}>
        {track && (
          <>
            <Grid item xs={12}>
              <AudioPlayer track={track} />
            </Grid>
            <Grid item xs={12} md={2}>
              {/* TODO: Add real play count */}
              {/* <Grid container justify="center" xs={12}>
              <Grid>
                <PlayArrow />
              </Grid>
              <Grid>
                <Typography variant="body1" component="span">
                  123
                </Typography>
              </Grid>
            </Grid> */}
              <Chip label={track.genre} />
            </Grid>
            <Grid item xs={12} md={7}>
              <div>
                {track.prompts.map((prompt) => {
                  return (
                    <FeedbackPromptForm
                      key={prompt.id}
                      prompt={prompt}
                      previousResponse={feedbackByPrompt[prompt.id]}
                      onFeedbackSubmitted={onFeedbackSubmitted}
                    />
                  );
                })}
              </div>
              {!user && (
                <Typography variant="body1">
                  Want to share your thoughts on this track?{" "}
                  <Link
                    to={`/signup?next=${location.pathname}`}
                    component={RouterLink}
                  >
                    Sign up.
                  </Link>
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={3} className={styles.ArtistGridItem}>
              <Typography variant="overline" display="block" gutterBottom>
                From the artist
              </Typography>
              <Typography variant="h2">{track.artist}</Typography>
              <Typography variant="body1">{track.description}</Typography>
              {user?.username === track?.username && (
                <Box paddingTop={2}>
                  <Link to={`${match.url}/stats`} component={RouterLink}>
                    <TrendingUp /> View track stats
                  </Link>
                </Box>
              )}
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
}

export default TrackDisplay;
