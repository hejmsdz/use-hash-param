import React from 'react';
import useHashParam from 'use-hash-param';

export default function ControlledInput() {
  const [name, setName] = useHashParam('name');

  return (
    <input
      value={name || ''}
      onChange={(e) => setName(e.target.value)}
    />
  );
}
