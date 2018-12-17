#include "mainwindow.h"
#include <QApplication>

#include <QtPlugin>
#include <QtCore/QCoreApplication>
#include <QTimer>
#include <iostream>
#include "jsonparser.h"
#include "padmanager.h"
#include "midimanager.h"
#include <QJsonArray>
#include <ostream>
#include <QtDebug>

#include <stdio.h>
#include <conio.h>
#include "virtualmidi.h"

#define MAX_SYSEX_BUFFER	65535


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



int main(int argc, char *argv[])
{

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




    QApplication a(argc, argv);
    MainWindow w;
    w.show();
    //jsonParser file("C:/Users/xD3VHAX/Desktop/Padtoche/config.json");
    //QJsonObject config = file.getConfig();
    //padManager* manager = new padManager(config);

      // foreach (const QJsonValue & v, manager->getButtons())
        //   manager->addButton(v.toObject());



   //qInfo() << manager->getButton(0)->getValue().value("name").toString();
   //qInfo() << manager->getButton(1)->getValue().value("name").toString();

   qDebug() << "Waiting";

    return a.exec();
}
