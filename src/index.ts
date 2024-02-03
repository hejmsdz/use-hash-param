import { useState, useEffect, useCallback } from 'react';

const getHashSearchParams = (location: Location): [string, URLSearchParams] => {
  const hash = location.hash.slice(1);
  const [prefix, query] = hash.split('?');

  return [prefix, new URLSearchParams(query)];
};

const getHashParam = (key: string, defaultValue?: string) => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  const [, searchParams] = getHashSearchParams(window.location);

  return searchParams.get(key) ?? undefined;
};

const setHashParam = (key: string, value?: string) => {
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

type Updater = (prevValue?: string) => string;
type Setter = (value: (string | Updater | undefined)) => void;

/**
 * @param key The parameter-name to use from the hash-string query string.
 * @param defaultValue A default value to use if the parameter is not specified and on the server.
 * @returns A two-tuple, the first element is the selected param value (either extracted from the hash param or the default value).
 *  The second element is a setter function to change the param value.
 */

const useHashParam = (key: string, defaultValue?: string): [string | undefined, Setter] => {
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

export default useHashParam;
