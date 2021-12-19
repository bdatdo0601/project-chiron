import React, { useEffect } from "react";
import { Auth } from "@aws-amplify/auth";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faSignOutAlt,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

export const ROUTE_TYPE = {
  PUBLIC: {
    name: "",
    withAuth: false,
  },
  PRIVATE: {
    name: "Management",
    withAuth: true,
  },
};

const isAuthExist = async () => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    return user !== null;
  } catch (err) {
    return false;
  }
};

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div style={{ color: "red" }}>404 - Error not found</div>

      <button
        color="primary"
        onClick={() => {
          navigate("/");
        }}
      >
        Go Home
      </button>
    </>
  );
};

ErrorPage.propTypes = {};

const SignOutComponent = () => {
  const navigate = useNavigate();
  useEffect(() => {
    console.log("here");
    Auth.signOut().then(() => {
      navigate("/", { replace: true });
    });
  }, [navigate]);
  return <div>Signing Out...</div>;
};

const SignInComponent = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);
  return null;
};

export const errorRoutes = [
  {
    name: "Error",
    component: ErrorPage,
    path: "*",
    hidden: true,
    type: "Error",
  },
];

const routes = [
  {
    name: "Home",
    icon: <FontAwesomeIcon icon={faHome} />,
    component: () => <div>Home</div>,
    path: "/",
    exact: true,
    type: ROUTE_TYPE.PUBLIC,
  },
  {
    name: "Login",
    icon: <FontAwesomeIcon icon={faSignInAlt} />,
    component: SignInComponent,
    path: "/signin",
    exact: true,
    type: ROUTE_TYPE.PRIVATE,
    hidden: async () => isAuthExist(),
  },
  {
    name: "Logout",
    icon: <FontAwesomeIcon icon={faSignOutAlt} />,
    component: SignOutComponent,
    path: "/signout",
    exact: true,
    type: ROUTE_TYPE.PRIVATE,
    hidden: async () => !(await isAuthExist()),
  },
];

export default routes;
