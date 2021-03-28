import { useRef } from 'react';
import {
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle
  } from "@material-ui/core";

function ConfirmDialog({ title, children, open, setOpen, onClose, onConfirm }) {
  const dialogRef = useRef(null);
  return (
    <Dialog
      ref={dialogRef}
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
    <DialogTitle id="confirm-dialog">{title}</DialogTitle>
    <DialogContent>{children}</DialogContent>
    <DialogActions>
      <Button
        variant="contained"
        onClick={() => setOpen(false)}
        color="secondary"
      >
        No
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          setOpen(false);
          onConfirm();
        }}
        color="default"
      >
        Yes
      </Button>
    </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;