let subscribers = [];

export const subscribe = (callback) => {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter(sub => sub !== callback);
  };
};

export const publish = () => {
  subscribers.forEach(callback => callback());
};
