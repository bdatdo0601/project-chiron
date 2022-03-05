import React, { useEffect } from "react";
import { Auth } from "@aws-amplify/auth";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faSignOutAlt,
  faHome,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import Home from "./containers/Home";
import ProfilePage from "./containers/ProfilePage";
import ErrorPage from "./containers/ErrorPage";

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


const SignOutComponent = () => {
  const navigate = useNavigate();
  useEffect(() => {
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
    label: "Home",
    value: "Home",
    icon: <FontAwesomeIcon icon={faHome} />,
    component: Home,
    path: "/",
    exact: true,
    type: ROUTE_TYPE.PUBLIC,
  },
  {
    label: "Profile Page",
    value: "Profile Page",
    icon: <FontAwesomeIcon icon={faUser} />,
    component: ProfilePage,
    path: "/profile",
    exact: true,
    type: ROUTE_TYPE.PRIVATE,
    hidden: true,
  },
  {
    label: "Login",
    value: "Login",
    icon: <FontAwesomeIcon icon={faSignInAlt} />,
    component: SignInComponent,
    path: "/signin",
    exact: true,
    type: ROUTE_TYPE.PRIVATE,
    hidden: true,
  },
  {
    label: "Logout",
    value: "Logout",
    icon: <FontAwesomeIcon icon={faSignOutAlt} />,
    component: SignOutComponent,
    path: "/signout",
    exact: true,
    type: ROUTE_TYPE.PRIVATE,
    hidden: true,
  },
];

export default routes;
