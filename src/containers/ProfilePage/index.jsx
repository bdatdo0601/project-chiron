import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { get } from "lodash";
import { useAuthenticatedUser } from "../../components/withCustomAWSAuthenticator";
import { useNavigate } from "react-router";

import aws_config from "../../aws-exports";
import RolesControlCenter from "./RolesControlCenter";

const UserHeader = ({ roles, user }) => {
  return (
    <div className="w-full border-4 border-black py-1 px-4 flex">
      <div className="flex-initial mr-8">
        <img
          className="h-32 rounded-full"
          alt={get(user, "authUser.username")}
          src={`https://avatars.dicebear.com/api/bottts/${get(
            user,
            "authUser.username"
          )}.svg`}
        />
      </div>
      <div className="grid content-center">
        <h2 className="text-lg">Hello,</h2>
        <h1 className="text-xl">{get(user, "email")}</h1>
        <h3 className="text-sm italic">Roles: {roles.join(", ")}</h3>
      </div>
    </div>
  );
};

UserHeader.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  user: PropTypes.object.isRequired,
};

const ProfilePage = () => {
  const { ...user } = useAuthenticatedUser();
  const navigate = useNavigate();
  const roles = useMemo(
    () =>
      get(user, "cognito:groups", []).map((item) =>
        item.includes(get(aws_config, "aws_user_pools_id", ""))
          ? `${item.replace(
              `${get(aws_config, "aws_user_pools_id", "")}_`,
              ""
            )} User`
          : item
      ),
    [user]
  );

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="h-screen w-screen py-24 px-8 relative">
      <UserHeader user={user} roles={roles} />
      {roles.map((role) => (
        <RolesControlCenter key={role} role={role} />
      ))}
    </div>
  );
};

export default ProfilePage;
