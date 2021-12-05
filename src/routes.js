import React from "react";
import { Auth } from "@aws-amplify/auth";
import { Link, useNavigate } from "react-router-dom";

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
    component: () => <Link to="/" />,
    path: "/login",
    exact: true,
    type: ROUTE_TYPE.PRIVATE,
    hidden: async () => isAuthExist(),
  },
  {
    name: "Logout",
    icon: <FontAwesomeIcon icon={faSignOutAlt} />,
    component: ({ history }) => {
      Auth.signOut().then(() => {
        history.replace("/");
      });
      return null;
    },
    path: "/logout",
    exact: true,
    type: ROUTE_TYPE.PRIVATE,
    hidden: async () => !(await isAuthExist()),
  },
];

export default routes;
