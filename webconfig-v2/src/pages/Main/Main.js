/* @flow */

import React, { Component } from 'react';
import gstyles from '../../theme/global.scss';
import styles from './styles.scss';

type Props = { t: Function, i18n: Object};

export class Main extends Component<Props> {


  constructor(props) {
    super()
  }



  render() {

    return (
      <div>Coucou</div>
    );
  }
}

export default Main;