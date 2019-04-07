/* @flow */

import React, {Component} from 'react';
import cn from 'classnames';
import styles from './styles.scss';
import { Modal, Button } from 'react-bootstrap';

type Props = {
    modules: Object,
    moduleID: Number,
    onHide: Function
};


export class Editor extends Component<Props> {
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <Modal
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Modal heading</Modal.Title>
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
            <Button onClick={this.props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
    }
}

export default Editor;
