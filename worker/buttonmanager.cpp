#include "buttonmanager.h"

buttonManager::buttonManager(QJsonObject btnConf)
{
   this->myBtn = btnConf;
}


QJsonObject buttonManager::getValue(){
    return this->myBtn;
}
