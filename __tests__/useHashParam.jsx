import React, { useLayoutEffect } from 'react';
import { render, waitForElement } from '@testing-library/react';
import useHashParam from '../src';

const GetterExample = () => {
  const [value] = useHashParam('value');
  return <span>{value}</span>;
};

const SetterExampleHOC = (...setterArgs) => () => {
  const [value, setValue] = useHashParam('value');
  useLayoutEffect(() => { setValue(...setterArgs); }, []);
  return <span>{value}</span>;
};

const SetterExample = SetterExampleHOC('example');
const CallbackSetterExample = SetterExampleHOC(value => `${value}${value}`);
const ResetterExample = SetterExampleHOC();
const EmptyStringResetterExample = SetterExampleHOC('');

describe('useHashParam', () => {
  beforeAll(() => {
    global.location.hash = '';
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

  describe('setter function', () => {
    it('updates URL hash and variable', () => {
      const { getByText } = render(<SetterExample />);
      getByText('example');
      expect(global.location.hash).toEqual('#?value=example');
    });

    it('keeps other parameters intact', () => {
      global.location.hash = '#?lorem=ipsum';
      render(<SetterExample />);
      expect(global.location.hash).toEqual('#?lorem=ipsum&value=example');
    });
  
    it('keeps part before ? intact', () => {
      global.location.hash = '#fragment';
      render(<SetterExample />);
      expect(global.location.hash).toEqual('#fragment?value=example');
    });

    describe('called with a function', () => {
      it('removes hash parameter', () => {
        global.location.hash = '#?value=cous';
        render(<CallbackSetterExample />);
        expect(global.location.hash).toEqual('#?value=couscous');
      });
    });

    describe('called without arguments', () => {
      it('removes hash parameter', () => {
        global.location.hash = '#?value=example';
        render(<ResetterExample />);
        expect(global.location.hash).toEqual('');
      });

      it('removes hash parameter, keeping part before ?', () => {
        global.location.hash = '#fragment?value=example';
        render(<ResetterExample />);
        expect(global.location.hash).toEqual('#fragment');
      });
    });

    describe('called with an empty string', () => {
      it('removes hash parameter', () => {
        global.location.hash = '#?value=example';
        render(<EmptyStringResetterExample />);
        expect(global.location.hash).toEqual('');
      });

      it('removes hash parameter, keeping part before ?', () => {
        global.location.hash = '#fragment?value=example';
        render(<EmptyStringResetterExample />);
        expect(global.location.hash).toEqual('#fragment');
      });
    });
  });
});
