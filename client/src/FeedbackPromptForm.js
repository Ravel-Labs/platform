import axios from 'axios';
import { useState } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import classNames from 'classnames';

import styles from './FeedbackPromptForm.module.css';

function FeedbackPromptForm({ prompt }) {
  const values = Array.from(Array(prompt.scale).keys());
  const [selectedVal, setSelectedVal] = useState(null);

  const onClickRating = (val) => {
    setSelectedVal((prev) => {
      if (prev === val) {
        return null
      }
      return val
    })
  }

  const onSubmitRating = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/feedback", {
        trackId: prompt.trackId,
        promptId: prompt.id,
        value: selectedVal,
      })
      if (res.status === 201) {
        console.log("Feedback received.")
      }
    } catch(e) {
      console.error(e)
    }
  }

  return (
    <div className={styles.PromptWrapper}>
      <Typography variant="h4" component="h3">{prompt.prompt}</Typography>
      <Grid container direction="row" justify="center" alignItems="center" className={styles.PromptOptionGroup}>
        {values.map((idx) => {
          const val = idx + 1;
          const classname = classNames({
            [styles.PromptOption]: true,
            [styles.PromptOption_Selected]: selectedVal === val,
          });
          return (
            <span key={val} onClick={onClickRating.bind(this, val)} className={classname}>
              <span className={styles.PromptOptionVal}>{val}</span>
            </span>
          )
        })}
      </Grid>
      <Button onClick={onSubmitRating} disabled={selectedVal === null} variant="contained" color="primary">
        Submit
      </Button>
    </div>
  )
}

export default FeedbackPromptForm;