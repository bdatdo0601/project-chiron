import React, { useRef } from "react";
import PropTypes from "prop-types";
import Drawer from "rsuite/Drawer";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Tree from "rsuite/Tree";

import routes from "../../routes";

const MenuDrawer = ({ isOpen, onClose, ...props }) => {
  const treeRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      placement="left"
      size="xs"
      {...props}
    >
      <Drawer.Header>
        <Drawer.Title>
          <Link to="/">
            <span className="text-2xl font-bold">Project Chiron</span>
          </Link>
        </Drawer.Title>
        <Drawer.Actions />
      </Drawer.Header>
      <Drawer.Body style={{ paddingTop: 12, paddingLeft: 0, paddingRight: 0 }}>
        <Tree
          data={routes}
          ref={treeRef}
          defaultExpandAll
          renderTreeNode={(data) => {
            if (data.hidden) {
              return null;
            }
            return (
              <div
                className={`font-bold ${
                  location.pathname === data.path ? "text-blue-700" : ""
                } text-xl`}
                key={data.label}
              >
                {data.label}
              </div>
            );
          }}
          onSelect={(data) => {
            navigate(data.path);
          }}
        />
      </Drawer.Body>
    </Drawer>
  );
};

MenuDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

export default MenuDrawer;
