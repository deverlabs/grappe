#include "mainwindow.h"
#include <QApplication>
#include <QDesktopServices>
#include <QUrl>
#include <QtPlugin>
#include <QtCore/QCoreApplication>
#include <QTimer>
#include <iostream>

int main(int argc, char *argv[])
{


    QApplication a(argc, argv);
    MainWindow w;
    //QDesktopServices::openUrl(QUrl("file:///D:/grape/index.html"));

    w.showMinimized();

    return a.exec();
}
