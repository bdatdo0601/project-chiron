import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { WEBSITE_TITLE } from "../../utils/constants";

export default function MainLayout({ children }) {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{WEBSITE_TITLE}</title>
        <link rel="canonical" href={`${window.location.href}`} />
        <meta name="description" content="This is Dat'a Website" />
      </Helmet>
      <main
      >
        {children}
      </main>
    </>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

MainLayout.defaultProps = {
};
