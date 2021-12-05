import { API, graphqlOperation } from "@aws-amplify/api";
import { merge } from "lodash";
import { useCallback, useEffect, useState } from "react";

export const useAWSAPI = (operation, input, authMode = "AMAZON_COGNITO_USER_POOLS") => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const execute = useCallback(
    async (variables = input, ...args) => {
      try {
        setLoading(true);
        const formattedOperation = graphqlOperation(operation, variables, ...args);
        const retrievedData = await API.graphql({ ...formattedOperation, authMode });
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
    async token => {
      try {
        setLoading(true);
        if (token) {
          const formattedOperation = graphqlOperation(operation, { nextToken: token }, ...args);
          const retrievedData = await API.graphql({ ...formattedOperation, authMode });
          setData(currentData => merge(currentData, retrievedData));
        }
        setLoading(false);
        return retrievedData;
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

export const useSubscriptionAWSAPI = (subscription, onNext, onError, authMode = "AMAZON_COGNITO_USER_POOLS") => {
  useEffect(() => {
    const subsInstance = API.graphql({ ...graphqlOperation(subscription), authMode }).subscribe({
      next: onNext,
      error: onError,
    });
    return () => {
      subsInstance.unsubscribe();
    };
  }, [onError, onNext, subscription, authMode]);
};

export const useLazyAWSAPI = (operation, input, authMode = "AMAZON_COGNITO_USER_POOLS") => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const execute = useCallback(
    async (variables = input, ...args) => {
      try {
        setLoading(true);
        const formattedOperation = graphqlOperation(operation, variables, ...args);
        const retrievedData = await API.graphql({ ...formattedOperation, authMode });
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
    async token => {
      try {
        setLoading(true);
        if (token) {
          const formattedOperation = graphqlOperation(operation, { nextToken: token }, ...args);
          const retrievedData = await API.graphql({ ...formattedOperation, authMode });
          setData(currentData => merge(currentData, retrievedData));
        }
        setLoading(false);
        return retrievedData;
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
