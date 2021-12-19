import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";

import { WEBSITE_TITLE } from "../../utils/constants";
import { useAuthenticatedUser } from "../../components/withCustomAWSAuthenticator";

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthenticatedUser();
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{WEBSITE_TITLE}</title>
        <link rel="canonical" href={`${window.location.href}`} />
        <meta
          name="description"
          content="Helping you to build your portfolio"
        />
      </Helmet>
      <main>
        <div className="absolute w-full p-4 z-10 text-right">
          {isAuthenticated ? (
            <button
              className="w-100 bg-blue-600 py-2 px-8 rounded-lg text-white"
              onClick={() => {
                navigate("/signout");
              }}
            >
              Sign Out <FontAwesomeIcon icon={faSignOutAlt} className="ml-2" />
            </button>
          ) : (
            <button
              className="w-100 bg-blue-600 py-2 px-8 rounded-lg text-white"
              onClick={() => {
                navigate("/signin");
              }}
            >
              <FontAwesomeIcon icon={faSignInAlt} className="mr-2" /> Sign In
            </button>
          )}
        </div>
        {children}
      </main>
    </>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

MainLayout.defaultProps = {};
