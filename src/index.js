const { useState, useEffect, useCallback } = require('react');

const getHashSearchParams = (location) => {
  const hash = location.hash.slice(1);
  const [prefix, query] = hash.split('?');
  
  return [prefix, new URLSearchParams(query)];
};

const getHashParam = (key, location = window.location) => {
  const [_, searchParams] = getHashSearchParams(location);
  return searchParams.get(key);
};

const setHashParam = (key, value, location = window.location) => {
  const [prefix, searchParams] = getHashSearchParams(location);

  if (typeof value === 'undefined' || value === '') {
    searchParams.delete(key);
  } else {
    searchParams.set(key, value);
  }

  const search = searchParams.toString();
  location.hash = search ? `${prefix}?${search}` : prefix;
};

const useHashParam = (key, defaultValue) => {
  const [innerValue, setInnerValue] = useState(getHashParam(key));

  useEffect(() => {
    const handleHashChange = () => setInnerValue(getHashParam(key));
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [key]);
  
  const setValue = useCallback((value) => {
    if (typeof value === 'function') {
      setHashParam(key, value(getHashParam(key)));
    } else {
      setHashParam(key, value);
    }
  }, [key]);
  
  return [innerValue || defaultValue, setValue];
};
export default useHashParam;
