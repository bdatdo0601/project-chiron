import React from "react";
import PropTypes from "prop-types";
import { AmplifyProvider, createTheme } from "@aws-amplify/ui-react";

import { LayoutContextProvider } from "./layout";

const theme = createTheme({
  name: "Chiron-theme",
  tokens: {
    components: {
      button: {
        background: {
          primary: { value: "#3183c5" }
        }
      }
    }
  },
  overrides: []
});

export default function ContextProvider({ children }) {
  return (
    <AmplifyProvider theme={theme}>
      <LayoutContextProvider>{children}</LayoutContextProvider>
    </AmplifyProvider>
  );
}

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
