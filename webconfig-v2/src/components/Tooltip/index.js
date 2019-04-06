/* @flow */

import React from 'react';
import styles from './styles.scss';

type Props = {
    pos: 'left' | 'right',
    module: Object
};

export default ({ pos, module }: Props) => {
  return (
    <div className={styles['component-tooltip-container']}>
      <div className={styles['component-tooltip']}>
        <h2>{module.title}</h2>
        <span>{module.desc}</span>
        <div className={pos === 'right' ? styles['line-arrow-left'] : styles['line-arrow']}>
          <svg height="10" width="50">
            <line x1="0" y1="0" x2="50" y2="0" style={{ stroke: 'rgb(255,255,255)', strokeWidth: 3 }} />
          </svg>
        </div>
      </div>
    </div>
  );
};
