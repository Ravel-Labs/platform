import { Chip, Grid, Typography } from "@material-ui/core";
import { PlayArrow } from "@material-ui/icons";

import AudioPlayer from "./AudioPlayer";
import FeedbackPromptForm from "./FeedbackPromptForm";

import styles from "./TrackDisplay.module.css";

function TrackDisplay({ track }) {
  return (
    <Grid container spacing={6} className={styles.TrackDisplayGrid}>
      {track && (
        <>
          <Grid item xs={12}>
            <AudioPlayer track={track} />
          </Grid>
          <Grid item xs={12} md={2}>
            <Grid container justify="center" xs={12}>
              <Grid>
                <PlayArrow />
              </Grid>
              <Grid>
                {/* TODO: Make this real play count */}
                <Typography variant="body1" component="span">
                  123
                </Typography>
              </Grid>
            </Grid>
            <Chip label={track.genre} />
          </Grid>
          <Grid item xs={12} md={7}>
            {track.prompts.map((prompt) => (
              <FeedbackPromptForm key={prompt.id} prompt={prompt} />
            ))}
          </Grid>
          <Grid item xs={12} md={3} className={styles.ArtistGridItem}>
            {/* TODO: Make this real artist info */}
            <Typography variant="h2">Tyler Herro</Typography>
            <Typography variant="body1">
              Flaunting sleek flows, nimble wordplay, unpredictable rhyme
              patterns and vast ambition, Jack Harlow raps with old school
              dedication and raw individuality.
            </Typography>
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default TrackDisplay;
