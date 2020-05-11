import React from 'react';
import { mount } from 'enzyme';
import LoggerContainer, { useLoggerApi, useLogger } from './LoggerContainer';

let loggerApi;
let logger;
let level;
let message;
let stack;

beforeAll(() => {
  const App = (): JSX.Element => {
    loggerApi = useLoggerApi();
    logger = useLogger();
    return null;
  };

  mount(
    <LoggerContainer
      onError={(s): void => {
        stack = s;
      }}
      stdout={(l, m): void => {
        level = l;
        message = m;
      }}
    >
      <App />
    </LoggerContainer>
  );
});

it('test useLogger hook', () => {
  expect(typeof logger.log === 'function')
    .toBe(true);
  expect(typeof logger.info === 'function')
    .toBe(true);
  expect(typeof logger.debug === 'function')
    .toBe(true);
  expect(typeof logger.warn === 'function')
    .toBe(true);
  expect(typeof logger.error === 'function')
    .toBe(true);
});

['log', 'info', 'debug', 'warn', 'error'].forEach((logMethod) => {
  it(`test logger ${logMethod} method`, () => {
    logger[logMethod](`test ${logMethod} message`);

    expect(level)
      .toBe(logMethod);
    expect(message)
      .toBe(`test ${logMethod} message`);
  });
});

describe('test useLoggerApi', () => {
  it('test getStackData()', async () => {
    const { actions } = loggerApi.getStackData();

    expect(actions.length).toBe(5);
  });

  it('test onError callback', async () => {
    loggerApi.triggerError(loggerApi.getStackData());

    expect(stack.actions.length)
      .toBe(5);
  });
});