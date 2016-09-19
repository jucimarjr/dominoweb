/**
 * Created by priscila on 17/11/2015.
 */

var MainState = function(game){

};

MainState.prototype = {

    preload: function(){
        this.load.image('background', 'img/domino_main.jpg');
        this.load.atlasJSONHash('btn_jogar', 'img/spritesheets/btn_jogar.png', 'img/spritesheets/btn_jogar.json');
        this.load.atlasJSONHash('btn_sobre', 'img/spritesheets/btn_sobre.png', 'img/spritesheets/btn_sobre.json');
    },

    create: function(){
        var logo = this.add.sprite(this.world.centerX, this.world.centerY, 'background');
        logo.anchor.setTo(0.5, 0.5);
        logo.scale.setTo(2.5, 2.5);
        var btn_start = this.add.button(this.world.centerX - 315, 600, 'btn_jogar', this.goToLobby, this, 1, 0, 2);
        var btn_about = this.add.button(this.world.centerX + 95, 600, 'btn_sobre', this.about, this, 1, 0, 2);
    },

    goToLobby: function(){
        var person = prompt("Insira o seu nome", "");
        if (person != null && person != '') {
            game.playerName = person;
            inicia_socket();
            game.state.start('Lobby');
        }
    },

    about: function(){
        alert('about');
    }

};