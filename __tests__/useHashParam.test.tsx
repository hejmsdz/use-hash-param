import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import React, { useLayoutEffect } from 'react';
import { render, act, cleanup } from '@testing-library/react';
import useHashParam from '../src';

const GetterExample = () => {
  const [value] = useHashParam('value');
  return <span>{value}</span>;
};

const DefaultGetterExample = () => {
  const [value] = useHashParam('value', 'default');
  return <span>{value}</span>;
};

const buildSetterExample = (setterArg?, defaultValue?) => () => {
  const [value, setValue] = useHashParam('value', defaultValue);
  useLayoutEffect(() => { setValue(setterArg); }, []);
  return <span>{value}</span>;
};

const SetterExample = buildSetterExample('example');
const CallbackSetterExample = buildSetterExample((value) => `${value}${value}`);
const DefaultCallbackSetterExample = buildSetterExample((value) => `${value}${value}`, 'default');
const ResetterExample = buildSetterExample();
const EmptyStringResetterExample = buildSetterExample('');

describe('useHashParam', () => {
  beforeEach(() => {
    global.location.hash = '';
  });

  afterEach(() => {
    cleanup();
  });

  test('sets variable from initial hash value', () => {
    global.location.hash = '#?value=initial';
    const { getByText } = render(<GetterExample />);
    getByText('initial');
  });

  test('updates variable on hash change', () => {
    global.location.hash = '#?value=initial';
    const { findByText } = render(<GetterExample />);
    act(() => {
      global.location.hash = '#?value=changed';
    });
    return findByText('changed');
  });

  describe('when default value is given', () => {
    describe('when hash parameter is missing', () => {
      test('sets hash parameter to default value', () => {
        const { getByText } = render(<DefaultGetterExample />);
        getByText('default');
      });
    });

    describe('when hash parameter is present', () => {
      test('uses the given parameter value', () => {
        global.location.hash = '#?value=initial';
        const { getByText } = render(<DefaultGetterExample />);
        getByText('initial');
      });
    });
  });

  describe('setter function', () => {
    test('updates URL hash and variable', () => {
      const { findByText } = render(<SetterExample />);
      return findByText('example')
        .then(() => {
          expect(global.location.hash).toEqual('#?value=example');
        });
    });

    test('keeps other parameters intact', () => {
      global.location.hash = '#?lorem=ipsum';
      render(<SetterExample />);
      expect(global.location.hash).toEqual('#?lorem=ipsum&value=example');
    });

    test('keeps part before ? intact', () => {
      global.location.hash = '#fragment';
      render(<SetterExample />);
      expect(global.location.hash).toEqual('#fragment?value=example');
    });

    describe('called with a function', () => {
      test('passes current value to the function', () => {
        global.location.hash = '#?value=hello';
        render(<CallbackSetterExample />);
        expect(global.location.hash).toEqual('#?value=hellohello');
      });

      describe('when hash param is not set', () => {
        test('if default value is provided, passes default value to the function', () => {
          global.location.hash = '';
          render(<DefaultCallbackSetterExample />);
          expect(global.location.hash).toEqual('#?value=defaultdefault');
        });

        test("if no default value is provided, passes undefined to the function", () => {
          global.location.hash = '';
          render(<CallbackSetterExample />);
          expect(global.location.hash).toEqual('#?value=undefinedundefined');
        });
      });
    });

    describe('called without arguments', () => {
      test('removes hash parameter', () => {
        global.location.hash = '#?value=example';
        render(<ResetterExample />);
        expect(global.location.hash).toEqual('');
      });

      test('removes hash parameter, keeping part before ?', () => {
        global.location.hash = '#fragment?value=example';
        render(<ResetterExample />);
        expect(global.location.hash).toEqual('#fragment');
      });
    });

    describe('called with an empty string', () => {
      test('removes hash parameter', () => {
        global.location.hash = '#?value=example';
        render(<EmptyStringResetterExample />);
        expect(global.location.hash).toEqual('');
      });

      test('removes hash parameter, keeping part before ?', () => {
        global.location.hash = '#fragment?value=example';
        render(<EmptyStringResetterExample />);
        expect(global.location.hash).toEqual('#fragment');
      });
    });
  });
});
