import axios from "axios";
import { useState } from "react";
import { Button, Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  formWrapper: {
    marginBottom: "18px",
  },
  buttonWrapper: {
    textAlign: "right",
  },
});

function CommentForm({ trackId, onCommentSubmitted }) {
  const classes = useStyles();
  const [commentMessage, setCommentMessage] = useState("");

  // Create comment
  const onSubmit = async () => {
    const payload = {
      message: commentMessage,
      trackId,
    };

    try {
      const res = await axios.post("/api/comments", payload);
      if (res.status === 201) {
        onCommentSubmitted(res.data);
      }
    } catch (e) {
      console.error(e);
      return;
    }

    setCommentMessage("");
  };

  return (
    <Grid container spacing={2} className={classes.formWrapper}>
      <Grid item xs={12}>
        <TextField
          multiline
          variant="outlined"
          placeholder="Share your take..."
          id="comment"
          type="text"
          rows={3}
          value={commentMessage}
          onChange={(e) => setCommentMessage(e.target.value)}
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item className={classes.buttonWrapper}>
        <Button
          onClick={onSubmit}
          color="primary"
          variant="contained"
          disabled={!Boolean(commentMessage.length)}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  );
}

export default CommentForm;
