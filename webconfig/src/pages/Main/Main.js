/* @flow */

import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Box } from 'grommet';
import { SentAlert, Editor, Tooltip, Socket, Module } from '../../components';
import styles from './styles.scss';

type Props = { };


export class Main extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      debugMode: false,
      socket: null,
      welcome : null,
      hardware: null,
      editingModuleID: null,
      sended: false,
      moved: null,
      modules: [
        { title: 'Interrupteurs', type: 'DSWITCH', uiType: 'btns', desc: 'Active ou désactive un paramètre.' },
        { title: 'Bouton poussoir', type: 'PUSHBTN', uiType: 'push-btn', desc: 'Déclenche une action.' },
        { title: 'Potentiomètre', type: 'POTENTIOMETER', uiType: 'potard', desc: 'Augmente ou diminue un paramètre.' },
        { title: 'Molette', type: 'POTENTIOMETER', uiType: 'molette', desc: 'Augmente ou diminue un paramètre.' },
        { title: 'Joystick', type: 'JOYSTICK', uiType: 'btn-red', desc: 'Permet de naviguer dans toutes les directions.' },
        { title: 'Capteur de présence', type: 'PIR', uiType: 'btn', desc: 'S\'active si une présence est détectée.' },
      ]
    };
    this.onPresetSelect = this.onPresetSelect.bind(this);
    this.editComponent = this.editComponent.bind(this);
    this.exitEditingMode = this.exitEditingMode.bind(this);
    this.saveEditingMode = this.saveEditingMode.bind(this);
    this.sessionRecord = this.sessionRecord.bind(this);
    this.toggleSandbox = this.toggleSandbox.bind(this);
    this.lastMoved = new Date();
  }

  onPresetSelect(preset) {
    const { editingModuleID, modules } = this.state;
    const parameterBag = {
      id: editingModuleID,
      content: {
        'buttonName': preset.buttonName,
        'keys': preset.keys
      }
    };

    this.sendToModule(parameterBag);

    modules[editingModuleID].desc = preset.buttonName;

    this.setState({
      editingModuleID: null,
      sended: true,
      modules
    });
    setTimeout(()=> {
      this.setState({ sended: false });
    }, 3000);
  }

  editComponent(id) {
    this.setState({ editingModuleID: id });
  }

  exitEditingMode() {
    this.setState({ editingModuleID: null });
  }

  saveEditingMode() {
    this.setState({ editingModuleID: null });
    console.log('save');
  }

  sendToModule(object) {
    const { socket } = this.state;

    if(socket?.readyState === 1) {
      return socket.sendMessage(object);
    }
    console.log('Connection not established');
    return null;
  }

  socketChanged(e){
    this.setState({ socket: e });
  }

  handleMessage(data) {
    const { lastMoved } = this;
    const { editingModuleID } = this.state;

    if(data?.event === 'connected') {
      this.setState({ welcome: data.message });
    } else if(data?.event === 'ping') {
      this.setState({ hardware: data.message });
    }
    else if(data?.event === 'session') {
      const obj = {
        buttonName : 'Session',
        description: 'blabalba',
        keys : [
          { type: 'session', commands: data.actions }
        ]
      };

      this.onPresetSelect(obj);
    }
    else if(data?.event === 'moved') {
      this.lastMoved = new Date();
      this.setState({ moved: data.message });
      const da= new Date();

      setTimeout(()=> {

        const diff = (da.getTime() - lastMoved.getTime());

        this.setState({ moved: null });
        console.log(diff);
        if(diff > 1500){
          console.log('reset');
        }

      }, 1000);
    }

  }

  sessionRecord(id) {
    if(id === -1)
      return this.sendToModule({ session : 'stop' });
    return this.sendToModule({ session : 'start' });
  }


  toggleSandbox() {
    this.setState(prevState => ({
      debugMode: !prevState.debugMode
    }));
  }

  renderSandbox() {
    const { welcome, hardware, modules, socket, editingModuleID, sended } = this.state;

    return (
      <div>
        <h5>0 - DSWITCH</h5>
        <button type="button" onClick={() => this.sendToModule({ 'test' : '1:0:0' })}>Send 0 0</button>
        <button type="button" onClick={() => this.sendToModule({ 'test' : '1:0:1' })}>Send 0 1</button>
        <button type="button" onClick={() => this.sendToModule({ 'test' : '1:0:2' })}>Send 1 0</button>
        <button type="button" onClick={() => this.sendToModule({ 'test' : '1:0:3' })}>Send 1 1</button>

        <h5>1 - PUSHBTN</h5>
        <button type="button" onClick={() => this.sendToModule({ 'test' : '1:1:1' })}>Send 1</button>

        <h5>2 - POTENTIOMETER</h5>
        <button type="button" onClick={() => this.sendToModule({ 'test' : '1:2:0' })}>Send +</button>
        <button type="button" onClick={() => this.sendToModule({ 'test' : '1:2:1' })}>Send -</button>

        <h5>3 - POTENTIOMETER</h5>
        <button type="button" onClick={() => this.sendToModule({ 'test' : '1:3:0' })}>Send -</button>
        <button type="button" onClick={() => this.sendToModule({ 'test' : '1:3:1' })}>Send +</button>

        <h5>4 - JOYSTICK</h5>
        <button type="button" onClick={() => this.sendToModule({ 'test' : '1:4:0' })}>Send haut</button>
        <button type="button" onClick={() => this.sendToModule({ 'test' : '1:4:1' })}>Send bas</button>
        <button type="button" onClick={() => this.sendToModule({ 'test' : '1:4:2' })}>Send gauche</button>
        <button type="button" onClick={() => this.sendToModule({ 'test' : '1:4:3' })}>Send droite</button>

        <h5>5 - PIR</h5>
        <button type="button" onClick={() => this.sendToModule({ 'test' : '1:5:1' })}>Send présence</button>
      </div>
    );
  }

  render() {
    const { welcome, hardware, modules, socket, editingModuleID, sended, debugMode, moved } = this.state;

    return (
      <Socket onMessage={(m) => this.handleMessage(m)} onSocketChange={(e) => this.socketChanged(e)}>
        <div style={{ height: '75px', display: 'flex', justifyContent: 'space-between' }} className={styles.headerLogo}>
          <div style={{ width: '131px' }}></div>
          <div onClick={this.toggleSandbox} role="button">
            <img alt="grappe logo" src="images/logo.png" />
          </div>
          <Button size="sm" variant="outline-secondary">Contrôle à distance</Button>
        </div>

        <Container>
          <Row>
            <Col xs={3}>
              <Tooltip module={modules[4]} pos="left"/>
              <Tooltip module={modules[2]} pos="left"/>
              <Tooltip module={modules[0]} pos="left"/>
            </Col>
            <Col xs={6} className={styles['pad-core']}>
              <Row>
                <Col xs={4}>
                  <Module moved={moved === 4} module={modules[4]} pos="left" id="4" onClick={this.editComponent}/>
                  <Module moved={moved === 2} module={modules[2]} pos="left" id="2" onClick={this.editComponent}/>
                  <Module moved={moved === 0} module={modules[0]} pos="left" id="0" onClick={this.editComponent}/>
                </Col>

                <Col xs={4}>
                  <div className={styles['pad-center']}>
                    <div className={styles['pad-logo']}>
                      <div className={styles.logo} id="logo-status">
                        {(hardware === 1 && socket.readyState === 1) ? <img src="images/logo-stand-orange.png" alt="connected"/> : <img className={styles.glow} src="images/logo-stand.png" alt="searching"/>}
                      </div>
                    </div>
                    <div className={ styles.status }>
                      {(socket?.readyState === 1) ? <span className={styles['socket-status_connected']}>{welcome}</span> : <span className={styles['socket-status_searching']}>Looking for a Grappe ...</span>}
                      <br />
                      {(hardware === 1 && socket.readyState === 1) ? 'Grappe ready to use !' : 'Grappe not plugged-in'}
                    </div>
                  </div>
                </Col>

                <Col xs={4}>
                  <Module moved={moved === 5} module={modules[5]} pos="right" id="5" onClick={this.editComponent}/>
                  <Module moved={moved === 3} module={modules[3]} pos="right" id="3" onClick={this.editComponent}/>
                  <Module moved={moved === 1} module={modules[1]} pos="right" id="1" onClick={this.editComponent}/>
                </Col>
              </Row>
            </Col>
            <Col xs={3}>
              <Tooltip module={modules[5]} pos="right" />
              <Tooltip module={modules[3]} pos="right" />
              <Tooltip module={modules[1]} pos="right" />
            </Col>
          </Row>

          {sended ? <SentAlert/> : null}

          <Box pad="medium" margin={{ 'vertical': 'large', }} background={editingModuleID !== null ? '#fff' : null}>
            <Editor modules={modules}
              moduleid={editingModuleID}
              onExit={this.exitEditingMode}
              onSave={this.saveEditingMode}
              runSessionRecording={(e) => this.sessionRecord(e)}
              show={editingModuleID !== null}
              onPresetSelect={this.onPresetSelect}
            />
          </Box>


          {debugMode === true && this.renderSandbox()}
        </Container>
      </Socket>
    );
  }
}

export default Main;