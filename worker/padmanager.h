#ifndef PADMANAGER_H
#define PADMANAGER_H
#include <QFile>
#include <iostream>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include "buttonmanager.h"
#include "ui_mainwindow.h"

class padManager : public QObject {

public:
    padManager(QJsonObject configLoaded);
    void addButton(QJsonObject btnConf, Ui::MainWindow* ui);
    buttonManager* getButton(int index);
    QJsonArray getButtons();
    Ui::MainWindow* ui;


public Q_SLOTS:
    void LoadConfig(QJsonObject config);

public slots :
    void handleClick();

private slots:
    void on_pushButton_2_clicked();

    void on_pushButton3_clicked();

    void on_dial_valueChanged(int value);

    void on_verticalSlider_valueChanged(int value);

private:
    QList<buttonManager *> buttonsList;
    QJsonArray buttons;


};

#endif // PADMANAGER_H
