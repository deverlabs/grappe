#include "padmanager.h"

padManager::padManager(QJsonObject configLoaded)
{
    this->buttons = configLoaded.value("buttons").toArray();

}

void padManager::LoadConfig(QJsonObject configLoaded){
    std::cout << "config loaded";
    this->buttons = configLoaded.value("buttons").toArray();
}

void padManager::addButton(QJsonObject btnConf){
     this->buttonsList.append(new buttonManager(btnConf));
}

buttonManager* padManager::getButton(int index) {
    return this->buttonsList.at(index);
}

QJsonArray padManager::getButtons() {
    return this->buttons;
}
