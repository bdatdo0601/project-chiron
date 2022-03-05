import React from "react";
import PropTypes from "prop-types";
import { AmplifyProvider, createTheme } from "@aws-amplify/ui-react";

import { LayoutContextProvider } from "./layout";
import "./index.css";


/*
 Primary #3183c5 - #315a83
 Secondary #ffc552 - ac8329
 Alert: #cd4120 - 7b1800
 b44a52
 94d5ff
 b44a52
 e67b7b
 b4b4b4
 */

const theme = createTheme({
  name: "Chiron-theme",
  tokens: {
    components: {
      button: {
        background: {
          primary: { value: "#3183c5" },
        },
      },
    },
  },
  overrides: [],
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
