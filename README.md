# useHashParam

React hook that allows to keep your state in sync with URL parameters.

## Installation

```sh
npm install --save use-hash-param
```

## Usage

```jsx
import React from 'react';
import useHashParam from 'use-hash-param';

function ControlledInput() {
  const [name, setName] = useHashParam('name');

  return (
    <input value={name || ''} onChange={e => setName(e.target.value)} />
  );
);
```

Anything you type into the input will be reflected in the address bar
(e.g. `http://localhost:3000/#?name=Peter`).
And if you open a link with such a parameter, the field will be populated automatically!

## Example
- [https://codesandbox.io/s/usehashparam-011-example-h8mol](https://codesandbox.io/s/usehashparam-011-example-h8mol)
