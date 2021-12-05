import { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import { get } from "lodash";

const useGetTextFileFromURL = (url, shouldAutomaticFetch = true) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (fetchURL = url) => {
      let result = "";
      setLoading(true);
      try {
        const res = await Axios.get(fetchURL);
        result = get(res, "data", "");
      } catch (err) {
        setError(err);
      }
      setText(result);
      setLoading(false);
      return result;
    },
    [url]
  );

  useEffect(() => {
    if (shouldAutomaticFetch) {
      fetchData().then();
    }
  }, [fetchData, shouldAutomaticFetch]);

  return {
    text,
    loading,
    error,
  };
};

export default useGetTextFileFromURL;
