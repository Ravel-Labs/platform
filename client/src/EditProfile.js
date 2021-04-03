import react, { useState } from "react";
import { 
  Button,
  Dialog,
  DialogActions, 
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField} from "@material-ui/core";

function EditProfile() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleSubmit = () => {
    console.log("submit");
  }

  return (
    <div>
      <Button 
        variant="outlined" 
        onClick={handleClickOpen}
        size="small"
      >
        Edit Profile
      </Button>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="form-dialog-title">Edit your profile</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please take a couple seconds to fill out your profile details.
          </DialogContentText>
          <TextField 
            id="bio" 
            label="Bio" 
            type="text" 
            multiline 
            fullWidth
            variant="outlined" 
            rows="5" 
            rowsMax="10"
          />
          <TextField
            id="website"
            label="Website"
            type="url"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EditProfile;