import { useState, useEffect } from 'react';

function useFetchData(url) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Nếu không có URL thì không làm gì cả
    if (!url) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        console.error("Error fetching data: ", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

  }, [url]); // Hook này sẽ chạy lại mỗi khi `url` thay đổi

  return { data, isLoading, error };
}

export default useFetchData;