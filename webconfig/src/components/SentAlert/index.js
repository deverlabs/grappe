import React from 'react';
import { Box } from 'grommet';
import { Checkmark } from 'grommet-icons';
import styles from '../Tooltip/styles.scss';

export default () => {
  return (
    <div style={{ zIndex:-1, position: 'fixed', width:'100vw', left:0 }}>
      <Box alignSelf="center" align="center" alignContent="center" justify='center' animation={{
        'type': 'slideDown',
        'duration': 1000,
        'size': 'xlarge',
      }} pad="large">
        <Checkmark color="#228B22" size="62px"/>
      </Box>
    </div>
  );
};
