import { useState, useEffect } from 'react';

const useFetch = (url: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setData(json);
      } catch (err) {
        if (err instanceof Error) {
            setError(err);
          } else {
            setError(new Error("An unexpected error occurred."));
          }
      } finally {
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
