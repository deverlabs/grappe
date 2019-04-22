import asyncio
import json
import os
import string
from threading import Thread

import pyautogui
import serial
import serial.tools.list_ports
import sys
import time
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.websocket
import unidecode
from pynput import keyboard, mouse
from pynput.keyboard import Controller
from tornado.platform.asyncio import AnyThreadEventLoopPolicy

from listeners import Listener
from universalVK import keyCodes

key = Controller()

pyautogui.PAUSE = 0

serialPort = None
ctrlListener = None
INITIALIZED = False
CLIENT_CONNECTED = False
CLIENT = None
PING_SENDED = False
Grappe = None

Recording = False
Events = []
doubleClickChecker = None
lastClickedTime = 0
lastSpecialKeyTime = 0
lastKeyTime = 0
handledString = ''
lastAction = None


def resetVars():
    global PING_SENDED, CLIENT, CLIENT_CONNECTED
    PING_SENDED = False
    CLIENT = None
    CLIENT_CONNECTED = False


def writeToClient(object):
    global CLIENT
    if CLIENT is not None:
        CLIENT.write_message(json.dumps(object))


class VirtualActions():

    def Write(self, text):
        key.type(text)

    def Process(self, command):
        return os.popen(command)

    def mouseAction(self, action_type):
        if action_type == "scrollUp":
            return pyautogui.scroll(40)
        elif action_type == "scrollDown":
            return pyautogui.scroll(-40)

    def runAutoGui(self, commands):
        global Events
        for action in commands:
            time.sleep(int(action['wait']) / 1000)
            if action["type"] == "simple":
                pyautogui.click(x=action['x'], y=action['y'])
            elif action["type"] == "double":
                pyautogui.doubleClick(x=action['x'], y=action['y'])

    def Hotkey(self, suit, Pos):
        for char in suit:
            if ':' in char:
                if int(Pos) == int(char[:1]):
                    if all(c in 'xX' + string.hexdigits for c in char[2:]):
                        print("Hexa code: ", char[2:], "Converted: ", keyCodes[int(char[2:], 0)])
                        pyautogui.keyDown(keyCodes[int(char[2:], 0)])
                    else:
                        self.mouseAction(char[2:])
            if all(c in 'xX' + string.hexdigits for c in char):
                print("Hexa code: ", char, "Converted: ", keyCodes[int(char, 0)])
                pyautogui.keyDown(keyCodes[int(char, 0)])

        for char in reversed(suit):
            if ':' in char:
                if int(Pos) == int(char[:1]):
                    if all(c in 'xX' + string.hexdigits for c in char):
                        pyautogui.keyUp(keyCodes[int(char, 0)])
            if all(c in 'xX' + string.hexdigits for c in char):
                pyautogui.keyUp(keyCodes[int(char, 0)])


class WSHandler(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True

    def open(self):
        global CLIENT_CONNECTED, CLIENT
        CLIENT_CONNECTED = True
        CLIENT = self
        print('new connection')
        writeToClient({"event": "connected", "message": "Connected to Grappe v0.9"})
        writeToClient({"event": "config", "message": json.dumps(Grappe.getComponents())})
        if INITIALIZED:
            writeToClient({"event": "ping", "message": 1})

    def on_message(self, message):
        global ctrlListener
        res = json.loads(message)
        print(message)
        if 'test' in res['object']:
            event = res['object']['test']
            Grappe.runComponent(int(event[2]), (int(event[4])))
            return
        if 'session' in res['object']:
            if res['object']['session'] == "start":
                print('Start record')
                ctrlListener.resetAutoGui()
                ctrlListener.recording(True)
                return
            print('Stop record')
            ctrlListener.resetAutoGui()
            ctrlListener.recording(False)
            return
        compid = int(res['object']['id'])
        content = res['object']['content']
        if int(res['object']['id']) < 4:
            Grappe.printOnScreen(compid, unidecode.unidecode(content['buttonName'])[:14].upper())
        Grappe.updateComponent(compid, content)

    def on_close(self):
        global CLIENT_CONNECTED, CLIENT
        resetVars()
        print('connection closed')


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
        vAction = VirtualActions()
        for key, config in dict.items((Grappe.getComponent(id))):
            if key == "buttonName":
                print("Component triggered: ", config)
            if key == "keys":
                if isinstance(config, list):
                    for object in config:
                        print(object)
                        if object["type"] == "suit":
                            if "wait" in object:
                                time.sleep(int(object["wait"]) / 1000)
                            vAction.Hotkey(object["keys"], pos)
                        elif object["type"] == "text":
                            if "wait" in object:
                                print("wait")
                                time.sleep(int(object["wait"]) / 1000)
                            vAction.Write(object["text"])
                        elif object["type"] == "process":
                            vAction.Process(object["command"])
                        elif object["type"] == "clicks":
                            vAction.runAutoGui(object["actions"])
                        if "sleep" in object:
                            print("sleep")
                            time.sleep(int(object["sleep"]) / 1000)

    def handleIncoming(self, data):
        try:
            content = data.rstrip("\r\n").split(":")
            print(content)
            if content[0] is not "0" and content[1] is not "ready-event":
                triggeredID = int(content[1])
                triggeredValue = int(content[2])
                writeToClient({"event": "moved", "message": triggeredID})
                if Grappe.getComponent(triggeredID) is not 0:
                    Grappe.runComponent(triggeredID, triggeredValue)


        except Exception as e:
            print(str(e))

    def printSerial(self, message):
        if INITIALIZED:
            return serialPort.write((str(message) + "\n").encode())

    def printOnScreen(self, id, message):
        return self.printSerial('1:' + str(id) + ':' + message)

    def run(self, err=False):
        global INITIALIZED, serialPort, PING_SENDED
        if err:
            time.sleep(1)
        try:
            selected_port = None
            for port in serial.tools.list_ports.comports():
                selected_port = port.device
            serialPort = serial.Serial(port=selected_port, baudrate=115200, bytesize=8, timeout=2,
                                       stopbits=serial.STOPBITS_ONE)

            while True:
                if serialPort.in_waiting > 0:
                    serialString = serialPort.readline()
                    PING_SENDED = False
                    if not INITIALIZED:
                        print("Init Grappe")
                        INITIALIZED = True
                        writeToClient({"event": "ping", "message": 1})
                    Grappe.handleIncoming(serialString.decode("utf-8"))
        except:
            INITIALIZED = False
            if PING_SENDED is not True:
                if CLIENT is not None:
                    PING_SENDED = True
                writeToClient({"event": "ping", "message": 0})
            return self.run(True)


if __name__ == "__main__":
    try:
        print("Grappe Worker successfully started")
        Grappe = Manager()
        Grappe.start()
        Socket = SocketServer("localhost", 1234)
        Socket.start()
        ctrlListener = Listener(writeToClient)
        ctrlListener.start()
        listener = keyboard.Listener(
            on_press=ctrlListener.handle_key_press)
        listener.start()
        mouseListener = mouse.Listener(
            on_click=ctrlListener.handle_mouse_click)
        mouseListener.start()

    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
