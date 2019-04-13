const presets = {
  'PUSHBTN': [
    {
      'buttonName': 'Clavier virtuel',
      'description': 'Ouvre le clavier virtuel Windows.',
      'keys': [
        { 'type': 'suit', 'keys': ['0x5B', '0x11', '0x4F'] },
      ]
    },
    {
      'buttonName': 'Météo',
      'description': 'Permet de rechercher la météo sur l\'Internet mondial.',
      'keys': [
        { 'type': 'process', 'command': 'explorer https://google.fr', 'sleep': '2000' }, // Commande CMD a exec, sleep 2000ms avant la prochaine étape
        { 'type': 'text', 'text': 'Meteo' }, // Ecrire du texte
        { 'type': 'suit', 'keys': ['0x0D'] } // Faire une suite de hotkey ici seuelement enter
      ]
    },
    {
      'buttonName': 'facebook.com',
      'description': 'Ouvre le site du réseau social Facebook.',
      'keys': [
        { 'type': 'process', 'command': 'explorer https://facebook.com' },
      ]
    },
    {
      'buttonName': 'twitter.com',
      'description': 'Ouvre le site du réseau social Twitter.',
      'keys': [
        { 'type': 'process', 'command': 'explorer https://twitter.com' },
      ]
    },
    {
      'buttonName': 'gmail.com',
      'description': 'Ouvre Google Gmail.',
      'keys': [
        { 'type': 'process', 'command': 'explorer https://gmail.com' },
      ]
    },
    {
      'buttonName': 'Spotify',
      'description': 'Ouvre l\'application spotify.',
      'keys': [
        { 'type': 'process', 'command': 'start C:\\Users\\xD3CODER\\AppData\\Roaming\\Spotify\\Spotify.exe' },
      ]
    },
    {
      'buttonName': 'Touche arobase',
      'description': 'Entre un arobase dans la zone de texte.',
      'keys': [
        { 'type': 'suit', 'keys': ['0x12', '0x66', '0x64'] }
      ]
    },
    {
      'buttonName': 'Skype',
      'description': 'Ouvre l\'application web Skype.',
      'keys': [
        { 'type': 'process', 'command': 'explorer https://web.skype.com/' },
      ]
    },
    /*    {
      'buttonName': 'Email urgence',
      'description': "Envoie un email d'urgence à un contact défini.",
      'keys': [
        { 'type': 'process', 'command': 'explorer "https://mail.google.com/mail/u/0/#inbox?compose=new"', 'sleep': 30000 },
        //{ 'type': 'text', 'text': 'tcardonne@gmail.com', 'sleep': 100 },
        { 'type': 'keys', 'keys': ['0x09'], 'sleep': 100 },
        { 'type': 'keys', 'keys': ['0x09'], 'sleep': 100 },
        { 'type': 'text', 'text': 'BESOIN AIDE URGENT', 'sleep': 100 },
        { 'type': 'keys', 'keys': ['0x09'], 'sleep': 100 },
        { 'type': 'text', 'text': 'URGENT BESOIN AIDE APPELLE MOI URGENT', 'sleep': 100 },
      ]
    }, */
  ],
  'DSWITCH': [
    {
      'buttonName': 'Volume muet',
      'description': 'Activez rapidement le mode muet.',
      'keys': [{
        'type': 'suit',
        'keys': ['0xAD']
      }]
    }
  ],
  'POTENTIOMETER': [
    {
      'buttonName': 'Zoom',
      'description': 'Utilisez ce composant pour agrandir ou rétrécir le contenu.',
      'keys': [{
        'type': 'suit',
        'keys': ['0x11', '1:scrollDown', '0:scrollUp']
      }]
    },
    {
      'buttonName': 'Contrôle du volume',
      'description': 'Utilisez ce composant pour contrôler le volume de l\'ordinateur.',
      'keys': [{
        'type': 'suit',
        'keys': ['0:0xAE', '1:0xAF']
      }]
    },
  ],
  'JOYSTICK': [
    {
      'buttonName': 'Flêches directionnelles',
      'description': 'Simule les flêches directionnelles du clavier.',
      'keys': [{
        'type': 'suit',
        'keys': ['0:0x26', '1:0x28', '2:0x25', '3:0x27']
      }]
    },
  ],
  'PIR': [

  ],
};

export default presets;