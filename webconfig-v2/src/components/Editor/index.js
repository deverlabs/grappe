/* @flow */

/* eslint-disable react/no-array-index-key,  react/prefer-stateless-function */

import React, { Component } from 'react';
import cn from 'classnames';
import { Modal, Button, Card } from 'react-bootstrap';
import styles from './styles.scss';
import presets from './presets';

type Props = {
    modules: Object,
    moduleid: Number,
    onExit: Function,
    onSave: Function,
    onPresetSelect: Function,
    show: Boolean
};

export class Editor extends Component<Props> {
  render() {
    if(!this.props.show) return null;

    const moduleType = this.props.modules[this.props.moduleid].type;
    const presetsForThisType = presets[moduleType];

    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onExit}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
              Modifier le composant : {this.props.modules[this.props.moduleid].title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ fontSize: '18px' }}>Choisissez un réglage prédéfini pour ce composant :</p>

          {presetsForThisType.length === 0 && <span>Aucun réglage prédéfini n'est disponible pour ce composant.</span>}

          <div style={{ display: 'flex', 'flexDirection': 'horizontal', 'flexWrap': 'wrap', 'justifyContent': 'center' }}>
            {presetsForThisType.map((e, idx) => (
              <Card key={`${moduleType }__${ idx}`} style={{ width: '13rem', margin: '10px' }}>
                {/** <Card.Img variant="top" src=" /> On peut mettre une image mais flemme * */}
                <Card.Body>
                  <Card.Title>{e.buttonName}</Card.Title>
                  <Card.Text>{e.description}</Card.Text>

                  <Button variant="secondary" onClick={() => this.props.onPresetSelect(e)}>Utiliser</Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={this.props.onExit}>Annuler</Button>
          <Button variant="primary" onClick={this.props.onSave} style={{ backgroundColor: '#e16a01', 'borderColor': '#e16a01' }}>Modifier</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Editor;
