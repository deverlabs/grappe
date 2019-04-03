import json, socket

class Server(object):
    """
    A JSON socket server used to communicate with a JSON socket client. All the
    data is serialized in JSON. How to use it:

    server = Server(host, port)
    while True:
      server.accept()
      data = server.recv()
      # shortcut: data = server.accept().recv()
      server.send({'status': 'ok'})
    """

    backlog = 5
    client = None

    def __init__(self, host, port):
        self.socket = socket.socket()
        self.socket.bind((host, port))
        self.socket.listen(self.backlog)

    def __del__(self):
        self.close()

    def accept(self):
        # if a client is already connected, disconnect it
        if self.client:
            self.client.close()
        self.client, self.client_addr = self.socket.accept()
        return self

    def send(self, data):
        if not self.client:
            raise Exception('Cannot send data, no client is connected')
        _send(self.client, data)
        return self

    def recv(self):
        if not self.client:
            raise Exception('Cannot receive data, no client is connected')
        return _recv(self.client)

    def close(self):
        if self.client:
            self.client.close()
            self.client = None
        if self.socket:
            self.socket.close()
            self.socket = None


## helper functions ##

def _send(socket, data):
    try:
        serialized = json.dumps(data)
    except (TypeError, ValueError):
        raise Exception('You can only send JSON-serializable data')
    # send the length of the serialized data first
    socket.send('%d\n' % len(serialized))
    # send the serialized data
    socket.sendall(serialized)

def _recv(socket):
    # read the length of the data, letter by letter untilength_strl we reach EOL
    length_str = ''
    char = socket.recv(1)
    while char != '\n':
        length_str += char
        char = socket.recv(1)
    total = int(length_str)
    # use a memoryview to receive the data chunk by chunk efficiently
    view = memoryview(bytearray(total))
    next_offset = 0
    while total - next_offset > 0:
        recv_size = socket.recv_into(view[next_offset:], total - next_offset)
        next_offset += recv_size
    try:
        deserialized = json.loads(view.tobytes())
    except (TypeError, ValueError):
        raise Exception('Data received was not in JSON format')
    return deserialized