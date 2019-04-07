/* @flow */
/* eslint react/no-unused-state: 0 */

import React, { Component } from 'react';

type Props = {children: React.Node, onSocketChange: Function, onMessage: Function }

class Socket extends Component <Props>{
  constructor(props){
    super(props);
    this.state = {
      socket: null
    };
  };

  componentDidMount(){
    this.createConnection();
  }

  handleStatus=() => {
    const { socket } = this.state;
    const { onSocketChange } = this.props;

    // console.log(socket?.readyState);
    onSocketChange(socket);
    if(socket?.readyState !== 1) {
      setTimeout(() => {
        this.createConnection();
      }, 1000);
    }
  };

  createConnection=() => {

    const handleChange = () => this.handleStatus();
    const { onMessage } = this.props;
    const socketa = new WebSocket('ws://127.0.0.1:1234');

    socketa.sendMessage = (object) => {
      console.log(object);
      this.state.socket.send(JSON.stringify({
        object
      }));
    };
    socketa.onopen = function (evt) {
      handleChange(evt);
    };
    socketa.onmessage = function (evt) {
      handleChange(evt);
      onMessage(JSON.parse(JSON.parse(evt.data)));
    };
    socketa.onclose = function(evt) {
      handleChange(evt);
    };
    this.setState({ socket: socketa });

  }

  getSocket=() => {
    const { socket } = this.state;

    return socket.ws.readyState || 0;
  };

  render() {
    const { children } = this.props;

    return (
      <div>
        {children}
      </div>
    );
  }
}

export default Socket;