#ifndef JSONPARSER_H
#define JSONPARSER_H
#include <QFile>
#include <iostream>
 #include <QJsonDocument>
 #include <QJsonObject>

class jsonParser
{
public:
       jsonParser(QString name);
       QJsonObject getConfig();
private:
       QJsonDocument file;
};

#endif // JSONPARSER_H
