import React from "react";
import PropTypes from "prop-types";
import { LayoutContextProvider } from "./layout";

export default function ContextProvider({ children }) {
  return (
    <LayoutContextProvider>
        {children}
    </LayoutContextProvider>
  );
}

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
