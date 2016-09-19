/**
 * Created by priscila on 18/11/2015.
 */

var game = new Phaser.Game(1200, 800, Phaser.AUTO, 'phaser', { preload: preload, create: create });

function preload () {

    game.load.script('logo', 'js/states/logo.js');
    game.load.script('main', 'js/states/main.js');
    game.load.script('lobby', 'js/states/lobby.js');
    game.load.script('game', 'js/states/game.js');

}

function create () {

    game.socket = null;
    game.rooms = [];
    game.playerName = '';
    game.roomName = '';

    game.stage.backgroundColor = "#FFF";

    game.state.add('Logo', LogoState);
    game.state.add('Main', MainState);
    game.state.add('Lobby', LobbyState);
    game.state.add('Game', GameState);

    game.state.start('Logo');

}

var inicia_socket = function(){

    game.socket = io.connect('/');

    game.socket.on('connect', function(){
        game.socket.emit('adicionarJogador', {nomeJogador: game.playerName});
    });

    game.socket.on('salasDisponiveis', function(dados){
        game.rooms = [];
        for(var index in dados)
            game.rooms.push(dados[index].sala);
    });

    game.socket.on('mensagemSala', function(dados){
        if(dados.data.chat){
            mensagemChat(dados.data);
        }
    });

    game.socket.on('jogadoresSala', function(dados){
        atualizaJogadores(dados.data);
    });

};