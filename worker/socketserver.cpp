
#include "socketsever.h"
#include "QtWebSockets/QWebSocketServer"
#include "QtWebSockets/QWebSocket"
#include <QtCore/QDebug>
#include <QtCore/QFile>
#include <iostream>

 #include <QJsonObject>
#include <QtNetwork/QSslCertificate>
#include <QtNetwork/QSslKey>
#include "padmanager.h"



SocketServer::SocketServer(quint16 port, QObject *parent) :
    QObject(parent),
    m_pWebSocketServer(nullptr)
{
    m_pWebSocketServer = new QWebSocketServer(QStringLiteral("SSL Echo Server"),
                                              QWebSocketServer::NonSecureMode,
                                              this);
    QSslConfiguration sslConfiguration;
    QFile certFile(QStringLiteral(":/certs/server.crt"));
    QFile keyFile(QStringLiteral(":/certs/server.key"));
    certFile.open(QIODevice::ReadOnly);
    keyFile.open(QIODevice::ReadOnly);
    QSslCertificate certificate(&certFile, QSsl::Pem);
       QSslKey sslKey(&keyFile, QSsl::Rsa, QSsl::Pem);
       certFile.close();
       keyFile.close();
       sslConfiguration.setPeerVerifyMode(QSslSocket::VerifyNone);
       sslConfiguration.setLocalCertificate(certificate);
       sslConfiguration.setPrivateKey(sslKey);
       sslConfiguration.setProtocol(QSsl::TlsV1SslV3);
      // m_pWebSocketServer->setSslConfiguration(sslConfiguration);

    if (m_pWebSocketServer->listen(QHostAddress::Any, port))
    {

        qDebug() << "SSL Echo Server listening on port" << port;
        connect(m_pWebSocketServer, &QWebSocketServer::newConnection,
                this, &SocketServer::onNewConnection);
        connect(m_pWebSocketServer, &QWebSocketServer::sslErrors,
                this, &SocketServer::onSslErrors);
    }
}

SocketServer::~SocketServer()
{
    m_pWebSocketServer->close();
    qDeleteAll(m_clients.begin(), m_clients.end());
}

void SocketServer::onNewConnection()
{
    emit new_connection();
    QWebSocket *pSocket = m_pWebSocketServer->nextPendingConnection();

    qDebug() << "Client connected:" << pSocket->peerName() << pSocket->origin();
    connect(pSocket, &QWebSocket::textMessageReceived, this, &SocketServer::processTextMessage);
    connect(pSocket, &QWebSocket::binaryMessageReceived,this, &SocketServer::processBinaryMessage);
    connect(pSocket, &QWebSocket::disconnected, this, &SocketServer::socketDisconnected);
    m_clients << pSocket;

    qDebug() << pSocket;
    QJsonObject res {{"event", "connected"}, {"message", "Connected to grape version v0.1"}};
    QJsonDocument doc(res);
    pSocket->sendTextMessage(doc.toJson(QJsonDocument::Compact));

}

void SocketServer::processTextMessage(QString message)
{
        emit new_message(message);

}

void SocketServer::processBinaryMessage(QByteArray message)
{
    QWebSocket *pClient = qobject_cast<QWebSocket *>(sender());
    if (pClient)
    {
        pClient->sendBinaryMessage(message);
    }
}

void SocketServer::socketDisconnected()
{
    qDebug() << "Client disconnected";
    QWebSocket *pClient = qobject_cast<QWebSocket *>(sender());
    if (pClient)
    {
        m_clients.removeAll(pClient);
        pClient->deleteLater();
    }
}

void SocketServer::onSslErrors(const QList<QSslError> &)
{
    qDebug() << "Ssl errors occurred";
}
