# Module Federations - Vue in a React app

[Module Federations](https://webpack.js.org/concepts/module-federation/) allows us to build an deploy applications independently.

With module federations we can distinguished between local and remote modules, `Local modules` are the ones that are part of the current applications and the `Remote modules` are the ones that will be loaded from the `container`.

## Exposing modules

So, how do we create this `container`? We just need to use the [ModuleFederationPlugin](https://webpack.js.org/plugins/module-federation-plugin/), this plugin allows us to expose the modules that we want to share in the said `container`.

> ./vue-app/webpack.config.js line 59

```js
new ModuleFederationPlugin({
    name: 'vueApp', // Name of the module
    filename: 'remoteEntry.js', // Name of the auto-generated remote entry file
    exposes: {
        './Sample': './src/bootstrap' // Exposes the modules that we want to share
    },
}),
```

## Consuming exposed Modules

As we did with the remote module we need to tell webpack what we want to consume and from where

> ./react-app/webpack.config.js line 31

```js
new ModuleFederationPlugin({
      name: 'reactApp', // Name of the Module
      remotes: {
        vueApp: 'vueApp@http://localhost:3002/remoteEntry.js', // Remote modules that we want to consume and the container where its served
      },
    }),
```

And now we can use the `vueApp` module in our `react-app` with a simple import

> Slightly changed ./react-app/src/App.js

```jsx
import React, { useEffect, useRef } from 'react';
import { mount } from 'vueApp/Sample'; // We import the exposed module

// Since it is dynamically imported we need to mount it asynchronously
const App = () => {
  const ref = useRef(null);

  useEffect(() => {
    mount(ref.current); // the mount function is exposed by the module and it will attach the component to the ref element we are sending
  }, []);

  return (
    <div>
      <h1>This is a React App!</h1>
      <div ref={ref} /> {/* Node where the vue app will attach to*/}
    </div>
  );
};

export default App;
```

> ./vue-app/src/bootstrap.js

```js
import { createApp } from 'vue';
import Sample from './components/Sample.vue'; // the Bootstrapper picks the component

// We expose an API to mount our component
const mount = (el) => {
  const app = createApp(Sample);
  app.mount(el);
};
```

## Sharing state between apps

Check the [share-state branch](https://github.com/JoelColl/module-federations-vue-in-react/tree/share-state) to learn more on how to share state between the two apps.

## How to run the project

- `npm install` or `yarn`
- `npm run start` or `yarn start`
- Open http://localhost:3001/ for the React App with the vue component in it
- Open http://localhost:3002/ for the standalone Vue App
