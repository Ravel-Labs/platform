import axios from 'axios';
import { useState } from 'react';
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
    <div>
      <p className={styles.PromptText}>{prompt.prompt}</p>
      <div>
        {values.map((val) => {
          const classname = classNames({
            [styles.PromptOption]: true,
            [styles.PromptOption_Selected]: selectedVal === val,
          });
          return (
            <span key={val} onClick={onClickRating.bind(this, val)} className={classname}>
              {val}
            </span>
          )
        })}
      </div>
      <button onClick={onSubmitRating} disabled={selectedVal === null}>Submit</button>
    </div>
  )
}

export default FeedbackPromptForm;