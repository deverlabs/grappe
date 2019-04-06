import asyncio
import json
import os
import string
import sys
import time
from ctypes import windll
from threading import Thread

import mouse
import serial
import serial.tools.list_ports
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.web
import tornado.websocket

from keyboard import *

serialPort = None
INIT = None
CLIENT_CONNECTED = False
CLIENT = None
PING_SENDED = False
Grappe = None


def resetVars():
    global PING_SENDED, CLIENT, CLIENT_CONNECTED
    PING_SENDED = False
    CLIENT = None
    CLIENT_CONNECTED = False


def writeToClient(message):
    global CLIENT
    if CLIENT is not None:
        print("send to cli")
        asyncio.set_event_loop(asyncio.new_event_loop())
        return CLIENT.write_message(message)
        # asyncio.get_event_loop().stop()


class VirtualKey():
    def char2key(self, c):
        result = windll.User32.VkKeyScanW(ord(str(c)))
        return hex(result)

    def Write(self, text):
        for char in text:
            hexchar = self.char2key(char)
            PressKey(int(hexchar, 16))
            ReleaseKey(int(hexchar, 16))

    def Process(self, command):
        return os.popen(command)
    def mouseAction(self, action_type):
        if action_type == "scrollUp":
            print("wheelup")
            return mouse.wheel(1)
        elif action_type == "scrollDown":
            return mouse.wheel(-1)
        else:
            return

    def Hotkey(self, suit, Pos):
        for char in suit:
            if ':' in char:
                if int(Pos)==int(char[:1]):
                    print(char[2:])
                    if all(c in 'xX' + string.hexdigits for c in char[2:]):
                        print("press: ", char[2:])
                        PressKey(int(char[2:], 16))
                    else:
                        self.mouseAction(char[2:])
            if all(c in 'xX' + string.hexdigits for c in char):
                PressKey(int(char, 16))

        for char in reversed(suit):
            if ':' in char:
                if int(Pos)==int(char[:1]):
                    if all(c in 'xX' + string.hexdigits for c in char):
                        ReleaseKey(int(char, 16))
            if all(c in 'xX' + string.hexdigits for c in char):
                ReleaseKey(int(char, 16))



class WSHandler(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True

    def open(self):
        global CLIENT_CONNECTED, CLIENT
        CLIENT_CONNECTED = True
        CLIENT = self
        print('new connection')
        self.write_message(json.dumps('{"event": "connected", "message" : "Connected to Grappe v0.9"}'))

    def on_message(self, message):
        Grappe.updateComponent(0, message)
        Grappe.getComponent(0)
        print(message)

    def on_close(self):
        global CLIENT_CONNECTED, CLIENT
        resetVars()
        print ('connection closed')


class SocketServer(Thread):
    def __init__(self, addr, port):
        self.addr = addr  # The number of LEDs in the strip
        self.port = port  # How long to pause between two runs
        self.app = tornado.web.Application([
            (r'/', WSHandler),
        ])
        Thread.__init__(self)

    def run(self):
        try:
            asyncio.set_event_loop(asyncio.new_event_loop())
            http_server = tornado.httpserver.HTTPServer(self.app)
            http_server.listen(self.port)
            tornado.ioloop.IOLoop.instance().start()
        except KeyboardInterrupt:  # Ctrl-C can halt the light program
            print('Interrupted...')


class Manager(Thread):
    def __init__(self):
        self.pad = [0] * 6
        Thread.__init__(self)

    def updateComponent(self, id, content):
        self.pad[id] = content

    def getComponent(self, id):
        return self.pad[id]

    def runComponent(self, id, pos=None):
        Keyboard = VirtualKey()
        for key, config in dict.items((Grappe.getComponent(id))):
            if key == "buttonName":
                print("Component triggered: ", config)
            if key == "keys":
                if isinstance(config, list):
                    for object in config:
                        print(object)
                        if object["type"] == "suit":
                            Keyboard.Hotkey(object["keys"], pos)
                        elif object["type"] == "text":
                             Keyboard.Write(object["text"])
                        elif object["type"] == "process":
                             Keyboard.Process(object["command"])
                        if "sleep" in object:
                            print("sleep")
                            time.sleep(int(object["sleep"])/1000)
                        else:
                            time.sleep(0.6)

    def handleIncoming(self, data):
        Keyboard = VirtualKey()
        content = data.rstrip("\r\n").split(":")
        if content[0] == "0" and content[1] == "ready-event":
            return self.printSerial("1:0:coucou")
        elif content[1] == "1" and content[2] == "1":
            return self.runComponent(1, content["3"])
        elif content[1] == "4":
            print("joy")
            if content[2] == "0":
                Keyboard.Write(["0x26"])
            if content[2] == "1":
                Keyboard.Write(["0x28"])
            if content[2] == "2":
                Keyboard.Write(["0x25"])
            if content[2] == "3":
                Keyboard.Write(["0x27"])

    def printSerial(self, message):
        return serialPort.write(str.encode(str(message) + "\n"))

    def run(self, err=False):
        global INIT, serialPort, PING_SENDED
        if err:
            time.sleep(1)
        try:
            serialPort = serial.Serial(port="COM5", baudrate=115200, bytesize=8, timeout=2,
                                       stopbits=serial.STOPBITS_ONE)
            serialString = ""
            writeToClient(json.dumps('{"ping": "connected"}'))

            while (True):
                if (serialPort.in_waiting > 0):
                    serialString = serialPort.readline()
                    if INIT is None:
                        print("init")
                        INIT = True

                    Grappe.handleIncoming(serialString.decode("utf-8"))
        except:
            # print("Can't connect to serial")
            if PING_SENDED is not True:
                if CLIENT is not None:
                    PING_SENDED = True
                writeToClient(json.dumps('{"ping": "disconnected"}'))
            return self.run(True)


if __name__ == "__main__":
    try:
        Grappe = Manager()
        Grappe.start()
        Socket = SocketServer("localhost", 1234)
        Socket.start()
        Grappe.updateComponent(0, {"buttonName": "Run google", "keys": [
            {"type": "process", "command": "explorer https://google.fr", "sleep": "1000"},
            {"type": "text", "text": "Coucou"},
            {"type": "suit", "keys": ["0x0D"]}
        ]})
        Grappe.updateComponent(1, {"buttonName": "Scroll", "keys": [{"type": "suit", "keys": ["0xAF"]}]})
        Grappe.updateComponent(2, {"buttonName": "Write", "keys": [{"type": "text", "text": "ppp"}]})
        time.sleep(1)
        Grappe.runComponent(0, True)
        time.sleep(0.5)
       # Grappe.runComponent(1, True)
        time.sleep(5)
        #Grappe.runComponent(2, True)


    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
