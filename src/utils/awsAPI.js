import { API, graphqlOperation } from "@aws-amplify/api";
import { Auth } from "aws-amplify";
import { get, lowerCase, merge, set } from "lodash";
import { useCallback, useEffect, useState } from "react";

const ADMIN_QUERIES_API_NAME = "AdminQueries";

const DefaultAdminQueriesConfig = {
  // responseMapper: (data) => [data],
  // errorMapper: (data) => get(data, "message", "Error: Unknown"),
  // limit: 60,
  // fetchAll: true
};

export const useAdminQueriesAPI = (
  type,
  path,
  requestData,
  config = DefaultAdminQueriesConfig,
  isLazy = false
) => {
  const [responseData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextToken, setNextToken] = useState(undefined);

  const fetchMore = useCallback(async () => {
    try {
      setLoading(true);
      const dataMapper = get(config, "responseMapper", (data) => [data]);
      const requestObj = {
        ...(requestData || {}),
        headers: {
          "Content-Type": "application/json",
          Authorization: `${(await Auth.currentSession())
            .getAccessToken()
            .getJwtToken()}`,
        },
      };
      if (path.includes("/list")) {
        set(requestObj, "queryStringParameters", {
          limit: get(config, "limit", 60),
          nextToken,
          ...get(requestObj, "queryStringParameters", {}),
        });
      }
      let { NextToken: initalNextToken, ...initialRestData } = await API[
        lowerCase(type)
      ](ADMIN_QUERIES_API_NAME, path, requestObj);
      setNextToken(initalNextToken);
      const result = dataMapper(initialRestData);
      if (get(config, "fetchAll", false) && path.includes("/list")) {
        let token = initalNextToken;
        while (token) {
          set(requestObj, "queryStringParameters", {
            limit: get(config, "limit", 60),
            nextToken: token,
          });
          const { NextToken, ...rest } = await API[lowerCase(type)](
            ADMIN_QUERIES_API_NAME,
            path,
            requestObj
          );
          result.push(...dataMapper(rest));
          token = NextToken;
        }
      }

      setResponseData((previouseResult) =>
        nextToken ? result : [...previouseResult, ...result]
      );
      setLoading(false);
      setError(null);
      return result;
    } catch (err) {
      const errorMapper = get(config, "errorMapper", (data) =>
        get(data, "message", "Error: Unknown")
      );
      setLoading(false);
      setError(errorMapper(err));
      return null;
    }
  }, [config, nextToken, path, requestData, type]);

  const refetch = useCallback(() => {
    setNextToken(undefined);
  }, []);

  useEffect(() => {
    if (!isLazy) {
      fetchMore().then();
    }
    // eslint-disable-next-line
  }, [isLazy]);

  return [responseData, loading, error, fetchMore, refetch];
};

export const useAWSAPI = (
  operation,
  input,
  authMode = "AMAZON_COGNITO_USER_POOLS"
) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const execute = useCallback(
    async (variables = input, ...args) => {
      try {
        setLoading(true);
        const formattedOperation = graphqlOperation(
          operation,
          variables,
          ...args
        );
        const retrievedData = await API.graphql({
          ...formattedOperation,
          authMode,
        });
        setData(retrievedData);
        setLoading(false);
        return retrievedData;
      } catch (err) {
        console.error(err);
        setError(err);
        setLoading(false);
        return {};
      }
    },
    [input, operation, authMode]
  );

  const fetchMore = useCallback(
    async (token, ...args) => {
      try {
        setLoading(true);
        if (token) {
          const formattedOperation = graphqlOperation(
            operation,
            { nextToken: token },
            ...args
          );
          const retrievedData = await API.graphql({
            ...formattedOperation,
            authMode,
          });
          setData((currentData) => merge(currentData, retrievedData));
          setLoading(false);
          return retrievedData;
        }
      } catch (err) {
        setError(err);
        setLoading(false);
        return {};
      }
    },
    [authMode, operation]
  );

  useEffect(() => {
    execute().then();
  }, [execute]);

  return {
    data,
    loading,
    error,
    execute,
    fetchMore,
  };
};

export const useSubscriptionAWSAPI = (
  subscription,
  onNext,
  onError,
  authMode = "AMAZON_COGNITO_USER_POOLS"
) => {
  useEffect(() => {
    const subsInstance = API.graphql({
      ...graphqlOperation(subscription),
      authMode,
    }).subscribe({
      next: onNext,
      error: onError,
    });
    return () => {
      subsInstance.unsubscribe();
    };
  }, [onError, onNext, subscription, authMode]);
};

export const useLazyAWSAPI = (
  operation,
  input,
  authMode = "AMAZON_COGNITO_USER_POOLS"
) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const execute = useCallback(
    async (variables = input, ...args) => {
      try {
        setLoading(true);
        const formattedOperation = graphqlOperation(
          operation,
          variables,
          ...args
        );
        const retrievedData = await API.graphql({
          ...formattedOperation,
          authMode,
        });
        setData(retrievedData);
        setLoading(false);
        return retrievedData;
      } catch (err) {
        setError(err);
        setLoading(false);
        throw err;
      }
    },
    [input, operation, authMode]
  );

  const fetchMore = useCallback(
    async (token, ...args) => {
      try {
        setLoading(true);
        if (token) {
          const formattedOperation = graphqlOperation(
            operation,
            { nextToken: token },
            ...args
          );
          const retrievedData = await API.graphql({
            ...formattedOperation,
            authMode,
          });
          setData((currentData) => merge(currentData, retrievedData));
          setLoading(false);
          return retrievedData;
        }
      } catch (err) {
        setError(err);
        setLoading(false);
        return {};
      }
    },
    [authMode, operation]
  );

  return {
    data,
    loading,
    error,
    execute,
    fetchMore,
  };
};
