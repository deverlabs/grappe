#include "midimanager.h"
#include <QDebug>
midiManager::midiManager()
{

}


void midiManager::connectDriver()
{
    QMap<QString, QString> vals = QMidiOut::devices();
    qDebug() << "Available interfaces: ";
    for(auto e : vals.keys())
    {
         qDebug() << vals.value(e);
        if(vals.value(e) == DRIVER_NAME){
              qDebug() << "Driver found !";
        }
    //  cout << e.toStdString() << "-> " << vals.value(e).toStdString() << endl;
    }

    midi.connect("2");
    qDebug() << "Connected to midi driver";
    midi.sendMsg(0x90 + 0 | 60 << 8 | 64 << 16);
}
