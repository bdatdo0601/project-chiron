import React from "react";
import PropTypes from "prop-types";
import Drawer from "rsuite/Drawer";

const MenuDrawer = ({ isOpen, onClose, ...props }) => {
  return (
    <Drawer open={isOpen} onClose={onClose} placement="left" size="xs" {...props}>
      <Drawer.Header>
        <Drawer.Title>
          <span className="text-2xl font-bold">Project Chiron</span>
        </Drawer.Title>
        <Drawer.Actions />
      </Drawer.Header>
      <Drawer.Body></Drawer.Body>
    </Drawer>
  );
};

MenuDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

export default MenuDrawer;
