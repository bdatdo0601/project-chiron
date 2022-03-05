import React from "react";
import PropTypes from "prop-types";

const LayoutContext = React.createContext();

export const LayoutContextProvider = ({ children }) => {
  return <LayoutContext.Provider value={{}}>{children}</LayoutContext.Provider>;
};

LayoutContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LayoutContext;
