/**
 * Created by priscila on 17/11/2015.
 */

var pecas = {};
var mesa = new Mesa();

var GameState = function(game){

};

GameState.prototype = {

    preload: function(){

        this.load.image('table', 'img/table.png');

        this.load.image('0-0', 'img/domino/0-0.png');
        this.load.image('0-1', 'img/domino/0-1.png');
        this.load.image('0-2', 'img/domino/0-2.png');
        this.load.image('0-3', 'img/domino/0-3.png');
        this.load.image('0-4', 'img/domino/0-4.png');
        this.load.image('0-5', 'img/domino/0-5.png');
        this.load.image('0-6', 'img/domino/0-6.png');

        this.load.image('1-1', 'img/domino/1-1.png');
        this.load.image('1-2', 'img/domino/1-2.png');
        this.load.image('1-3', 'img/domino/1-3.png');
        this.load.image('1-4', 'img/domino/1-4.png');
        this.load.image('1-5', 'img/domino/1-5.png');
        this.load.image('1-6', 'img/domino/1-6.png');

        this.load.image('2-2', 'img/domino/2-2.png');
        this.load.image('2-3', 'img/domino/2-3.png');
        this.load.image('2-4', 'img/domino/2-4.png');
        this.load.image('2-5', 'img/domino/2-5.png');
        this.load.image('2-6', 'img/domino/2-6.png');

        this.load.image('3-3', 'img/domino/3-3.png');
        this.load.image('3-4', 'img/domino/3-4.png');
        this.load.image('3-5', 'img/domino/3-5.png');
        this.load.image('3-6', 'img/domino/3-6.png');

        this.load.image('4-4', 'img/domino/4-4.png');
        this.load.image('4-5', 'img/domino/4-5.png');
        this.load.image('4-6', 'img/domino/4-6.png');

        this.load.image('5-5', 'img/domino/5-5.png');
        this.load.image('5-6', 'img/domino/5-6.png');

        this.load.image('6-6', 'img/domino/6-6.png');

    },

    create: function(){

        var table = this.add.sprite(this.world.centerX, this.world.centerY, 'table');
        table.anchor.setTo(0.5, 0.5);
        table.scale.setTo(2, 1.6);

        document.getElementById('chat').style.display = 'block';
        game.input.keyboard.onDownCallback = this.keyPress;
        game.socket.emit('obterJogadores', {nomeSala:game.roomName});
        game.stage.backgroundColor = "#006633";

        game.socket.emit('obterPecas', {nomeSala:game.roomName, nomeJogador:game.playerName});

        game.socket.on('atualizarPosicoes', function(dados){
            for(var id in dados){
                if(!pecas.hasOwnProperty(id)) {
                    var valores = id.split('-');
                    var novaPeca = new peca(valores[0], valores[1]);
                    novaPeca.createSprite(dados[id].x, dados[id].y, dados[id].angulo, false);
                    pecas[novaPeca.getValorPeca()] = novaPeca;
                }
            }
        });

        game.socket.on('novaPosicao', function(dados){
            console.info('novaPosicao ', dados);
            pecas[dados.id].atualizaPosicao( dados.posX, dados.posY, dados.angulo );
            if(game.playerName != dados.nomeJogador)
                mesa.adicionaPecaMesa(dados.p, dados.posicao, dados.side);
        });

        game.socket.on('pecasSorteio', function(dados){
            console.info('pecas ', dados);

            var enviarPos = function(sprite){
                var dados = mesa.verificaPecaMesa(sprite);
                var p = {
                    valor1: sprite.valor1,
                    valor2: sprite.valor2,
                    x: sprite.x,
                    y: sprite.y
                };
                if(dados) {
                    game.socket.emit('novaPosicao', {
                        id: sprite.id, posX: sprite.x, posY: sprite.y, angulo: sprite.angle, nomeSala: game.roomName,
                        posicao: dados.pos, side: dados.side, p: p, nomeJogador:game.playerName
                    });
                }
            };

            var novasPecas = [];
            var angle = 0;
            var initial_x = 0;
            var initial_y = 0;
            var incremento_x = 0;
            var incremento_y = 0;
            if(dados.numero == 4){
                initial_x = 50;
                initial_y = 350;
                incremento_x = 0;
                incremento_y = 50;
                angle = 0;
            }
            if(dados.numero == 3){
                initial_x = 700;
                initial_y = 755;
                incremento_x = 50;
                incremento_y = 0;
                angle = 90;
            }
            if(dados.numero == 2){
                initial_x = 1150;
                initial_y = 150;
                incremento_x = 0;
                incremento_y = 50;
                angle = 0;
            }
            if(dados.numero == 1){
                initial_x = 190;
                initial_y = 45;
                incremento_x = 50;
                incremento_y = 0;
                angle = 90;
            }
            var x = initial_x;
            var y = initial_y;
            for(var i=0; i<dados.pecas.length; i++){
                var novaPeca = new peca(dados.pecas[i][0], dados.pecas[i][1]);
                novaPeca.createSprite(x, y, angle, true);
                novaPeca.addEvent('onDragStop', enviarPos);
                pecas[novaPeca.getValorPeca()] = novaPeca;
                novasPecas.push({id:novaPeca.getValorPeca(), x:novaPeca.peca.x, y:novaPeca.peca.y, angulo:novaPeca.peca.angle});
                x += incremento_x;
                y += incremento_y;
            }
            game.socket.emit('adicionaPecas', {nomeSala:game.roomName, pecas:novasPecas});
        });

        game.socket.on('adicionaPecasOk', function(){
            game.socket.emit('obterPosicoes', {nomeSala:game.roomName, nomeJogador:game.playerName});
        });

    },

    keyPress: function(e){
        if(e.keyCode == 18)
            enviar_mensagem();
    }

};