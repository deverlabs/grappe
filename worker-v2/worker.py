import ctypes
import json
import os
import serial
import serial.tools.list_ports
import sys
import time
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.web
import tornado.websocket
from ctypes import wintypes

serialPort = None
user32 = ctypes.WinDLL('user32', use_last_error=True)
INPUT_MOUSE = 0
INPUT_KEYBOARD = 1
INPUT_HARDWARE = 2
INIT = None
KEYEVENTF_EXTENDEDKEY = 0x0001
KEYEVENTF_KEYUP = 0x0002
KEYEVENTF_UNICODE = 0x0004
KEYEVENTF_SCANCODE = 0x0008

MAPVK_VK_TO_VSC = 0

Grappe = None

wintypes.ULONG_PTR = wintypes.WPARAM


class MOUSEINPUT(ctypes.Structure):
    _fields_ = (("dx", wintypes.LONG),
                ("dy", wintypes.LONG),
                ("mouseData", wintypes.DWORD),
                ("dwFlags", wintypes.DWORD),
                ("time", wintypes.DWORD),
                ("dwExtraInfo", wintypes.ULONG_PTR))


class KEYBDINPUT(ctypes.Structure):
    _fields_ = (("wVk", wintypes.WORD),
                ("wScan", wintypes.WORD),
                ("dwFlags", wintypes.DWORD),
                ("time", wintypes.DWORD),
                ("dwExtraInfo", wintypes.ULONG_PTR))

    def __init__(self, *args, **kwds):
        super(KEYBDINPUT, self).__init__(*args, **kwds)
        # some programs use the scan code even if KEYEVENTF_SCANCODE
        # isn't set in dwFflags, so attempt to map the correct code.
        if not self.dwFlags & KEYEVENTF_UNICODE:
            self.wScan = user32.MapVirtualKeyExW(self.wVk,
                                                 MAPVK_VK_TO_VSC, 0)


class HARDWAREINPUT(ctypes.Structure):
    _fields_ = (("uMsg", wintypes.DWORD),
                ("wParamL", wintypes.WORD),
                ("wParamH", wintypes.WORD))


class INPUT(ctypes.Structure):
    class _INPUT(ctypes.Union):
        _fields_ = (("ki", KEYBDINPUT),
                    ("mi", MOUSEINPUT),
                    ("hi", HARDWAREINPUT))

    _anonymous_ = ("_input",)
    _fields_ = (("type", wintypes.DWORD),
                ("_input", _INPUT))


LPINPUT = ctypes.POINTER(INPUT)


def _check_count(result, func, args):
    if result == 0:
        raise ctypes.WinError(ctypes.get_last_error())
    return args


user32.SendInput.errcheck = _check_count
user32.SendInput.argtypes = (wintypes.UINT,  # nInputs
                             LPINPUT,  # pInputs
                             ctypes.c_int)  # cbSize


# Functions
def PressKey(hexKeyCode):
    x = INPUT(type=INPUT_KEYBOARD, ki=KEYBDINPUT(wVk=hexKeyCode))
    user32.SendInput(1, ctypes.byref(x), ctypes.sizeof(x))


def ReleaseKey(hexKeyCode):
    x = INPUT(type=INPUT_KEYBOARD, ki=KEYBDINPUT(wVk=hexKeyCode, dwFlags=KEYEVENTF_KEYUP))
    user32.SendInput(1, ctypes.byref(x), ctypes.sizeof(x))


class VirtualKey():
    def Write(self, text):
        for char in text:
            print(char)
            PressKey(int(char, 16))
            ReleaseKey(int(char, 16))

    def Hotkey(self, suit):
        for char in suit:
            PressKey(int(char, 16))
        for char in reversed(suit):
            ReleaseKey(int(char, 16))


class WSHandler(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True

    def open(self):
        print ('new connection')
        self.write_message(json.dumps('{"event": "connected", "message" : "Connected to Grappe v0.9"}'))

    def on_message(self, message):
        Grappe.updateComponent(0, message)
        Grappe.printComponent(0)
        print(message)

    def on_close(self):
        print ('connection closed')


class SocketServer:
    def __init__(self, addr, port):
        self.addr = addr  # The number of LEDs in the strip
        self.port = port  # How long to pause between two runs
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
        self.pad = [0] * 6

    def updateComponent(self, id, content):
        self.pad[id] = content

    def printComponent(self, id):
        return (self.pad[id])

    def runComponent(self, id):
        Keyboard = VirtualKey()
        for key, value in dict.items((Grappe.printComponent(id))):
            if key == "buttonName":
                print("button: ", value)
            if key == "keys":
                if isinstance(value, list):
                    for object in value:
                        time.sleep(0.6)
                        if object["type"] == "suit":
                            Keyboard.Hotkey(object["keys"].split(","))
                        if object["type"] == "text":
                            Keyboard.Write(object["keys"].split(","))

    def handleIncoming(self, data):
        Keyboard = VirtualKey()
        content = data.rstrip("\r\n").split(":")
        if content[0] == "0" and content[1] == "ready-event":
            print(content)
            return self.printSerial("1:0:coucou")
        elif content[1] == "1" and content[2] == "1":
            return self.runComponent(1)
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

    def initSerial(self, err=False):
        global INIT, serialPort
        if err:
            time.sleep(1)

        serialPort = serial.Serial(port="COM5", baudrate=115200, bytesize=8, timeout=2, stopbits=serial.STOPBITS_ONE)
        serialString = ""
        while (True):
            if (serialPort.in_waiting > 0):
                serialString = serialPort.readline()
                if INIT is None:
                    print("init")
                    INIT = True
                Grappe.handleIncoming(serialString.decode("utf-8"))


if __name__ == "__main__":
    try:
        Grappe = Manager()
        socket = SocketServer("localhost", 1234)
        Grappe.updateComponent(1, {"buttonName": "test", "keys": [{"type": "suit", "keys": "0x5b"},
                                                                  {"type": "suit", "keys": "0x43,0x4d,0x44,0xd"},
                                                                  {"type": "text",
                                                                   "keys": "0x45,0x58,0x50,0x4c,0x4f,0x52,0x45,0x52,0x20,0x48,0x54,0x54,0x50,0x53,0xbf,0x14,0xbf,0xbf,0x14,0x47,0x4f,0x4f,0x47,0x4c,0x45,0x14,0xbe,0x14,0x46,0x52,0xd"}]})
        try:
            Grappe.initSerial()
        except:
            Grappe.initSerial(True)

        # Read data out of the buffer until a


    # socket.startServer()

    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
