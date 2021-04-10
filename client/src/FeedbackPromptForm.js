import axios from "axios";
import { useContext, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Box, Button, Grid, Link, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Edit } from "@material-ui/icons";
import classNames from "classnames";

import { UserContext } from "./Context";
import styles from "./FeedbackPromptForm.module.css";

const useStyles = makeStyles((theme) => ({
  score: {
    color: theme.palette.primary.main,
  },
}));

function FeedbackPromptForm({ prompt, previousResponse, onFeedbackSubmitted }) {
  const classes = useStyles();
  const { user } = useContext(UserContext);
  let location = useLocation();
  const values = Array.from(Array(prompt.scale).keys());
  const [selectedVal, setSelectedVal] = useState(null);
  const [isEditingResponse, setIsEditingResponse] = useState(false);

  const onClickRating = (val) => {
    setSelectedVal((prev) => {
      if (prev === val) {
        return null;
      }
      return val;
    });
  };

  const onSubmitRating = async (e) => {
    e.preventDefault();
    const payload = {
      trackId: prompt.trackId,
      promptId: prompt.id,
      value: selectedVal,
    };
    try {
      const res = await axios.post("/api/feedback", payload);
      if (res.status === 201) {
        onFeedbackSubmitted(payload);
        setIsEditingResponse(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.PromptWrapper}>
      <Typography variant="h4" component="h3">
        {prompt.prompt}
      </Typography>
      {!previousResponse || isEditingResponse ? (
        <Box>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            className={styles.PromptOptionGroup}
          >
            {values.map((idx) => {
              const val = idx + 1;
              const classname = classNames({
                [styles.PromptOption]: true,
                [styles.PromptOption_Selected]: selectedVal === val,
              });
              return (
                <span
                  key={val}
                  onClick={onClickRating.bind(this, val)}
                  className={classname}
                >
                  <span className={styles.PromptOptionVal}>{val}</span>
                </span>
              );
            })}
          </Grid>
          <Button
            onClick={onSubmitRating}
            disabled={!user || selectedVal === null}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
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
        </Box>
      ) : (
        <Box>
          <Typography variant="subtitle1">
            Your response:{" "}
            <span
              className={classes.score}
            >{`${previousResponse.value}/${prompt.scale}`}</span>
          </Typography>
          <Button
            startIcon={<Edit />}
            onClick={() => setIsEditingResponse(true)}
            variant="contained"
            color="primary"
          >
            Edit
          </Button>
        </Box>
      )}
    </div>
  );
}

export default FeedbackPromptForm;
