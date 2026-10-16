let getTokenFn = null;

export const setTokenGetter = (fn) => {
  getTokenFn = fn;
};

export const getAuthToken = async () => {
  if (!getTokenFn) return null;
  return await getTokenFn();
};