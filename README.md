# Module Federations - Vue in a React app

[Module Federations](https://webpack.js.org/concepts/module-federation/) allows us to build an deploy applications independently.

With module federations we can distinguished between local and remote modules, `Local modules` are the ones that are part of the current applications and the `Remote modules` are the ones that will be loaded from the `container`.

## Sharing state between applications

Another common problem in `micro services` is the sharing of state between applications. There a re bunch of ways to tackle this problem, int his case I have tried using the `Observables` pattern to tackle the issue.

I've installed a library to simplify the global management of the observables but the core concepts are the same.

The idea is simple, we create an `abstraction` layer, in this case the observables and then each app will implement the `subscription` and `publish` pattern the way it wants.

First of all both apps need to know how to target the same observable, this is as simple as defining a common name for both.

For `React` I've created a `Context` to manage the observables.

```jsx
import React, { createContext } from 'react';
import { Observable } from 'windowed-observable';

const AppContext = createContext();

// We create the Observable and define its name, this will be shared between apps if we want to share its state
const observable = new Observable('AppObservable');

const AppProvider = ({ children }) => {
  // We Wrap the children with the Provider so they can have access to the observable
  return (
    <AppContext.Provider value={observable}>{children}</AppContext.Provider>
  );
};

export { AppProvider, AppContext };
```

In `vue` I just implemented it directly in the `component`.

```js
import { ref, onMounted, onUnmounted } from 'vue';
import { Observable } from 'windowed-observable';

const observable = new Observable('AppObservable');

// ...
```

This is pretty much all the needed setup, now we only need to `consume` the observable.

I created a custom hook for `react` that will manage the observable to simplify the work of the components.

```jsx
import { useEffect, useContext } from 'react';
import { AppContext } from '../Context/AppContext';

const useObservable = (callback) => {
  const observable = useContext(AppContext);

  useEffect(() => {
    // We subscribe an action to the observable when mounted
    observable.subscribe(callback);

    // We unSubscribe the action when unmounted
    return () => observable.unsubscribe(callback);
  }, []);

  // We notify all the observers when there is an update
  return (data) => observable.publish(data);
};

export { useObservable };
```

And the component:

```jsx
import React, { useState } from 'react';
import { mount } from 'vueApp/Sample';

import { useObservable } from './hooks/useObservable';

const App = () => {
  const [count, setCount] = useState(0);

  // We send the action when an update happens, in this case setting the new count to the state
  const publish = useObservable(setCount);

  return (
    <>
      <h1>This is a React App! {count}</h1>

      {/* We notify the new count to all the observers*/}
      <button onClick={() => publish(count + 1)}>
        Add to count with React
      </button>
    </>
  );
};

export default App;
```

And we do the same in the `vue` application:

```js
<script setup>
//...

const observable = new Observable('AppObservable');
const count = ref(0);

// We notify all the subscribers with the new count
const addCount = () => observable.publish(count.value + 1);
const countObserver = (_count) => (count.value = _count);

// Subscribe and unSubscribe the action to the Observer
onMounted(() => observable.subscribe(countObserver));
onUnmounted(() => observable.unsubscribe(countObserver));
</script>

<template>
  <h1>This is a Vue App! {{ count }}</h1>
  <button @click="addCount">Add to count with vue</button>
</template>
```

And that is everything, now, when the button in `vue` or `react` is clicked, the count in both apps will be updated since they are now sharing the same `observable` they notify each other and manage the state internally.

## How to run the project

- `npm install` or `yarn`
- `npm run start` or `yarn start`
- Open http://localhost:3001/ for the React App with the vue component in it
- Open http://localhost:3002/ for the standalone Vue App
