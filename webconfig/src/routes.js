/* @flow */

import App from './app';
import { NotFound, Main } from './pages';

export default [
  {
    component: App,
    routes: [
      {
        path: '/',
        exact: true,
        component: Main, // Add your route here
      },
      { component: NotFound }
    ]
  }
];
