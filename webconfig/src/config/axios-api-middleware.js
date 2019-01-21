import axiosClient from './axios';
import axiosMiddleware from 'redux-axios-middleware';

const axiosMiddlewareConfig = {
    returnRejectedPromiseOnError: true
};

export default axiosMiddleware(axiosClient, axiosMiddlewareConfig);
