jest.unmock('../src');

import delayAdapter from '../src';

describe('Delay adapter', () => {
  const resolveAdapter = jest.fn(() => Promise.resolve());
  const rejectAdapter = jest.fn(() => Promise.reject());

  const options = {
    all: {
      request: 1000,
      response: 2000,
      error: 3000
    },
    withoutError: {
      request: 1000,
      response: 2000
    },
    onlyRequest: {
      request: 1000
    }
  };

  it('resolve delay call', (done) => {
    const apiOptions = {
      ...options.all
    };

    const delayApi = delayAdapter(resolveAdapter, apiOptions);

    delayApi().then(() => {
      expect(setTimeout.mock.calls.length).toBe(2);
      expect(setTimeout.mock.calls[1][1]).toBe(apiOptions.response);
      done();
    });

    expect(setTimeout.mock.calls.length).toBe(1);
    expect(setTimeout.mock.calls[0][1]).toBe(apiOptions.request);

    // run request timer
    jest.runAllTimers();

    setImmediate((() => {
      // run response timer
      jest.runAllTimers();
    }));
  });

  it('reject delay call', (done) => {
    const apiOptions = {
      ...options.all
    };

    const delayApi = delayAdapter(rejectAdapter, apiOptions);

    delayApi().then(() => {
      expect(setTimeout.mock.calls.length).toBe(2);
      expect(setTimeout.mock.calls[1][1]).toBe(apiOptions.error);
      done();
    });

    expect(setTimeout.mock.calls.length).toBe(1);
    expect(setTimeout.mock.calls[0][1]).toBe(apiOptions.request);

    // run request timer
    jest.runAllTimers();

    setImmediate((() => {
      // run response timer
      jest.runAllTimers();
    }));
  });

  it('reject delay call without error timer', (done) => {
    const apiOptions = {
      ...options.withoutError
    };

    const delayApi = delayAdapter(rejectAdapter, apiOptions);

    delayApi().then(() => {
      expect(setTimeout.mock.calls.length).toBe(2);
      expect(setTimeout.mock.calls[1][1]).toBe(apiOptions.response);
      done();
    });

    expect(setTimeout.mock.calls.length).toBe(1);
    expect(setTimeout.mock.calls[0][1]).toBe(apiOptions.request);

    // run request timer
    jest.runAllTimers();

    setImmediate((() => {
      // run response timer
      jest.runAllTimers();
    }));
  });

  it('resolve delay call with only request timer', (done) => {
    const apiOptions = {
      ...options.onlyRequest
    };

    const delayApi = delayAdapter(rejectAdapter, apiOptions);

    delayApi().then(() => {
      expect(setTimeout.mock.calls.length).toBe(1);
      done();
    });

    expect(setTimeout.mock.calls.length).toBe(1);
    expect(setTimeout.mock.calls[0][1]).toBe(apiOptions.request);

    // run request timer
    jest.runAllTimers();
  });
});
