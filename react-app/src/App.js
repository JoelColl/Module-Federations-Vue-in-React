import React, { useEffect, useRef, useState } from 'react';
import { mount } from 'vueApp/Sample';

import { useObservable } from './hooks/useObservable';

const App = () => {
  const [count, setCount] = useState(0);
  const publish = useObservable(setCount);
  const ref = useRef(null);

  useEffect(() => {
    mount(ref.current);
  }, []);

  return (
    <div
      style={{
        margin: '10px',
        padding: '10px',
        textAlign: 'center',
        backgroundColor: 'cyan',
      }}
    >
      <h1>This is a React App! {count}</h1>
      <button
        onClick={() => {
          publish(count + 1);
        }}
      >
        Add to count with React
      </button>
      <div ref={ref} />
    </div>
  );
};

export default App;
