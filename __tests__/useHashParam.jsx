import React, { useLayoutEffect } from 'react';
import { render, waitForElement } from '@testing-library/react';
import useHashParam from '../src';

describe('useHashParam', () => {
  beforeAll(() => {
    global.location.hash = '';
  });

  it('updates URL hash and after the setter is called', () => {
    const Example = () => {
      const [value, setValue] = useHashParam('value');
      useLayoutEffect(() => { setValue('example'); }, []);
      return <span>{value}</span>;
    };

    const { getByText } = render(<Example />);
    getByText('example');
    expect(global.location.hash).toEqual('#?value=example');
  });

  it('sets variable from initial hash value', () => {
    const Example = () => {
      const [value] = useHashParam('value');
      return <span>{value}</span>;
    };

    global.location.hash = '#?value=initial';
    const { getByText } = render(<Example />);
    getByText('initial');
  });

  it('updates variable on hash change', () => {
    const Example = () => {
      const [value] = useHashParam('value');
      return <span>{value}</span>;
    };

    global.location.hash = '#?value=initial';
    const { getByText } = render(<Example />);
    global.location.hash = '#?value=changed';
    return waitForElement(() => getByText('changed'));
  });
});
