import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";

import { WEBSITE_TITLE } from "../../utils/constants";
import { useAuthenticatedUser } from "../../components/withCustomAWSAuthenticator";
import { get } from "lodash";

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const { isAuthenticated, ...user } = useAuthenticatedUser();
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
        <div className="absolute w-screen z-10 grid-cols-2">
          <div className="p-4 text-right col-span-6 flex-auto">
            {isAuthenticated && (
              <span className="mx-2 border-2 py-2 px-8 rounded-lg text-white">
                Hello, {get(user, "email")}
              </span>
            )}
            {isAuthenticated ? (
              <button
                className="w-100 bg-blue-600 py-2 px-8 rounded-lg text-white"
                onClick={() => {
                  navigate("/signout");
                }}
              >
                Sign Out{" "}
                <FontAwesomeIcon icon={faSignOutAlt} className="ml-2" />
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
