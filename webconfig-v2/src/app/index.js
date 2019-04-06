/* @flow */

import React, { Component } from 'react';
import { Grommet } from 'grommet';
import { renderRoutes } from 'react-router-config';
import Helmet from 'react-helmet';
import { hot } from 'react-hot-loader';
import c from '../config';
import 'bootstrap/dist/css/bootstrap.css';
import 'normalize.css/normalize.css'; // eslint-disable-line import/first
import SocketProvider, { socketProvider } from '../contexts/Socket';
import styles from './styles.scss';

type Props = { route: Object };

const App = ({ route }: Props) => (
  <SocketProvider>
    <Grommet className={styles.App}>
      <Helmet {...c.app} />
      {/* Child routes won't render without this */}
      {renderRoutes(route.routes)}
    </Grommet>
  </SocketProvider>
);


export default hot(module)(App);
