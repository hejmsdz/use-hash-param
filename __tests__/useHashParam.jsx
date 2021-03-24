import React, { useLayoutEffect } from 'react';
import { render } from '@testing-library/react';
import useHashParam from '../src';

const GetterExample = () => {
  const [value] = useHashParam('value');
  return <span>{value}</span>;
};

const DefaultGetterExample = () => {
  const [value] = useHashParam('value', 'default');
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
  beforeEach(() => {
    global.location.hash = '';
  });

  it('sets variable from initial hash value', () => {
    global.location.hash = '#?value=initial';
    const { getByText } = render(<GetterExample />);
    getByText('initial');
  });

  it('updates variable on hash change', () => {
    global.location.hash = '#?value=initial';
    const { findByText } = render(<GetterExample />);
    global.location.hash = '#?value=changed';
    return findByText('changed');
  });

  describe('when default value is given', () => {
    describe('when hash parameter is missing', () => {
      it('sets hash parameter to default value', () => {
        const { getByText } = render(<DefaultGetterExample />);
        getByText('default');
      });
    });

    describe('when hash parameter is present', () => {
      it('uses the given parameter value', () => {
        global.location.hash = '#?value=initial';
        const { getByText } = render(<DefaultGetterExample />);
        getByText('initial');
      });
    });
  });

  describe('setter function', () => {
    it('updates URL hash and variable', () => {
      const { findByText } = render(<SetterExample />);
      return findByText('example')
        .then(() => {
          expect(global.location.hash).toEqual('#?value=example');
        });
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
