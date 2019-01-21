// Exports a root reducer
import { combineReducers } from 'redux';

// import carReducer from './carReducer';

const appReducer = combineReducers({
    //car: carReducer,
});

export default (state, action) => {
    // if(action.type === 'auth/LOGOUT') {
    //     state = undefined;
    // }

    return appReducer(state, action);
}