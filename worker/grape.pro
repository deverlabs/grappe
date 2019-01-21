#-------------------------------------------------
#
# Project created by QtCreator 2018-12-15T18:09:32
#
#-------------------------------------------------

QT += core gui network websockets

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = grape
TEMPLATE = app

# The following define makes your compiler emit warnings if you use
# any feature of Qt which has been marked as deprecated (the exact warnings
# depend on your compiler). Please consult the documentation of the
# deprecated API in order to know how to port your code away from it.
DEFINES += QT_DEPRECATED_WARNINGS

# You can also make your code fail to compile if you use deprecated APIs.
# In order to do so, uncomment the following line.
# You can also select to disable deprecated APIs only up to a certain version of Qt.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

CONFIG += c++11
QTPLUGIN += qsqloci qgif
CONFIG += static
SOURCES += \
        main.cpp \
        mainwindow.cpp \
    buttonmanager.cpp \
    jsonparser.cpp \
    padmanager.cpp \
    socketserver.cpp \
    midimanager.cpp

HEADERS += \
        mainwindow.h \
    buttonmanager.h \
    jsonparser.h \
    padmanager.h \
    socketsever.h \
    virtualmidi.h \
    midimanager.h

FORMS += \
        mainwindow.ui

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

include(thirdparty/QMidi/src/QMidi.pri)
include(config.json)



LIBS += -luser32
LIBS += X:/grape/thirdparty/teVirtualMIDI64.lib

DISTFILES += \
    config.json \
    index.html

RESOURCES += \
    securesocketclient.qrc
