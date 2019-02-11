# Grappe - Arduino

Cette partie a pour responsabilité de lier le hardware au Worker en utilisant une communication port série via USB.

## Serial Port

La communication entre le PC et la carte est effectuée par le port série.
Le port série doit être configuré à un baud-rate de `115200`.

Les events (en TX et RX) sont envoyés sous la forme de ligne (terminés par un `\n`).
Chaque segment est séparé par un `:`.
Le premier segment correspond à un certain type d'event.
Les composants sont numéros de 0 à n - 1 (0 à 5 pour une carte 6 composants)

### TX events - HW to PC

Types d'events :
* 0 : Event système
* 1 : Changement état composant (bouton poussé)

Liste des events :
* `0:ready-event` : Envoyé au démarrage de la carte
* `0:event-ack` : Event RX bien traité
* `0:event-nack` : Event RX non traité
* `1:{composant#}:{value}` : Event RX non traité

### RX events - PC to HW

Types d'events :
* 1 : Set Label

Liste des events :
* `1:{composant#}:{label}` : Affiche le label sur l'écran pour le composant #

