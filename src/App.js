import React, { Suspense } from "react";
import { flatten, groupBy } from "lodash";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Amplify from "@aws-amplify/core";

import awsconfig from "./aws-exports";
import routes, { errorRoutes, ROUTE_TYPE } from "./routes";
import ContextProvider from "./context";
import Layout from "./layout";
import withCustomAWSAuthenticator, {
  useAuthenticateEffect,
} from "./components/withCustomAWSAuthenticator";
import "./App.css";

Amplify.configure({
  ...awsconfig,
});

const groupedRoutes = groupBy(routes, "type.name");
console.log(groupedRoutes);
function App() {
  useAuthenticateEffect();
  return (
    <Router>
      <Layout>
        <Suspense fallback={<span>Loading</span>}>
          <Routes>
            {flatten(Object.keys(groupedRoutes).map((routeType) => {
              const routeTypeData = Object.values(ROUTE_TYPE).find(
                (item) => item.name === routeType
              );
              return groupedRoutes[routeType].map((route) => (
                    <Route
                      key={route.name}
                      element={React.createElement(routeTypeData.withAuth ? withCustomAWSAuthenticator(route.component) : route.component)}
                      path={route.path}
                    />
                  ))
            }))}
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
