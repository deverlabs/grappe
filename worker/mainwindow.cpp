#include "mainwindow.h"
#include "ui_mainwindow.h"
#include "socketsever.h"
#include "midimanager.h"
#include <typeinfo>
#include <stdlib.h>
#include <QDebug>
#include <QMidiOut.h>
#include <QMidiFile.h>
midiManager* a = new midiManager();

QString action = "0x5B";

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    a->connectDriver();
    ui->setupUi(this);


}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::on_pushButton_clicked()
{
         SocketServer *server = new SocketServer(1234);
         connect(server, SIGNAL(new_connection()), this, SLOT(on_socket_connection()));
         connect(server, SIGNAL(new_message(QString)), this, SLOT(on_socket_message(QString)));
         Q_UNUSED(server);

}

void MainWindow::on_socket_connection()
{
    ui->status_label->setText("Successfully connected");
}

void MainWindow::on_socket_message(QString message)
{
   ui->pushButton_2->setText(message);
   action = message;

   qDebug() << message;
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
    QRegExp rx("[, ]");// match a comma or a space
    QStringList list = action.split(rx, QString::SkipEmptyParts);
    unsigned long long size = (unsigned long long)list.length();;
    qDebug() << list;
    INPUT* key = new INPUT[size];


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

void MainWindow::on_verticalSlider_valueChanged(int value)
{
    QMidiEvent e;
    e.setType(QMidiEvent::NoteOn);
    e.setVoice(0);
    e.setNote(60);
    e.setVelocity(value);
    a->midi.sendEvent(e);
}
