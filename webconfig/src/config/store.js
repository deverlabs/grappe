import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import axiosApiMiddleware from './axios-api-middleware';
import rootReducer from '../reducers';

const middlewares = [thunk, axiosApiMiddleware];

if (process.env.NODE_ENV === `development`) {
    const reduxLogger = createLogger({
        colors: false,
        collapsed: true,
        level: {
            prevState: false,
            action: false,
            nextState: 'log'
        },
        stateTransformer: (state) => {
            return {
                ...state
                // order: {
                //     ...state.order,
                //     userOrders: 'FILTERED : ' + state.order.userOrders.length + ' orders'
                // }
            }
        }
    });
    middlewares.push(reduxLogger);
}

const persistConfig = {
    key: 'root',
    storage,
    whitelist: []
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(...middlewares));
const persistor = persistStore(store, {log: true});

export default store;
export {persistor};