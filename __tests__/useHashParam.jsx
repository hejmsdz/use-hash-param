import React, { useLayoutEffect } from 'react';
import { render, waitForElement } from '@testing-library/react';
import useHashParam from '../src';

const GetterExample = () => {
  const [value] = useHashParam('value');
  return <span>{value}</span>;
};

const SetterExample = () => {
  const [value, setValue] = useHashParam('value');
  useLayoutEffect(() => { setValue('example'); }, []);
  return <span>{value}</span>;
};

describe('useHashParam', () => {
  beforeAll(() => {
    global.location.hash = '';
  });

  it('updates URL hash and after the setter is called', () => {
    const { getByText } = render(<SetterExample />);
    getByText('example');
    expect(global.location.hash).toEqual('#?value=example');
  });

  it('sets variable from initial hash value', () => {
    global.location.hash = '#?value=initial';
    const { getByText } = render(<GetterExample />);
    getByText('initial');
  });

  it('updates variable on hash change', () => {
    global.location.hash = '#?value=initial';
    const { getByText } = render(<GetterExample />);
    global.location.hash = '#?value=changed';
    return waitForElement(() => getByText('changed'));
  });

  it('keeps other parameters intact when setter is called', () => {
    global.location.hash = '#?lorem=ipsum';
    render(<SetterExample />);
    expect(global.location.hash).toEqual('#?lorem=ipsum&value=example');
  });

  it('keeps part before ? intact when setter is called', () => {
    global.location.hash = '#fragment';
    render(<SetterExample />);
    expect(global.location.hash).toEqual('#fragment?value=example');
  });
});
