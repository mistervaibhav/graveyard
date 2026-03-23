import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';

import { GlobalStylesProvider } from '@lyskraft/components';
import { persistor, store } from '../redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import AllRoutes from './AllRoutes';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <GlobalStylesProvider>
            <AllRoutes />
            <Toaster />
          </GlobalStylesProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}
