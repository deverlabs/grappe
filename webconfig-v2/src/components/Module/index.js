/* @flow */

import React from 'react';
import cn from 'classnames';
import styles from './styles.scss';

type Props = {
    pos: 'left' | 'right',
    module: Object,
    id: Number
};

export default ({ pos, module, id }: Props) => {
  const imgTypes = {
    'btn-red': 'images/comps/btn-red.png',
    'btn': 'images/comps/btn.png',
    'btns': 'images/comps/btns.png',
    'molette': 'images/comps/molette.png',
    'potard': 'images/comps/potard.png',
    'push-btn': 'images/comps/push-btn.png'
  };

  return (
    <div className={cn([ styles['pad-btn'], styles[pos] ])} id={id}>
      <div className={styles.component}>
        <img src={imgTypes[module.type]} alt={imgTypes[module.type]} />
      </div>
    </div>
  );
};
