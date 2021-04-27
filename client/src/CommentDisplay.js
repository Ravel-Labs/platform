import axios from "axios";
import { useContext, useState } from "react";
import { Avatar, Button, Grid, Paper, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import MoreActionsMenu from "./MoreActionsMenu";
import { UserContext } from "./Context";

const useStyles = makeStyles({
  paper: {
    padding: "20px 20px 0",
    textAlign: "left",
    marginBottom: "3px",
  },
  displayName: {
    margin: 0,
    textAlign: "left",
  },
  message: {
    textAlign: "left",
  },
  timestamp: {
    textAlign: "left",
    color: "gray",
  },
  editorContainer: {
    width: "100%",
  },
  editorItem: {
    width: "100%",
  },
  inputField: {
    width: "100%",
  },
});

export default function CommentDisplay({ comment, onCommentUpdated }) {
  const classes = useStyles();
  const { user } = useContext(UserContext);
  const [draftMessage, setDraftMessage] = useState(comment.message);
  const [isEditing, setIsEditing] = useState(false);

  const onClickEdit = (e) => {
    setIsEditing(true);
    setDraftMessage(comment.message);
  };

  const moreActions = [
    {
      label: "Edit",
      onClick: onClickEdit,
    },
  ];

  const onSubmitEdit = async () => {
    let payload = { message: draftMessage };
    // Update comment
    try {
      const res = await axios.patch(`/api/comments/${comment.id}`, payload);
      if (res.status === 201) {
        onCommentUpdated(res.data);
      }
    } catch (e) {
      console.error(e);
    }
    setIsEditing(false);
  };

  const onCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <Paper variant="outlined" className={classes.paper}>
      <Grid container wrap="nowrap" spacing={2}>
        <Grid item>
          <Avatar alt={comment.user.displayName} src={comment.user.imagePath} />
        </Grid>
        <Grid item xs zeroMinWidth>
          <h4 className={classes.displayName}>{comment.user.displayName}</h4>
          {isEditing ? (
            <Grid container className={classes.editorContainer}>
              <Grid item className={classes.editorItem}>
                <TextField
                  multiline
                  type="text"
                  value={draftMessage}
                  onChange={(e) => setDraftMessage(e.target.value)}
                  className={classes.inputField}
                />
              </Grid>
              <Grid item>
                <Button onClick={onCancelEdit} color="secondary">
                  Cancel
                </Button>
                <Button onClick={onSubmitEdit} color="primary">
                  Save
                </Button>
              </Grid>
            </Grid>
          ) : (
            <p className={classes.message}>{comment.message}</p>
          )}
          <p className={classes.timestamp}>
            {new Date(comment.createdAt).toLocaleString()}
          </p>
        </Grid>
        {user && user.id === comment.userId && (
          <MoreActionsMenu actions={moreActions} />
        )}
      </Grid>
    </Paper>
  );
}
