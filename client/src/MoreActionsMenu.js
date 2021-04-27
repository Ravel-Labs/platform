import React from "react";
import { Button, Menu, MenuItem } from "@material-ui/core";
import { MoreHoriz } from "@material-ui/icons";

export default function MoreActionsMenu({ actions }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onHandleAction = (onSelectHandler) => {
    handleClose();
    onSelectHandler();
  };

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreHoriz color="action" />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {actions.map(({ label, onClick }) => (
          <MenuItem key={label} onClick={() => onHandleAction(onClick)}>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
