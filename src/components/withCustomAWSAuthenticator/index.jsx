import { useCallback, useEffect, useMemo, useState } from "react";
import { Hub } from "@aws-amplify/core";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { get, has } from "lodash";

import Auth from "@aws-amplify/auth";

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

export const useAuthenticatedUser = () => {
  const [authUser, setAuthUser] = useState(null);

  const fetchAuthenticatedUser = useCallback(async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setAuthUser(user);
    } catch (err) {
      console.warn(err);
      setAuthUser(null);
    }
  }, []);

  useEffect(() => {
    fetchAuthenticatedUser().then();

    Hub.listen("auth", async () => {
      await fetchAuthenticatedUser();
    });
    return () => {
      Hub.remove("auth");
    };
  }, [fetchAuthenticatedUser]);

  const authStatusData = useMemo(
    () => ({
      isAuthenticated: has(authUser, "signInUserSession"),
      ...get(authUser, "attributes", {}),
      ...get(authUser, "signInUserSession.idToken.payload", {}),
      Username: get(authUser, "username")
    }),
    [authUser]
  );

  return { authUser, ...authStatusData };
};

const withCustomAuthenticator = (Component) =>
  withAuthenticator(Component, false);

export default withCustomAuthenticator;
