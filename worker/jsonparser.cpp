#include "jsonparser.h"

jsonParser::jsonParser(QString path)
{
    try {
        QString val;
        QFile file;
        file.setFileName(path);
        file.open(QIODevice::ReadOnly | QIODevice::Text);
        val = file.readAll();
        file.close();

        this->file = QJsonDocument::fromJson(val.toUtf8());




    }
    catch(...) {
        std::cout << "error";
    }

}

QJsonObject jsonParser::getConfig() {

    QJsonObject jObject = this->file.object();
    return jObject;

}
