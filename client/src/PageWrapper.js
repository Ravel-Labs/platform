import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    position: "relative",
    padding: "40px 12px",
    maxWidth: "1020px",
    margin: "0 auto",
  },
}));

export default function PageWrapper({ children }) {
  const classes = useStyles();
  return <div className={classes.wrapper}>{children}</div>;
}
