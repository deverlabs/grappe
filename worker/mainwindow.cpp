#include "mainwindow.h"
#include "ui_mainwindow.h"
#include "socketsever.h"
#include "padmanager.h"
#include <typeinfo>
#include <QSerialPortInfo>
#include <stdlib.h>
#include <QDebug>
#include <QPushButton>
#include "jsonparser.h"
#include <QList>
#include "padmanager.h"
#include <QJsonArray>
#include <ostream>
#include <QtDebug>
#include <QMutex>
#include <stdio.h>
#include <conio.h>


QVector<QJsonValue>* vec = new QVector<QJsonValue>;

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


/*    padManager* manager = new padManager();

    foreach (const QJsonValue & v, manager->getButtons())
        manager->addButton(v.toObject(), ui);



    qInfo() << manager->getButton(0)->getValue().value("name").toString();
    qInfo() << manager->getButton(2)->getValue().value("name").toString();
    qInfo() << manager->getButtons();*/

    sPort = new QSerialPort();
       sPort->setBaudRate(QSerialPort::Baud115200);
       sPort->setDataBits(QSerialPort::Data8);
       sPort->setParity(QSerialPort::NoParity);
       sPort->setStopBits(QSerialPort::OneStop);
       sPort->setFlowControl(QSerialPort::NoFlowControl);
       QList<QSerialPortInfo> list =  QSerialPortInfo::availablePorts();
       qDebug() << "AVILABLE SERIAL PORTS:";
       for(int i=0; i<list.size(); i++)
       {
           qDebug() << list[i].portName();
       }
       sPort->setPortName("COM7");
       if (!sPort->open(QIODevice::ReadWrite)) {
           qInfo() << "Error opening serial port: " << sPort->errorString();
       }
       else {
            connect(sPort, SIGNAL(readyRead()),this, SLOT(readArduinoData()));
       }




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
    qInfo() << message;
    vec->clear();
    QString btnName = message["buttonName"].toString();
    ui->pushButton_2->setText(btnName);
    QByteArray buffer;
    buffer.append("1:0:"+message["buttonName"].toString()+"\n");
    qDebug() << buffer;
    sPort->write(buffer);
    //serial->flush();
    sPort->waitForBytesWritten(1000);
    QJsonArray array = message["keys"].toArray();
    qInfo ()<< array;
    foreach (const QJsonValue & value, array)
    {
        qInfo()<<value;
        vec->push_back(value);

    }



}


void MainWindow::on_dial_valueChanged(int value)
{

}

void MainWindow::on_verticalSlider_valueChanged(int value)
{

}

void MainWindow::on_pushButton3_clicked()
{


}


void MainWindow::readArduinoData()
{

    QRegExp rx("[:]");
    QByteArray byteArray = sPort->readLine();
    QString brut = QString(byteArray);
    QString data = brut.replace("\r\n", "");
    QStringList keys = data.split(rx, QString::SkipEmptyParts);

    qDebug() << keys;
    // Joystick
    if(keys[1] == '4'){
          INPUT* key = new INPUT[1];
          key[0].type = INPUT_KEYBOARD;
          key[0].ki.wScan = 0;
          key[0].ki.time = 0;
          key[0].ki.dwExtraInfo = 0;
          key[0].ki.dwFlags = 0;

        // up
        if(keys[2]== '0'){
               key[0].ki.wVk = 0x26;
        }
        //down
        if(keys[2]== '1'){
 key[0].ki.wVk = 0x28;
        }
        //left
        if(keys[2]== '2'){
            key[0].ki.wVk =  0x25;
        }
        //right
        if(keys[2]== '3'){
 key[0].ki.wVk = 0x27;
        }
        SendInput(1, &key[0], sizeof(INPUT));
        key[0].ki.dwFlags = KEYEVENTF_KEYUP;
        SendInput(1, &key[0], sizeof(INPUT));
    }
    // Btn
     if(keys[1] == "1" && keys[2] == "1") {
        QRegExp rx("[, ]");
        QMutex mut;
        for(int i = 0; i < vec->size(); i++)
        {
            QJsonValue step = vec->at(i);
            QStringList keys = step["keys"].toString().split(rx, QString::SkipEmptyParts);
            qDebug() << keys;
            unsigned long long size = (unsigned long long)keys.length();

            INPUT* key = new INPUT[size];
            mut.lock();
            mut.tryLock(500);
            mut.unlock(); // I am not sure if this is a necessity

            if (step["type"] == "suit") {
                for(int i = 0; i < keys.size(); i++)
                {
                    qDebug() << keys[i];
                    unsigned short number = (unsigned short) strtoul(keys[i].toStdString().c_str(), NULL, 0);
                    key[i].type = INPUT_KEYBOARD;
                    key[i].ki.wScan = 0;
                    key[i].ki.time = 0;
                    key[i].ki.dwExtraInfo = 0;
                    key[i].ki.dwFlags = 0;
                    key[i].ki.wVk = number;
                    // qDebug() << typeid(key[i].ki.wVk).name();
                    SendInput(1, &key[i], sizeof(INPUT));

                }

                for(int i = 0; i < keys.size(); i++)
                {
                    key[i].ki.dwFlags = KEYEVENTF_KEYUP;
                    SendInput(1, &key[i], sizeof(INPUT));

                }

            }
            else if(step["type"] == "text"){
                for(int i = 0; i < keys.size(); i++)
                {
                    qDebug() << keys[i];
                    unsigned short number = (unsigned short) strtoul(keys[i].toStdString().c_str(), NULL, 0);
                    key[i].type = INPUT_KEYBOARD;
                    key[i].ki.wScan = 0;
                    key[i].ki.time = 0;
                    key[i].ki.dwExtraInfo = 0;
                    key[i].ki.dwFlags = 0;
                    key[i].ki.wVk = number;
                    // qDebug() << typeid(key[i].ki.wVk).name();
                    SendInput(1, &key[i], sizeof(INPUT));
                    key[i].ki.dwFlags = KEYEVENTF_KEYUP;
                    SendInput(1, &key[i], sizeof(INPUT));
                }


            }

        }
    }



}



void MainWindow::on_pushButton_2_clicked()
{


}

