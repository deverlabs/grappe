import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import {Helmet} from 'react-helmet';
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux';
import {persistor, default as store} from './config/store';

import HomeScreen from './screens/HomeScreen';

const AppRouter = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Grape App</title>
            </Helmet>
            <Router>
                <div>
                    <Route path="/" exact component={HomeScreen} />
                </div>
            </Router>
        </PersistGate>
    </Provider>
);

export default AppRouter;
