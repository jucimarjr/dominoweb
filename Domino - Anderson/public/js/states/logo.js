/**
 * Created by priscila on 17/11/2015.
 */

var LogoState = function(game){
    this.game = game;
};

LogoState.prototype = {

    preload: function(){
        this.load.image('uea', 'img/uea.jpg');
    },

    create: function(){
        this.timer = this.game.time.now;
        var logo = this.add.sprite(this.world.centerX, this.world.centerY, 'uea');
        logo.anchor.setTo(0.5, 0.5);
        //logo.scale.setTo(1, 1);
    },

    update: function(){
        if (this.game.time.now - this.timer > 3000)
            this.goToMainScreen();
    },

    goToMainScreen: function(){
        game.state.start('Main');
    }

};