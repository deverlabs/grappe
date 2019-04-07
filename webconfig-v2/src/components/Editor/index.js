/* @flow */

/* eslint-disable react/no-array-index-key,  react/prefer-stateless-function */

import React, { Component } from 'react';
import cn from 'classnames';
import { Card } from 'react-bootstrap';
import { Box } from 'grommet';
import { FormClose } from 'grommet-icons';
import styles from './styles.scss';
import presets from './presets';

type Props = {
    modules: Object,
    moduleid: Number,
    onExit: Function,
    onPresetSelect: Function,
    show: Boolean
};

export class Editor extends Component<Props> {
  render() {
    const { show, moduleid, modules, onPresetSelect, onExit } = this.props;

    if(!show) return null;

    const moduleType = modules[moduleid].type;
    const presetsForThisType = presets[moduleType];

    return (
      <Box className={styles.editor}>
        <div className={styles.inline}>
          <h4> Modification du module: {modules[moduleid].title}</h4>
          <FormClose className={styles.close} color='plain' size='32px' onClick={()=> onExit()} />
        </div>
        <Box className={styles.editor} pad="small">
          <div style={{ display: 'flex', flexDirection: 'horizontal', flexWrap: 'wrap', justifyContent: 'left' }}>
            {presetsForThisType.length === 0 ? <p style={{ textAlign: 'center', width: '100%' }}> Aucun preset disponible pour ce type module</p> : null}
            {presetsForThisType.map((e, idx) => (
              <Box key={`${moduleType }__${ idx}`} animation={{
                'type': 'zoomIn',
                'duration': 200,
                'size': 'large',
              }}>
                <Card style={{ width: '13rem', margin: '10px', backgroundColor: '#fafafa' }} className={styles.card} onClick={() => onPresetSelect(e)}>
                  {/** <Card.Img variant="top" src=" /> On peut mettre une image mais flemme * */}
                  <Card.Body>
                    <Card.Title className={styles.cardTitle}>{e.buttonName}</Card.Title>
                    <Card.Text>{e.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Box>
            ))}
          </div>
        </Box>
      </Box>

    );
  }
}

export default Editor;
