/* @flow */

/* eslint-disable react/no-array-index-key,  react/prefer-stateless-function */

import React, { Component } from 'react';
import cn from 'classnames';
import { Modal, Button } from 'react-bootstrap';
import { Box, Form, FormField, Menu } from 'grommet';
import styles from './styles.scss';
import presets from './presets';

type Props = {
    show: Boolean
};

export class PresetEditor extends Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const { show, handleClose } = this.props;

    return (
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
              <FormField name="name" label="Nom du réglage" />

              <Menu
                zIndex={32}
                label="Nouveau"
                items={[
                  { label: 'Suite de touche', onClick: () => {} },
                  { label: 'Ecrire du texte', onClick: () => {} },
                  { label: 'Nouveau processus', onClick: () => {} },
                ]}
              />

              <h3>Actions :</h3>
              <Box animation={{'type': 'zoomIn', 'duration': 200, 'size': 'xlarge'}}>
                hello
              </Box>

              <Button variant="outline-secondary" onClick={handleClose}>Annuler</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Annuler</Button>
          <Button variant="primary" onClick={handleClose}>Sauvegarder</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default PresetEditor;
