import { useEffect } from "react";
import { Hub } from "@aws-amplify/core";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { get } from "lodash";

export const useAuthenticateEffect = () => {
  useEffect(() => {
    Hub.listen("auth", (res) => {
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

export default withAuthenticator;
