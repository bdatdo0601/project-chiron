import { useEffect, useState, useRef, useCallback } from "react";

const useGetDataList = fetchFn => {
  const isSubscribedRef = useRef(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const dataListFromServer = await fetchFn();
      if (isSubscribedRef.current) {
        setData(dataListFromServer);
      }
    } catch (err) {
      if (isSubscribedRef.current) {
        setData([]);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    getData().then(() => {});
    return () => {
      isSubscribedRef.current = false;
    };
  }, [getData]);

  return {
    loading,
    data,
    refetch: getData,
  };
};

export default useGetDataList;
