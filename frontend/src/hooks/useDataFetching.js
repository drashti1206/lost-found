import { useState, useEffect } from 'react';

const cache = new Map();

export const useDataFetching = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Check cache first
        if (cache.has(url)) {
          setData(cache.get(url));
          setLoading(false);
          return;
        }

        const response = await fetch(url, options);
        const result = await response.json();

        // Cache the result
        cache.set(url, result);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}; 