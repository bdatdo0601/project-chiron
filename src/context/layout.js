import React, { useState } from "react";
import PropTypes from "prop-types";

const LayoutContext = React.createContext();

export const LayoutContextProvider = ({ children }) => {
  const [layout, setLayout] = useState();
  const [isDark, setIsDark] = useState(true);
  const [animation, setAnimation] = useState(true);
  const [globalAnimation, setGlobalAnimation] = useState(true);

  return (
    <LayoutContext.Provider
      value={{
        layout,
        setLayout,
        isDark,
        setIsDark,
        animation,
        setAnimation,
        globalAnimation,
        setGlobalAnimation,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

LayoutContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LayoutContext;
