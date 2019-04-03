import asyncio
import tornado.web
import tornado.httpserver
import tornado.ioloop
import tornado.websocket
import tornado.options
import time
import sys
import json

Grappe = None

class WSHandler(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True
    def open(self):
        print ('new connection')
        self.write_message(json.dumps('{"event": "connected", "message" : "Connected to Grappe v0.9"}'))

    def on_message(self, message):
        Grappe.updateComponent(1, message)
        Grappe.printComponent(1)

    def on_close(self):
        print ('connection closed')

class SocketServer:
    def __init__(self, addr, port):
        self.addr = addr # The number of LEDs in the strip
        self.port = port # How long to pause between two runs
        self.app = tornado.web.Application([
            (r'/', WSHandler),
        ])

    def startServer(self):
        try:
            http_server = tornado.httpserver.HTTPServer(self.app)
            http_server.listen(self.port)
            tornado.ioloop.IOLoop.instance().start()
        except KeyboardInterrupt:  # Ctrl-C can halt the light program
            print('Interrupted...')

class Manager:
    def __init__(self):
        self.pad=[0] * 6


    def updateComponent(self, id, content):
        self.pad[id] = content


    def printComponent(self, id):
        print(self.pad[id])

if __name__ == "__main__":
    try:
        Grappe = Manager()
        socket = SocketServer("localhost", 1234)
        socket.startServer()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
