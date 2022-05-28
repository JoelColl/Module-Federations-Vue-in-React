import { useEffect, useContext } from 'react';
import { AppContext } from '../Context/AppContext';

const useObservable = (callback) => {
  const observable = useContext(AppContext);

  useEffect(() => {
    observable.subscribe(callback);
    return () => observable.unsubscribe(callback);
  }, []);

  return (data) => observable.publish(data);
};

export { useObservable };
