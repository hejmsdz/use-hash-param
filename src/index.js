const { useState, useEffect, useCallback } = require('react');

const getHashSearchParams = (location) => {
  const hash = location.hash.slice(1);
  const [prefix, query] = hash.split('?');

  return [prefix, new URLSearchParams(query)];
};

const getHashParam = (key, defaultValue) => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  const [, searchParams] = getHashSearchParams(window.location);
  return searchParams.get(key);
};

const setHashParam = (key, value) => {
  if (typeof window !== 'undefined') {
    const [prefix, searchParams] = getHashSearchParams(window.location);

    if (typeof value === 'undefined' || value === '') {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }

    const search = searchParams.toString();
    window.location.hash = search ? `${prefix}?${search}` : prefix;
  }
};

const useHashParam = (key, defaultValue) => {
  const [innerValue, setInnerValue] = useState(getHashParam(key, defaultValue));

  useEffect(() => {
    const handleHashChange = () => setInnerValue(getHashParam(key, defaultValue));
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [key]);

  const setValue = useCallback((value) => {
    if (typeof value === 'function') {
      setHashParam(key, value(getHashParam(key, defaultValue)));
    } else {
      setHashParam(key, value);
    }
  }, [key]);

  return [innerValue || defaultValue, setValue];
};
module.exports = useHashParam;
