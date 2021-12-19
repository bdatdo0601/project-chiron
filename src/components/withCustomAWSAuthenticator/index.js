import { useEffect } from "react";
import { Hub } from "@aws-amplify/core";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { get } from "lodash";

import '@aws-amplify/ui-react/styles.css';

export const useAuthenticateEffect = () => {
  useEffect(() => {
    Hub.listen("auth", (res) => {
      console.log(res);
      const errorMsg = get(res, "payload.data.message", "");
      if (errorMsg) {
        console.error(errorMsg, res);
      }
    });
    return () => {
      Hub.remove("auth");
    };
  }, []);
};

const withCustomAuthenticator = (Component) => withAuthenticator(Component, false)

export default withCustomAuthenticator;
