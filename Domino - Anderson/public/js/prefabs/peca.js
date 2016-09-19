/**
 * Created by priscila on 17/11/2015.
 */

var peca = function(valor1, valor2){

    this.peca = null;
    this.valor1 = valor1;
    this.valor2 = valor2;
    this.valor_peca = valor1 + '-' + valor2;
    if(valor1 == valor2)
        this.carroca = true;
    else
        this.carroca = false;

};

peca.prototype = {

    createSprite: function(posX, posY, angle, drag){
        this.peca = game.add.sprite(posX, posY, this.valor_peca);
        this.peca.angle = angle;
        this.peca.anchor.setTo(0.5, 0.5);
        this.peca.inputEnabled = drag;
        this.peca.input.enableDrag(drag);
        this.peca.id = this.valor_peca;
        this.peca.valor1 = this.valor1;
        this.peca.valor2 = this.valor2;
        if(drag) {
            this.addEvent('onDragStart', this.verificarPossibilidades);
            this.addEvent('onDragStop', this.verificaInsercao);
        }
    },

    addEvent: function(event, fnc){
        this.peca.events[event].add(fnc);
    },

    getValorPeca: function(){
        return this.valor_peca;
    },

    atualizaPosicao: function(posX, posY, angulo){
        this.peca.x = posX;
        this.peca.y = posY;
        this.peca.angle = angulo;
    },

    verificarPossibilidades: function(sprite){
        mesa.verificaPossibilidade(sprite);
    },

    verificaInsercao: function(sprite){
        mesa.verificaInsercao(sprite);
    }

};