/* @flow */

import React, {Component} from 'react';
import cn from 'classnames';
import styles from './styles.scss';
import { Modal, Button } from 'react-bootstrap';
import presets from './presets';

type Props = {
    modules: Object,
    moduleid: Number,
    onExit: Function,
    onSave: Function,
    show: Boolean
};

export class Editor extends Component<Props> {
    constructor(props) {
      super(props);
    }

    render() {
      console.log(presets);
      if(!this.props.show) return null;

      return (
        <Modal
          show={this.props.show}
          onHide={this.props.onExit}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {this.props.modules[this.props.moduleid].title} <small>{this.props.modules[this.props.moduleid].desc}</small>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Centered Modal</h4>
            <p>
              Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
              dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
              ac consectetur ac, vestibulum at eros.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.onExit}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
    }
}

export default Editor;
