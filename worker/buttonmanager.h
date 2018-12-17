#ifndef BUTTONMANAGER_H
#define BUTTONMANAGER_H
#include <QString>
 #include <QJsonObject>

class buttonManager
{
public:
    buttonManager(QJsonObject btnID);
    QJsonObject getValue();

private:
    QJsonObject myBtn;
};

#endif // BUTTONMANAGER_H
