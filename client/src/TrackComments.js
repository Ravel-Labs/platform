import axios from "axios";
import { useEffect, useState } from "react";

import CommentDisplay from "./CommentDisplay";
import CommentForm from "./CommentForm";

function TrackComments({ track }) {
  const [trackComments, setTrackComments] = useState([]);

  // TODO: Stop fetching on every component mount.
  useEffect(() => {
    async function fetchTrackComments() {
      try {
        const res = await axios.get(`/api/tracks/${track.slug}/comments`);
        setTrackComments(res.data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchTrackComments();
  }, [track.slug]);

  const onCommentSubmitted = (newComment) => {
    setTrackComments((comments) => [newComment, ...comments]);
  };

  const onCommentUpdated = (newComment) => {
    const newComments = trackComments.map((comment) => {
      if (comment.id === newComment.id) {
        // We only support editing the comment message.
        return {
          ...comment,
          message: newComment.message,
        };
      }
      return comment;
    });

    setTrackComments(newComments);
  };

  return (
    <div>
      <CommentForm trackId={track.id} onCommentSubmitted={onCommentSubmitted} />
      {trackComments.map((comment) => (
        <div key={comment.id}>
          <CommentDisplay
            comment={comment}
            onCommentUpdated={onCommentUpdated}
          />
        </div>
      ))}
    </div>
  );
}

export default TrackComments;
