/* @flow */
/* eslint react/no-unused-state: 0 */

import React, { createContext, Component } from 'react';

type Props = {children: React.Node }

export const SocketContext = createContext({
  socket: {
    ws: '',
    connected: '',
    createConnection:() => {},
    sendMessage: () => {},
    waitForConnection : () => {}
  }
});


class SocketProvider extends Component <Props>{
  shouldComponentUpdate(nextPros, nextState){
    console.log(nextState)
    return true
  }
  state = {
    socket: {
      ws: '',
      connected: false,
      getSocket:() => {
        const { socket } = this.state;
        return socket.ws.readyState || 0;
      },
      createConnection:() => {
        const { socket } = this.state;

        const socketa = new WebSocket('ws://127.0.0.1:1234');

        socketa.onopen = function (evt) {
        };
        socketa.onmessage = function (evt) {
        };
        socketa.onclose = function(evt) {
        };

        this.setState({ socket : { ...socket, ws: socketa } });
      }
    }

  };


  render() {
    const { children } = this.props;
    return (
      <SocketContext.Provider value={this.state}>
        {children}
      </SocketContext.Provider>
    );
  }
}

export const withSocket = Comp => props => (
  <SocketContext.Consumer>
    {store => <Comp {...props} {...store} />}
  </SocketContext.Consumer>
);

export default SocketProvider;