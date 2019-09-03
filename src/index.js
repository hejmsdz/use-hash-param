import { useState, useEffect } from 'react';

const getHashParam = (key, location = window.location) => {
  const hash = location.hash.slice(1);
  const searchParams = new URLSearchParams(hash);
  return searchParams.get(key);
};

const useHashParam = (key) => {
  const [value, setValue] = useState();
  useEffect(() => {
    const handleHashChange = () => setValue(getHashParam(key));
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  return value;
};

export default useHashParam;
