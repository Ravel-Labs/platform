import { Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import PageWrapper from "../PageWrapper";

const useStyles = makeStyles({
  wrapper: {
    textAlign: "left",
  },
  bodySection: {
    maxWidth: "600px",
    paddingBottom: "2vw",
  },
});

export default function About() {
  const classes = useStyles();
  return (
    <PageWrapper>
      <Container className={classes.wrapper}>
        <Typography variant="body1" className={classes.bodySection}>
          We’re building a digital community for artists and enthusiasts to work
          together. An easy way to get usable feedback on your music from the
          people who matter most.
        </Typography>
        {/* TODO: Request access button */}
        <Typography variant="body1" className={classes.bodySection}>
          We're currently in Beta. Request access now.
        </Typography>
      </Container>
    </PageWrapper>
  );
}
