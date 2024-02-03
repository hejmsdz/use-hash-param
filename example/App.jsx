import React from 'react';
import useHashParam from '..';

function ControlledInput() {
  const [name, setName] = useHashParam('name');

  return (
    <input
      value={name || ''}
      onChange={(e) => setName(e.target.value)}
    />
  );
}

export default ControlledInput;
