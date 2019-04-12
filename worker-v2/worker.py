import asyncio
import json
import os
import string
import sys
import time
from threading import Thread
import unidecode
import serial
import serial.tools.list_ports
import tornado.httpserver
from tornado.platform.asyncio import AnyThreadEventLoopPolicy
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.web
import tornado.websocket
from pyautogui import press, typewrite, hotkey, keyDown, keyUp, scoll
from jskey import keyCodes

serialPort = None
INITIALIZED = False
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
        print("Write to client")
        CLIENT.write_message(message)




class VirtualKey():

    def Write(self, text):
        typewrite(text)

    def Process(self, command):
        return os.popen(command)
    def mouseAction(self, action_type):
        if action_type == "scrollUp":
            return scroll(10)
        elif action_type == "scrollDown":
            return scroll(-10)
        else:
            return

    def Hotkey(self, suit, Pos):
        for char in suit:
            if ':' in char:
                if int(Pos)==int(char[:1]):
                    if all(c in 'xX' + string.hexdigits for c in char[2:]):
                        print("Hexa code: ", char[2:], "Converted: ",keyCodes[int(char[2:], 0)] )
                        keyDown(keyCodes[int(char[2:], 0)])
                    else:
                        self.mouseAction(char[2:])
            if all(c in 'xX' + string.hexdigits for c in char):
                print(keyCodes[int(char, 0)])
                keyDown(keyCodes[int(char, 0)])

        for char in reversed(suit):
            if ':' in char:
                if int(Pos)==int(char[:1]):
                    if all(c in 'xX' + string.hexdigits for c in char):
                        keyUp(keyCodes[int(char, 0)])
            if all(c in 'xX' + string.hexdigits for c in char):
                keyUp(keyCodes[int(char, 0)])



class WSHandler(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True

    def open(self):
        global CLIENT_CONNECTED, CLIENT
        CLIENT_CONNECTED = True
        CLIENT = self
        print('new connection')
        self.write_message(json.dumps('{"event": "connected", "message" : "Connected to Grappe v0.9"}'))
        self.write_message(json.dumps('{"event": "config", "message" : '+json.dumps(Grappe.getComponents())+'}'))
        if INITIALIZED:
            self.write_message(json.dumps('{"event": "ping", "message" : 1}'))

    def on_message(self, message):
        res = json.loads(message)
        print(message)
        if 'test' in res['object']:
            event = res['object']['test']
            Grappe.runComponent(int(event[2]), (int(event[4])))
            return
        if int(res['object']['id']) < 4:
           Grappe.printSerial('1:'+res['object']['id']+':'+unidecode.unidecode(res['object']['content']['buttonName'])[:14].upper())
        Grappe.updateComponent(int(res['object']['id']), res['object']['content'])


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
            asyncio.set_event_loop_policy(AnyThreadEventLoopPolicy())
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
    def getComponents(self):
        return self.pad

    def runComponent(self, id, pos=None):
        Keyboard = VirtualKey()
        print("run")
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


    def handleIncoming(self, data):
        try:
            content = data.rstrip("\r\n").split(":")
            print(content)
            if content[0] is not "0" and content[1] is not "ready-event":
                if Grappe.getComponent(int(content[1])) is not 0:
                    return Grappe.runComponent(int(content[1]), int(content[2]))
                else:
                    writeToClient(json.dumps('{"event": "moved", "message" : '+str(content[1])+'}'))



        except Exception as e:
            print(str(e))



    def printSerial(self, message):
        return serialPort.write(str.encode(str(message) + "\n"))

    def run(self, err=False):
        global INITIALIZED, serialPort, PING_SENDED
        if err:
            time.sleep(1)
        try:
            selected_port = None
            for port in serial.tools.list_ports.comports():
                selected_port=port.device
            serialPort = serial.Serial(port=selected_port, baudrate=115200, bytesize=8, timeout=2,
                                       stopbits=serial.STOPBITS_ONE)

            while True:
                if serialPort.in_waiting > 0:
                    serialString = serialPort.readline()
                    PING_SENDED = False
                    if not INITIALIZED:
                        print("Init Grappe")
                        INITIALIZED = True
                        writeToClient(json.dumps('{"event": "ping", "message" : 1}'))
                    Grappe.handleIncoming(serialString.decode("utf-8"))
        except:
            INITIALIZED = False
            if PING_SENDED is not True:
                if CLIENT is not None:
                    PING_SENDED = True
                writeToClient(json.dumps('{"event": "ping", "message" : 0}'))
            return self.run(True)


if __name__ == "__main__":
    try:
        print("Grappe Worker successfully started")
        Grappe = Manager()
        Grappe.start()
        Socket = SocketServer("localhost", 1234)
        Socket.start()

    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
