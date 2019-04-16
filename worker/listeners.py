import datetime
from threading import Thread

from pynput import keyboard

from universalVK import keyCodes


class Listener(Thread):
    def __init__(self, writeToClient):
        self.writeToClient = writeToClient
        self.Recording = False
        self.Events = []
        self.doubleClickChecker = None
        self.lastClickedTime = 0
        self.lastSpecialKeyTime = 0
        self.lastKeyTime = 0
        self.handledString = ''
        self.lastAction = None
        Thread.__init__(self)

    def recording(self, isRecording):
        self.Recording = isRecording

    def resetAutoGui(self):
        self.doubleClickChecker = None
        self.lastClickedTime = 0
        self.Events = []

    def handle_key_press(self, key):
        try:
            if self.Recording:
                if len(self.handledString) == 0:
                    if self.lastClickedTime is not 0:
                        self.lastKeyTime = datetime.datetime.now() - self.lastClickedTime
                    else:
                        self.lastKeyTime = datetime.datetime.now() - datetime.datetime.now()
                self.handledString += key.char
                self.lastClickedTime = datetime.datetime.now()
                self.lastAction = "key"
                if len(self.Events) > 0:
                    self.writeToClient({"event": "session", "type": "clicks", "actions": self.Events})
                    self.Events = []
        except:
            if self.lastClickedTime is not 0:
                self.lastSpecialKeyTime = datetime.datetime.now() - self.lastClickedTime
            else:
                self.lastSpecialKeyTime = datetime.datetime.now() - datetime.datetime.now()
            if key == keyboard.Key.space and self.Recording:
                self.handledString += ' '
                return
            if key == keyboard.Key.backspace and self.Recording:
                if len(self.handledString) > 0:
                    self.handledString = self.handledString[:-1]
                return
            if key == keyboard.Key.esc and self.Recording:
                self.Recording = False
                if len(self.handledString) > 0:
                    self.writeToClient({"event": "session", "done": "true", "type": "text", "text": self.handledString,
                                        "wait": int(self.lastKeyTime.total_seconds() * 1000)})
                    self.handledString = ''
                if len(self.Events) > 0:
                    self.writeToClient({"event": "session", "done": "true", "type": "clicks", "actions": self.Events})
                    self.Events = []
                else:
                    self.writeToClient({"event": "session", "done": "true"})
                self.Events = []
                self.handledString = ''
                self.lastAction = None
                print("Stop recording")
            else:
                keyc = str(key)
                convertedChar = [key for (key, value) in keyCodes.items() if value == keyc[4:]]

                if len(convertedChar) > 0:
                    char = convertedChar[0]
                    hex = f"0x{char:02x}"
                    if len(self.Events) > 0:
                        self.writeToClient({"event": "session", "type": "clicks", "actions": self.Events})
                        self.Events = []
                    if len(self.handledString) > 0:
                        self.writeToClient({"event": "session", "type": "text", "text": self.handledString,
                                            "wait": int(self.lastKeyTime.total_seconds() * 1000)})
                        self.handledString = ''
                    wait = 50 if self.lastAction == "skey" else int(self.lastSpecialKeyTime.total_seconds() * 1000)
                    self.writeToClient({"event": "session", "type": "suit", "keys": [hex], "wait": wait})
            self.lastAction = "skey"
            self.lastClickedTime = datetime.datetime.now()
        return True

    def handle_mouse_click(self, x, y, button, pressed):
        if pressed:
            if self.lastClickedTime is not 0:
                self.deltaLastClicked = datetime.datetime.now() - self.lastClickedTime
            else:
                self.deltaLastClicked = datetime.datetime.now() - datetime.datetime.now()

            if self.Recording:
                self.lastAction = "click"
                if len(self.handledString) > 0:
                    self.writeToClient({"event": "session", "type": "text", "text": self.handledString,
                                        "wait": int(self.lastKeyTime.total_seconds() * 1000)})
                    self.handledString = ''
                if self.doubleClickChecker is not None:
                    deltaDoubleClick = datetime.datetime.now() - self.doubleClickChecker
                    if int(deltaDoubleClick.total_seconds() * 1000 < 300):
                        self.Events.pop()
                        self.Events.append(
                            ({"type": "double", "x": x, "y": y,
                              "wait": int(self.deltaLastClicked.total_seconds() * 1000)}))
                        self.doubleClickChecker = None
                        self.lastClickedTime = datetime.datetime.now()
                        return True

                self.Events.append(
                    ({"type": "simple", "x": x, "y": y, "wait": int(self.deltaLastClicked.total_seconds() * 1000)}))
                self.lastClickedTime = datetime.datetime.now()
                self.doubleClickChecker = datetime.datetime.now()
        return True
