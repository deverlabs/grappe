#ifndef MIDIMANAGER_H
#define MIDIMANAGER_H
#include <QMidiOut.h>
#include <QMidiFile.h>
#include <QString>

class midiManager
{
public:
    midiManager();
    void connectDriver();
    QString DRIVER_NAME = "Grappe Driver";
    QMidiOut midi;
};

#endif // MIDIMANAGER_H
