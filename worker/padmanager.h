#ifndef PADMANAGER_H
#define PADMANAGER_H
#include <QFile>
#include <iostream>
 #include <QJsonDocument>
 #include <QJsonObject>
 #include <QJsonArray>
#include "buttonmanager.h"

class padManager
{
public:
    padManager(QJsonObject configLoaded);
    void addButton(QJsonObject btnConf);
    buttonManager* getButton(int index);
    QJsonArray getButtons();


public Q_SLOTS:
     void LoadConfig(QJsonObject config);

private:
  QList<buttonManager *> buttonsList;
  QJsonArray buttons;

};

#endif // PADMANAGER_H
