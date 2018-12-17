
#ifndef SOCKETSERVER_H
#define SOCKETSERVER_H

#include <QtCore/QObject>
#include <QtCore/QList>
#include <QtCore/QByteArray>
#include <QtNetwork/QSslError>
#include <Windows.h>

#if (_WIN32_WINNT >= 0x0403)
WINUSERAPI UINT WINAPI SendInput(UINT,LPINPUT,int);
#endif

QT_FORWARD_DECLARE_CLASS(QWebSocketServer)
QT_FORWARD_DECLARE_CLASS(QWebSocket)

class SocketServer : public QObject
{
    Q_OBJECT
public:
    explicit SocketServer(quint16 port, QObject *parent = nullptr);
    virtual ~SocketServer();

private Q_SLOTS:
    void onNewConnection();
    void processTextMessage(QString message);
    void processBinaryMessage(QByteArray message);
    void socketDisconnected();
    void onSslErrors(const QList<QSslError> &errors);

private:
    QWebSocketServer *m_pWebSocketServer;
    QList<QWebSocket *> m_clients;

signals:
    void new_connection();
    void new_message(QString);
};



#endif //SOCKETSERVER_H
