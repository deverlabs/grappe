/* @flow */

/* eslint-disable react/no-array-index-key,  react/prefer-stateless-function */

import React, { Component } from 'react';
import cn from 'classnames';
import { Card, Button } from 'react-bootstrap';
import { Box, Image } from 'grommet';
import { FormClose, ChapterAdd, Cli, FormPreviousLink } from 'grommet-icons';
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
      presetEditorOpen: false,
      recording: false
    };

    this.togglePresetEditor = this.togglePresetEditor.bind(this);
  }

  recordSession(id) {
    const { runSessionRecording } = this.props;
    const { recording } = this.state;

    if(recording){
      this.setState({ recording: false });
      return runSessionRecording(-1);
    }
    this.setState({ recording: true });
    return runSessionRecording(id);
  }

  togglePresetEditor() {
    this.setState(prevState => ({
      presetEditorOpen: !prevState.presetEditorOpen
    }));
  };

  render() {
    const { show, moduleid, modules, onPresetSelect, onExit, runSessionRecording } = this.props;
    const { presetEditorOpen, recording } = this.state;


    if(!show) return null;

    const moduleType = modules[moduleid].type;
    const presetsForThisType = presets[moduleType];

    return (
      <Box className={styles.editor} animation={{
        'type': 'zoomOut',
        'duration': 80,
        'size': 'xlarge',
      }}>
        <div className={styles.inline}>
          {recording ? <FormPreviousLink className={styles.return} color='plain' size='32px' onClick={()=> this.recordSession()} /> : null}
          <h4> Modification du module: {modules[moduleid].title}</h4>
          <FormClose className={styles.close} color='plain' size='32px' onClick={()=> onExit()} />
        </div>
        <Box className={styles.editor} pad="small">
          {!recording &&
          <div style={{ display: 'flex', flexDirection: 'horizontal', flexWrap: 'wrap', justifyContent: 'left' }}>
            {presetsForThisType.length === 0
              ? <p style={{ textAlign: 'center', width: '100%' }}> Aucun preset disponible pour ce type module</p>
              : null} {presetsForThisType.map((e, idx) => (
              <Box key={`${moduleType}__${idx}`} animation={{
                'type': 'zoomIn',
                'duration': 300,
                'size': 'xlarge',
              }}> <Card style={{ minHeight: '160px', width: '13rem', margin: '10px', backgroundColor: '#fafafa' }} className={styles.card}
                  onClick={() => onPresetSelect(e)}>
                  {/** <Card.Img variant="top" src=" /> On peut mettre une image mais flemme * */} <Card.Body> <Card.Title
                    className={styles.cardTitle}>{e.buttonName}</Card.Title> <Card.Text>{e.description}</Card.Text> </Card.Body> </Card> </Box>
            ))}
            <Box animation={{
              'type': 'zoomIn',
              'duration': 300,
              'size': 'xlarge',
            }}> <Card style={{ minHeight: '160px', width: '13rem', margin: '10px', backgroundColor: '#fafafa' }} className={styles.card}
                onClick={() => this.recordSession(moduleid)}>
                <Card.Body>
                  <Box height="100%" width="100%" justify="center" align="center" alignContent="center" >
                    <Cli color='plain' size='50px'/>
                  </Box>
                </Card.Body>
              </Card>
            </Box>
          </div>
          } {recording &&
            <div>
              <p style={{ textAlign : 'center' }}>Capturer vos interactions pour les re-jouer à n'importe quel moment !</p>

              <Box height="medium" justify="center" align="center" alignContent="center" pad={{ bottom : 'medium' }} animation={{
                'type': 'zoomOut',
                'duration': 100,
                'size': 'xlarge',
              }}>
                <Image
                  fit="contain"
                  alignSelf="center" src="images/user.gif"
                />
              </Box>
              <p style={{ textAlign : 'center' }}> Appuyez sur "echap" une fois terminé</p>
            </div>
          }
        </Box>

        <PresetEditor show={presetEditorOpen} handleClose={this.togglePresetEditor}/>
      </Box>

    );
  }
}

export default Editor;
