/**
 * Created by priscila on 17/11/2015.
 */

var roomName = '';
var keyPressed = false;

var LobbyState = function(game){

};

LobbyState.prototype = {

    preload: function(){
        this.load.image('background', 'img/domino_main.jpg');
        this.load.image('retangulo', 'img/retangulo.png');
        this.load.atlasJSONHash('btn_criar', 'img/spritesheets/btn_criar.png', 'img/spritesheets/btn_criar.json');
        this.load.atlasJSONHash('btn_nova', 'img/spritesheets/btn_nova.png', 'img/spritesheets/btn_nova.json');
        this.load.atlasJSONHash('btn_buscar', 'img/spritesheets/btn_buscar.png', 'img/spritesheets/btn_buscar.json');
        this.load.atlasJSONHash('btn_voltar', 'img/spritesheets/btn_voltar.png', 'img/spritesheets/btn_voltar.json');
        this.load.spritesheet('button', 'img/button_sprite_sheet.png', 193, 71);
    },

    create: function(){

        var background = this.add.sprite(this.world.centerX, this.world.centerY, 'background');
        background.anchor.setTo(0.5, 0.5);
        background.scale.setTo(2.5, 2.5);

        this.rooms = [];
        this.loadRooms = false;
        this.roomScreen = game.add.group();
        this.roomScreen.visible = true;
        this.newRoomScreen = game.add.group();
        this.newRoomScreen.visible = false;

        game.input.onDown.add(this.checkClick, this);
        game.input.keyboard.onDownCallback = this.keyPress;

        this.createNewRoomScreen();
        this.createRoomScreen();
        this.searchRooms();

    },

    update: function(){
        if(this.loadRooms){
            this.updateRooms();
            this.loadRooms = false;
        }
        if(keyPressed) {
            this.textRoomName.setText(roomName);
            keyPressed = false;
        }
    },

    keyPress: function(e){
        if(e.keyCode == 8){
            e.preventDefault();
            roomName = roomName.substring(0, roomName.length-1);
        }else {
            if((e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode == 32) {
                var char = String.fromCharCode((96 <= e.keyCode && e.keyCode <= 105) ? e.keyCode - 48 : e.keyCode);
                roomName += char;
            }
        }
        keyPressed = true;
    },

    createNewRoomScreen: function(){
        var title = this.add.text(100, 100, 'CRIAR NOVA SALA',  { font: "42px Broadway", fill: '#FFF' });
        var btnCreateRoom = this.add.button(this.world.centerX + 95, 600, 'btn_criar', this.createRoom, this, 1, 0, 2);
        var btnBackToRooms = this.add.button(this.world.centerX - 315, 600, 'btn_voltar', this.backToRooms, this, 1, 0, 2);
        var text = this.add.text(100, 300, 'Nome: ',  { font: "32px Arial", fill: this.generateHexColor() });
        var retangulo = this.add.sprite(100, 350, 'retangulo');
        retangulo.scale.setTo(2.2, 0.3);
        this.textRoomName = this.add.text(110, 370, '',  { font: "32px Arial", fill: '#FFF' });
        this.newRoomScreen.add(btnCreateRoom);
        this.newRoomScreen.add(btnBackToRooms);
        this.newRoomScreen.add(text);
        this.newRoomScreen.add(title);
        this.newRoomScreen.add(retangulo);
        this.newRoomScreen.add(this.textRoomName);
    },

    createRoomScreen: function(){
        var title = this.add.text(100, 100, 'SALAS DISPONIVEIS',  { font: "42px Broadway", fill: '#FFF' });
        var btnSearch = this.add.button(this.world.centerX - 315, 600, 'btn_buscar', this.searchRooms, this, 1, 0, 2);
        var btnNewRoom = this.add.button(this.world.centerX + 95, 600, 'btn_nova', this.goToNewRoom, this, 1, 0, 2);
        var retangulo = this.add.sprite(100, 160, 'retangulo');
        retangulo.scale.setTo(2.2, 1.6);
        this.roomScreen.add(btnSearch);
        this.roomScreen.add(btnNewRoom);
        this.roomScreen.add(title);
        this.roomScreen.add(retangulo);
    },

    backToRooms: function(){
        this.roomScreen.visible = true;
        this.newRoomScreen.visible = false;
    },

    goToNewRoom: function(){
        this.roomScreen.visible = false;
        this.newRoomScreen.visible = true;
    },

    createRoom: function(){
        var dadosJogador = {
            nome: game.playerName
        };
        game.socket.emit('criarSala', {nomeSala:roomName});
        game.socket.emit('entrarSala', {dadosJogador:dadosJogador, nomeSala:roomName});
        game.roomName = roomName;
        game.state.start('Game');
    },

    searchRooms: function(){
        game.socket.emit('buscarSalas', {nomeJogador:game.playerName});
        this.loadRooms = true;
    },

    checkClick: function(pointer){
        for( var i=0; i<this.rooms.length; i++){
            if( this.rooms[i].clickableArea.contains(pointer.x, pointer.y) ){
                var dadosJogador = {
                    nome: game.playerName
                };
                game.socket.emit('entrarSala', {dadosJogador:dadosJogador, nomeSala:this.rooms[i].text});
                game.roomName = this.rooms[i].text;
                game.state.start('Game');
            }
        }
    },

    updateRooms: function(){
        while(this.rooms.length > 0){
            this.roomScreen.remove(this.rooms[0]);
            this.rooms[0].destroy();
            this.rooms.splice(0, 1);
        }
        for (var i = 0; i < game.rooms.length; i++)
        {
            var room = this.add.text(130, 180 + i * 38, game.rooms[i],  { font: "32px Aharoni", fill: '#EEE' });
            var bounds = new Phaser.Rectangle(130, 180 + i * 32, 500, 32);
            room.clickableArea = bounds;
            this.rooms.push(room);
            this.roomScreen.add(room);
        }
    },

    generateHexColor: function() {
        return '#' + ((0.5 + 0.5 * Math.random()) * 0xFFFFFF << 0).toString(16);
    }

};