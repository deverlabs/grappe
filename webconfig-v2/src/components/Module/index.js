/* @flow */

import React from 'react';
import cn from 'classnames';
import styles from './styles.scss';

type Props = {
    pos: 'left' | 'right',
    module: Object,
    id: Number,
    onClick: Function,
    moved: Boolean
};

export default ({ pos, module, id, onClick, moved }: Props) => {
  const imgTypes = {
    'btn-red': 'images/comps/btn-red.png',
    'btn': 'images/comps/btn.png',
    'btns': 'images/comps/btns.png',
    'molette': 'images/comps/molette.png',
    'potard': 'images/comps/potard.png',
    'push-btn': 'images/comps/push-btn.png'
  };

  return (
    <div role="button" onClick={(e) => onClick(id)} className={cn([ styles['pad-btn'], styles[pos] ])} id={id}>
      <div className={cn(styles.component, moved ? styles.componentMoved: null)}>
        <img src={imgTypes[module.uiType]} alt={imgTypes[module.uiType]} />
      </div>
    </div>
  );
};
