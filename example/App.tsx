import React from 'react';
import useHashParam from '..';

function ControlledInput() {
  const [name, setName] = useHashParam('name');

  return (
    <div>
      <input value={name || ""} onChange={(e) => setName(e.target.value)} />
      <button onClick={() => setName()}>reset</button>
      <button onClick={() => setName((val) => `${val}${val}`)}>double</button>
    </div>
  );
}

export default ControlledInput;
