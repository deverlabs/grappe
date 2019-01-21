#include "mainwindow.h"
#include "ui_mainwindow.h"
#include "socketsever.h"
#include "midimanager.h"
#include <typeinfo>
#include <stdlib.h>
#include <QDebug>
#include <QPushButton>
#include "jsonparser.h"
#include "padmanager.h"
#include "midimanager.h"
#include <QJsonArray>
#include <ostream>
#include <QtDebug>
#include <QMutex>
#include <stdio.h>
#include <conio.h>
#include "virtualmidi.h"

#define MAX_SYSEX_BUFFER	65535

QRegExp rx("[, ]");
char *binToStr( const unsigned char *data, DWORD length ) {
    static char dumpBuffer[ MAX_SYSEX_BUFFER * 3 ];
    DWORD index = 0;

    while ( length-- ) {
        sprintf( dumpBuffer+index, "%02x", *data );
        if ( length ) {
            strcat( dumpBuffer, ":" );
        }
        index+=3;
        data++;
    }
    return dumpBuffer;
}

void CALLBACK teVMCallback( LPVM_MIDI_PORT midiPort, LPBYTE midiDataBytes, DWORD length, DWORD_PTR dwCallbackInstance ) {
    if ( ( NULL == midiDataBytes ) || ( 0 == length ) ) {
        printf( "empty command - driver was probably shut down!\n" );
        return;
    }
    if ( !virtualMIDISendData( midiPort, midiDataBytes, length ) ) {
        printf( "error sending data: %d\n" + GetLastError() );
        return;
    }
      printf( "command: %s\n", binToStr( midiDataBytes, length ) );
}



midiManager* a = new midiManager();



QVector<QStringList>* vec = new QVector<QStringList>
{
        {"0x5b"},
        {"0x43", "0x4D", "0x44", "0x0D"},
        {"0x43", "0x4f", "0x55", "0x43", "0x4f", "0x55"}

};

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    SocketServer *server = new SocketServer(1234);
    connect(server, SIGNAL(new_connection()), this, SLOT(on_socket_connection()));
      connect(server, SIGNAL(new_message(QJsonObject)), this, SLOT(on_socket_message(QJsonObject)));
    Q_UNUSED(server);

 ui->setupUi(this);
 ui->gridLayout->setColumnStretch(0, 3);
  ui->gridLayout->setColumnStretch(1, 3);
    LPVM_MIDI_PORT port;
    midiManager* midi = new midiManager();
    printf( "teVirtualMIDI C loopback sample\n" );
    printf( "using dll-version:    %ws\n", virtualMIDIGetVersion( NULL, NULL, NULL, NULL ));
    printf( "using driver-version: %ws\n", virtualMIDIGetDriverVersion( NULL, NULL, NULL, NULL ));

    virtualMIDILogging( TE_VM_LOGGING_MISC | TE_VM_LOGGING_RX | TE_VM_LOGGING_TX );

    port = virtualMIDICreatePortEx2((const wchar_t*)midi->DRIVER_NAME.utf16(), teVMCallback, 0, MAX_SYSEX_BUFFER, TE_VM_FLAGS_PARSE_RX );
    if ( !port ) {
        printf( "could not create port: %d\n", GetLastError() );

    }

    qDebug () << "Virtual port created - press enter to close port again\n" ;




    jsonParser file("X:/grape/config.json");
    QJsonObject config = file.getConfig();
    padManager* manager = new padManager(config);

       foreach (const QJsonValue & v, manager->getButtons())
           manager->addButton(v.toObject(), ui);



   qInfo() << manager->getButton(0)->getValue().value("name").toString();
   qInfo() << manager->getButton(2)->getValue().value("name").toString();
   qInfo() << manager->getButtons();
    a->connectDriver();
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::on_pushButton_clicked()
{


}

void MainWindow::on_socket_connection()
{
    ui->status_label->setText("Successfully connected");
}

void MainWindow::on_socket_message(QJsonObject message)
{
    vec->clear();
    for(const QString &key: message.keys() ){
              qInfo() << key;
              if(key=="buttonName"){
                    ui->pushButton_2->setText(message.value(key).toString());
              }
              else if(message.value(key).toString().length() > 0) {
                   qInfo ()<< message.value(key).toString();
                   vec->push_back(message.value(key).toString().split(rx, QString::SkipEmptyParts));
              }

    }

}


void MainWindow::on_dial_valueChanged(int value)
{

    QMidiEvent e;
    e.setType(QMidiEvent::NoteOn);
    e.setVoice(0);
    e.setNote(60);
    e.setVelocity(value);
    a->midi.sendEvent(e);
}

void MainWindow::on_pushButton_2_clicked()
{

    QRegExp rx("[, ]");
    QMutex mut;
    for(int i = 0; i < vec->size(); i++)
    {

        QStringList list = vec->at(i);
        unsigned long long size = (unsigned long long)list.length();
        qDebug() << list;
        INPUT* key = new INPUT[size];
        mut.lock();
        mut.tryLock(500);
        mut.unlock(); // I am not sure if this is a necessity

        for(int i = 0; i < list.size(); i++)
        {
            unsigned short number = (unsigned short) strtoul(list[i].toStdString().c_str(), NULL, 0);
            key[i].type = INPUT_KEYBOARD;
            key[i].ki.wScan = 0;
            key[i].ki.time = 0;
            key[i].ki.dwExtraInfo = 0;
            key[i].ki.dwFlags = 0;
            key[i].ki.wVk = number;
            qDebug() << typeid(key[i].ki.wVk).name();
            SendInput(1, &key[i], sizeof(INPUT));

        }

        for(int i = 0; i < list.size(); i++)
        {
           key[i].ki.dwFlags = KEYEVENTF_KEYUP;
            SendInput(1, &key[i], sizeof(INPUT));

        }
    }

}

void MainWindow::on_verticalSlider_valueChanged(int value)
{
    QMidiEvent e;
    e.setType(QMidiEvent::NoteOn);
    e.setVoice(1);
    e.setNote(61);
    e.setVelocity(value);
    a->midi.sendEvent(e);
}
