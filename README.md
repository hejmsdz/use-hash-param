# useHashParam

[![Package version on NPM](https://img.shields.io/npm/v/use-hash-param)](https://npmjs.com/package/use-hash-param)
[![Build status](https://img.shields.io/travis/com/hejmsdz/use-hash-param)](https://travis-ci.com/hejmsdz/use-hash-param)
[![Bundle size](https://img.shields.io/bundlephobia/min/use-hash-param)](https://bundlephobia.com/result?p=use-hash-param)

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
