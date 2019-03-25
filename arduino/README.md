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

## Composants

### Composant null - T_COMP_NULL (id 0)
Dummy composant, utilisé lorsque le slot n'est pas utilisé (internal).

### Bouton poussoir - T_COMP_PUSHBTN (id 1)

Valeurs retournées :

| Etat     |      Valeur   |
|:----------:|:-------------:|
| Non poussé |  0 |
| Poussé |    1   |

### Double Interrupteur - T_COMP_DSWITCH (id 2)

Valeurs retournées :

| Bouton 1   | Bouton 2     |      Valeur   |
|:----------:|:----------:|:-------------:|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 2 |
| 1 | 1 | 3 |

### Potentiomètre - T_COMP_POTENTIOMETER (id 3)

Renvoie une valeur théoriquement entre 0 et 1023.

### Joystick - T_COMP_JOYSTICK (id 4)

| Direction     |      Valeur   |
|:----------:|:-------------:|
| Haut |  0 |
| Bas |    1   |
| Gauche |    2   |
| Droite |    3   |


### Capteur de présence infrarouge - T_COMP_PIR (id 5)

Non implémenté.

| Direction     |      Valeur   |
|:----------:|:-------------:|
| Présence |  1 |
| Non présence |    0   |


