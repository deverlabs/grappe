/* @flow */

/* eslint-disable react/no-array-index-key,  react/prefer-stateless-function */

import React, { Component } from 'react';
import cn from 'classnames';
import { Card, Button } from 'react-bootstrap';
import { Box } from 'grommet';
import { FormClose, ChapterAdd, Cli } from 'grommet-icons';
import PresetEditor from './PresetEditor';
import styles from './styles.scss';
import presets from './presets';

type Props = {
    modules: Object,
    moduleid: Number,
    onExit: Function,
    onPresetSelect: Function,
    show: Boolean,
    runSessionRecording: Function
};

export class Editor extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      presetEditorOpen: false
    };

    this.togglePresetEditor = this.togglePresetEditor.bind(this);
  }

  togglePresetEditor() {
    this.setState(prevState => ({
      presetEditorOpen: !prevState.presetEditorOpen
    }));
  };

  render() {
    const { show, moduleid, modules, onPresetSelect, onExit, runSessionRecording } = this.props;
    const { presetEditorOpen } = this.state;


    if(!show) return null;

    const moduleType = modules[moduleid].type;
    const presetsForThisType = presets[moduleType];

    return (
      <Box className={styles.editor}>
        <div className={styles.inline}>
          <h4> Modification du module: {modules[moduleid].title}</h4>
          <FormClose className={styles.close} color='plain' size='32px' onClick={()=> onExit()} />
        </div>
        <div>
          <Button onClick={() => console.log('')} variant="outline-secondary"><ChapterAdd color='plain' size='14px' /></Button>
        </div>
        <div>
          <Button onClick={() => runSessionRecording(moduleid)} variant="outline-secondary"><Cli color='plain' size='14px' /></Button>
          <p>Press escape when session record finished</p>
        </div>
        <Box className={styles.editor} pad="small">
          <div style={{ display: 'flex', flexDirection: 'horizontal', flexWrap: 'wrap', justifyContent: 'left' }}>
            {presetsForThisType.length === 0 ? <p style={{ textAlign: 'center', width: '100%' }}> Aucun preset disponible pour ce type module</p> : null}
            {presetsForThisType.map((e, idx) => (
              <Box key={`${moduleType }__${ idx}`} animation={{
                'type': 'zoomIn',
                'duration': 200,
                'size': 'xlarge',
              }}>
                <Card style={{ minHeight: '160px', width: '13rem', margin: '10px', backgroundColor: '#fafafa' }} className={styles.card} onClick={() => onPresetSelect(e)}>
                  {/** <Card.Img variant="top" src=" /> On peut mettre une image mais flemme * */}
                  <Card.Body>
                    <Card.Title className={styles.cardTitle}>{e.buttonName}</Card.Title>
                    <Card.Text>{e.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Box>
            ))}

            <Box animation={{
              'type': 'zoomIn',
              'duration': 200,
              'size': 'xlarge',
            }}>
              <Card style={{ minHeight: '160px', width: '13rem', margin: '10px', backgroundColor: '#fafafa' }} className={styles.card} onClick={this.togglePresetEditor}>
                <Card.Body>
                  {/** <Card.Title className={styles.cardTitle}>Nouveau</Card.Title>* */}
                  <Card.Text style={{ textAlign: 'center' }}><ChapterAdd color='plain' size='50px' /></Card.Text>
                </Card.Body>
              </Card>
            </Box>
          </div>
        </Box>

        <PresetEditor show={presetEditorOpen} handleClose={this.togglePresetEditor}/>
      </Box>

    );
  }
}

export default Editor;
