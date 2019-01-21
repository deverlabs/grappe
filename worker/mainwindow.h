#ifndef MAINWINDOW_H
#define MAINWINDOW_H
#include <QtGlobal>
#include <QMainWindow>
#include <QJsonObject>
namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = nullptr);
      Ui::MainWindow *ui;
    ~MainWindow();

private slots:
    void on_pushButton_clicked();
    void on_socket_connection();
    void on_socket_message(QJsonObject);
    void on_dial_valueChanged(int value);

    void on_pushButton_2_clicked();

    void on_verticalSlider_valueChanged(int value);
};

#endif // MAINWINDOW_H
