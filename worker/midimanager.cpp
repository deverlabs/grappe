#include "midimanager.h"
#include <QDebug>
midiManager::midiManager()
{
}

void midiManager::connectDriver()
{
    QMap<QString, QString> vals = QMidiOut::devices();
    int i = 0;
    qDebug() << "Available interfaces: ";
    for(auto e : vals.keys())
    {
         qDebug() << vals.value(e);
        if(vals.value(e) == DRIVER_NAME){
              qDebug() << "Driver found !";
               this->midi.connect(QString::number(i));
              break;
        }
        i++;
    //  cout << e.toStdString() << "-> " << vals.value(e).toStdString() << endl;
    }
}
