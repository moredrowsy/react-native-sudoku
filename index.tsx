import React from 'react';
import { registerRootComponent } from 'expo';
import { store } from './src/storage/store';
import { Provider } from 'react-redux';
import App from './src/components/App';

registerRootComponent(() => (
  <Provider store={store}>
    <App />
  </Provider>
));
