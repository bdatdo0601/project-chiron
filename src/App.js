import React, { Suspense } from "react";
import { flatten, groupBy } from "lodash";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Amplify from "@aws-amplify/core";

import awsConfig from "./aws-exports";
import routes, { errorRoutes, ROUTE_TYPE } from "./routes";
import ContextProvider from "./context";
import Layout from "./layout";
import withCustomAWSAuthenticator, {
  useAuthenticateEffect,
} from "./components/withCustomAWSAuthenticator";
import "./App.css";

// import default style
import "rsuite/styles/index.less"; // or 'rsuite/dist/rsuite.min.css'

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

// Assuming you have two redirect URIs, and the first is for localhost and second is for production
const [localRedirectSignIn, productionRedirectSignIn] =
  awsConfig.oauth.redirectSignIn.split(",");

const [localRedirectSignOut, productionRedirectSignOut] =
  awsConfig.oauth.redirectSignOut.split(",");

Amplify.configure({
  ...awsConfig,
  oauth: {
    ...awsConfig.oauth,
    redirectSignIn: isLocalhost
      ? localRedirectSignIn
      : productionRedirectSignIn,
    redirectSignOut: isLocalhost
      ? localRedirectSignOut
      : productionRedirectSignOut,
  },
});

// GCP Cloud Auth: https://console.cloud.google.com/apis/credentials?project=chiron-335523&supportedpurview=project

const groupedRoutes = groupBy(routes, "type.name");

function App() {
  useAuthenticateEffect();
  return (
    <Router>
      <Layout>
        <Suspense fallback={<span>Loading</span>}>
          <Routes>
            {flatten(
              Object.keys(groupedRoutes).map((routeType) => {
                const routeTypeData = Object.values(ROUTE_TYPE).find(
                  (item) => item.name === routeType
                );
                return groupedRoutes[routeType].map((route) => (
                  <Route
                    key={route.label}
                    element={React.createElement(
                      routeTypeData.withAuth
                        ? withCustomAWSAuthenticator(route.component)
                        : route.component,
                      {
                        federated: {
                          google_client_id:
                            "449947666042-r4otuk637ahdui9ucn5kpllu6v0sttcj.apps.googleusercontent.com",
                        },
                      }
                    )}
                    path={route.path}
                  />
                ));
              })
            )}
            {errorRoutes.map((route) => (
              <Route
                key={route.name}
                element={React.createElement(route.component)}
                path={route.path}
              />
            ))}
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

const AppWrapper = (props) => (
  <ContextProvider>
    <App {...props} />
  </ContextProvider>
);

export default AppWrapper;
