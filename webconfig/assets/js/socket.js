var suit = [[], [], []];
var hex = [[], [], []];

$('.suit').keyup(function(e) {
  suit[$(this).attr('id').substr(4)].push(e.key) // input
  hex[$(this).attr('id').substr(4)].push("0x"+e.keyCode.toString(16)) // storage
  console.log(hex)
  $(this).val(suit[$(this).attr('id').substr(4)]+"")
});

let initialized = false;
let sendMessage = null;




let emptyStep = function(val) {
  $('#'+val).val('');
  suit[val.substr(4)] = [];
  hex[val.substr(4)] = [];
}
$(document).ready(function() {
  let socket = new WebSocket('ws://127.0.0.1:1234')
function waitForConnection(socket) {

  socket.onopen = function (evt) {
    console.log('Opened')
    sendMessage = function() {
      console.log(socket)
      socket.send(
          JSON.stringify({
            buttonName: $("#buttonName").val(),
            keys : [
              {  type : "suit",
                keys : hex[0].toString()
              },
              {  type : "suit",
                keys :  hex[1].toString(),
              },
              {  type : "text",
                keys : hex[2].toString()
              }

            ]

          })
      );
    }
  };
  socket.onmessage = function (evt) {
    let response = JSON.parse(evt.data)
    switch (response.event){
      case 'connected' :
        initialized = true;
        console.log(socket)
        $('#socket-status').html(response.message).css({color : "#03C03C"})
        $('#logo-status img').attr('src','assets/images/logo-stand-orange.png').removeClass('glow');
        break;
    }
  };
  socket.onclose = function(evt) {
    console.log("Connection closed")
    if(initialized){
      $('#socket-status').html("Connexion to Grappe loosed").css({color : "#FF1C00"})
      $('#logo-status img').attr('src','assets/images/logo-stand.png').addClass('glow');
      socket = new WebSocket('ws://127.0.0.1:1234')
      initialized = false;
      return waitForConnection(socket);
    }


  }
  if(socket.readyState === 3){
    socket = new WebSocket('ws://127.0.0.1:1234')
    return waitForConnection(socket);
  }
  else if(socket.readyState === 1){

  }
  else {
    setTimeout(
        function () {
          return waitForConnection(socket);
        }, 500);
  }


}
  waitForConnection(socket)


  $('.pad-btn').on('click', function() {
    alert($(this).attr('id'))
  })
})


