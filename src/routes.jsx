import React, { useEffect } from "react";
import { Auth } from "@aws-amplify/auth";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faSignOutAlt,
  faHome,
  faUser,
  faLink,
  faNetworkWired,
  faBookmark,
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
    icon: () => <FontAwesomeIcon style={{ width: 24 }} icon={faHome} />,
    component: Home,
    path: "/",
    exact: true,
    type: ROUTE_TYPE.PUBLIC,
  },
  {
    label: "Best of Viet Tech",
    value: "Home",
    icon: () => <FontAwesomeIcon style={{ width: 24 }} icon={faBookmark} />,
    component: () => {
      const navigate = useNavigate();
      useEffect(() => {
        window.open("https://www.viettech.group");
        navigate("/")
      }, []);
      return null;
    },
    path: "/bestofviettech",
    exact: true,
    type: ROUTE_TYPE.PUBLIC,
  },
  // {
  //   label: "Technical Board",
  //   value: "Technical Board",
  //   icon: () => <FontAwesomeIcon style={{ width: 24 }} icon={faBookmark} />,
  //   component: () => <div>Technical Board</div>,
  //   path: "/technical-board",
  //   exact: true,
  //   type: ROUTE_TYPE.PUBLIC,
  // },
  // {
  //   label: "Links Curator",
  //   value: "Links Curator",
  //   icon: () => <FontAwesomeIcon style={{ width: 24 }} icon={faLink} />,
  //   component: () => <div>Links Curator</div>,
  //   path: "/link-curator",
  //   exact: true,
  //   type: ROUTE_TYPE.PUBLIC,
  // },
  // {
  //   label: "Communities Network",
  //   value: "Communities Network",
  //   icon: () => <FontAwesomeIcon style={{ width: 24 }} icon={faNetworkWired} />,
  //   component: () => <div>Communities Network</div>,
  //   path: "/community-network",
  //   exact: true,
  //   type: ROUTE_TYPE.PUBLIC,
  // },
  {
    label: "Profile Page",
    value: "Profile Page",
    icon: () => <FontAwesomeIcon style={{ width: 24 }} icon={faUser} />,
    component: ProfilePage,
    path: "/profile",
    exact: true,
    type: ROUTE_TYPE.PRIVATE,
    hidden: true,
  },
  {
    label: "Login",
    value: "Login",
    icon: () => <FontAwesomeIcon style={{ width: 24 }} icon={faSignInAlt} />,
    component: SignInComponent,
    path: "/signin",
    exact: true,
    type: ROUTE_TYPE.PRIVATE,
    hidden: true,
  },
  {
    label: "Logout",
    value: "Logout",
    icon: () => <FontAwesomeIcon style={{ width: 24 }} icon={faSignOutAlt} />,
    component: SignOutComponent,
    path: "/signout",
    exact: true,
    type: ROUTE_TYPE.PRIVATE,
    hidden: true,
  },
];

export default routes;
