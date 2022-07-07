import React, { useRef } from "react";
import PropTypes from "prop-types";
import Drawer from "rsuite/Drawer";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Tree from "rsuite/Tree";
import logo from "../../assets/VietTechMainLogoBlack.png";

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
      <Drawer.Body style={{ paddingTop: 42, paddingLeft: 24, paddingRight: 0 }}>
        <span style={{ marginTop: 24 }}>
          <Link to="/" onClick={onClose}>
            <img src={logo} alt="Viet Tech" style={{ height: 64 }} />
          </Link>
        </span>
        <Tree
          data={routes}
          ref={treeRef}
          defaultExpandAll
          renderTreeNode={(data) => {
            if (data.hidden) {
              return null;
            }
            const Icon = data.icon;
            return (
              <div
                className={`font-bold w-full text-xl`}
                key={data.label}
                style={{
                  color: location.pathname === data.path ? "#005DE3" : ""
                }}
              >
                <span style={{ marginRight: 4 }}>{Icon && <Icon />}</span>{" "}
                {data.label}
              </div>
            );
          }}
          onSelect={(data) => {
            navigate(data.path);
            onClose();
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
