const presets = {
  'PUSHBTN': [
    {
      'buttonName': 'Météo',
      'description': 'Permet de rechercher la météo sur l\'Internet mondial.',
      'keys': [
        { 'type': 'process', 'command': 'explorer https://google.fr', 'sleep': '1000' }, // Commande CMD a exec, sleep 1000ms avant la prochaine étape
        { 'type': 'text', 'text': 'Meteo' }, // Ecrire du texte
        { 'type': 'suit', 'keys': ['0x0D'] } // Faire une suite de hotkey ici seuelement enter
      ]
    }
  ],
  'DSWITCH': [

  ],
  'POTENTIOMETER': [
    {
      'buttonName': 'Zoom',
      'description': 'Utilisez ce composant pour agrandir ou rétrécir le contenu.',
      'keys': [{
        'type': 'suit',
        'keys': ['0x11', '0:scrollDown', '1:scrollUp']
      }]
    },
  ],
  'JOYSTICK': [

  ],
  'PIR': [

  ],
};

export default presets;