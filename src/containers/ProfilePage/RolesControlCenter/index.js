import React from "react";
import PropTypes from "prop-types";
import AdminsControlCenter from "./Admins";
import { capitalize } from "lodash";

const RoleToComponentMap = {
  Admins: AdminsControlCenter,
};

const RolesControlCenter = ({ role, ...props }) => {
  if (!RoleToComponentMap[role]) {
    return null;
  }

  const RoleComponent = RoleToComponentMap[role];

  return (
    <div className="w-full border-4 border-black py-8 px-12 my-4 rounded-xl" style={{ minHeight: "500px" }}>
      <h1 className="text-3xl">{capitalize(role)} Control Center</h1>
      <div className="my-8">
        <RoleComponent role={role} {...props} />
      </div>
    </div>
  );
};

RolesControlCenter.propTypes = {
  role: PropTypes.string.isRequired,
};

export default RolesControlCenter;
