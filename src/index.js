const DEFAULT_OPTIONS = {
  response: 0,
  request: 0
};

export default function delayAdapter(adapter, options = {}) {
  const delayOptions = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  const delayProxy = data => {
    if (delayOptions.response) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(data);
        }, delayOptions.response);
      });
    } else {
      return data;
    }
  };

  return function(...apiArguments) {
    const api = () => adapter(...apiArguments).then(delayProxy, delayProxy);

    if (delayOptions.request) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(api());
        }, delayOptions.request);
      });
    } else {
      return api();
    }
  }
};
