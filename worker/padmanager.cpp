#include "padmanager.h"
#include "ui_mainwindow.h"
#include <QtDebug>
#include <QObject>
padManager::padManager(QJsonObject configLoaded)
{
    this->buttons = configLoaded.value("buttons").toArray();
}

void padManager::LoadConfig(QJsonObject configLoaded){
    std::cout << "config loaded";
    this->buttons = configLoaded.value("buttons").toArray();
}

void padManager::handleClick() {
    QPushButton* pButton = qobject_cast<QPushButton*>(sender());
    if (pButton) // this is the type we expect
    {
        qInfo() << pButton->text();
    }

}

void padManager::addButton(QJsonObject btnConf, Ui::MainWindow* ui){
    this->buttonsList.append(new buttonManager(btnConf));

    if(btnConf["type"] == "button") {
        QPushButton *b = new QPushButton;
        QString name = btnConf["name"].toString();
        b->setText(name);
        ui->gridLayout->addWidget(b);
        connect(b, &QPushButton::clicked, this, &padManager::handleClick);
    }
    else  if(btnConf["type"] == "dial") {
        QDial *b = new QDial;
        ui->gridLayout->addWidget(b);
    }
    else  if(btnConf["type"] == "slider") {
        QSlider *b = new QSlider;
        b->setOrientation(Qt::Orientation::Horizontal);
        ui->gridLayout->addWidget(b);
    }
}

buttonManager* padManager::getButton(int index) {
    return this->buttonsList.at(index);
}

QJsonArray padManager::getButtons() {
    return this->buttons;
}
