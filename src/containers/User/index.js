import React from "react";
import { get } from "lodash";
import { useAuthenticatedUser } from "../../components/withCustomAWSAuthenticator";

const User = () => {
  const { ...user } = useAuthenticatedUser();
  console.log(user);
  return (
    <div className="h-screen w-screen py-24 px-8 relative">
      <div className="w-full border-4 py-8 px-12 flex">
        <div className="flex-initial mr-8">
          <img
            className="h-32 rounded-full border-4 border-gray-900"
            alt={get(user, "authUser.username")}
            src={`https://avatars.dicebear.com/api/bottts/${get(
              user,
              "authUser.username"
            )}.svg`}
          />
        </div>
        <div className="grid content-center">
            <h2 className="text-xl">Hello,</h2>
            <h1 className="text-3xl">{get(user, "email")}</h1>
        </div>
      </div>
    </div>
  );
};

export default User;
