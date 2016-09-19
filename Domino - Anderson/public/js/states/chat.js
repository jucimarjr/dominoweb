/**
 * Created by priscila on 20/11/2015.
 */

atualizaJogadores = function(data){
    var i=1;
    for( var jogador in data){
        console.log(data[jogador]);
        document.getElementById('jogador' + i).innerHTML = jogador;
        i+=1;
    }
};

mensagemChat = function(data){
    var chat = document.getElementById('chatText');
    chat.innerHTML += '\n' + data.playerName + ': ' + data.msg;
};

enviarMsg = function(){
    var inputChat = document.getElementById('chatInput');
    var dados = {
        msg: inputChat.value,
        playerName: game.playerName,
        chat:true
    };
    inputChat.value = '';
    game.socket.emit('mensagemSala', {nomeSala: game.roomName, msg:dados});
};