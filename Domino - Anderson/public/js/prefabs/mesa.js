/**
 * Created by priscila on 17/11/2015.
 */

function Mesa(){

    this.totalPontos = 0;

    this.numeroPecas = 0;

    this.marcadores = [];

    this.pecas = [];

    this.pecasAtuais = {
        cima:{p:null, x:game.world.centerX, y:game.world.centerY+50, side:null},
        baixo:{p:null, x:game.world.centerX, y:game.world.centerY-50, side:null},
        esquerda:{p:null, x:game.world.centerX-50, y:game.world.centerY, side:null},
        direita:{p:null, x:game.world.centerX+50, y:game.world.centerY, side:null}
    };

}

Mesa.prototype.verficaPontuacao = function(){
    var pontos = 0;
    for(var key in this.pecasAtuais){
        if(this.pecasAtuais[key].side == 1)
            pontos += this.pecasAtuais[key].p.valor1;
        if(this.pecasAtuais[key].side == 2)
            pontos += this.pecasAtuais[key].p.valor2;
    }
    if(pontos % 5 == 0 && pontos != 0) {
        this.totalPontos += pontos;
        alert(this.totalPontos);
    }
};

Mesa.prototype.verificaPossibilidade = function(peca) {

    console.info('verifica possibilidades ', this.pecasAtuais);

    if (this.numeroPecas == 0) {
        if (peca.valor1 == peca.valor2) {
            this.adicionaRetangulo('centro', 50, 50, game.world.centerX, game.world.centerY, '#dddddd');
        }
    } else {
        for (var key in this.pecasAtuais) {
            var x = this.pecasAtuais[key].p.x;
            var y = this.pecasAtuais[key].p.y;
            if(key == 'cima')
                y += 50;
            if(key == 'baixo')
                y -= 50;
            if(key == 'esquerda')
                x -= 50;
            if(key == 'direita')
                x += 50;
            if(!this.pecasAtuais[key].side) {
                if (this.pecasAtuais[key].p.valor1 == peca.valor1 || this.pecasAtuais[key].p.valor2 == peca.valor1)
                    this.adicionaRetangulo(key, 50, 50, x, y, '#dddddd');
                if (this.pecasAtuais[key].p.valor1 == peca.valor2 || this.pecasAtuais[key].p.valor2 == peca.valor2)
                    this.adicionaRetangulo(key, 50, 50, x, y, '#dddddd');
            }
            if(this.pecasAtuais[key].side == 1){
                console.info('pecasAtuais ', this.pecasAtuais[key].p.valor1);
                if (this.pecasAtuais[key].p.valor1 == peca.valor1 || this.pecasAtuais[key].p.valor1 == peca.valor2)
                    this.adicionaRetangulo(key, 50, 50, x, y, '#dddddd');
            }
            if(this.pecasAtuais[key].side == 2){
                if (this.pecasAtuais[key].p.valor2 == peca.valor1 || this.pecasAtuais[key].p.valor2 == peca.valor2)
                    this.adicionaRetangulo(key, 50, 50, x, y, '#dddddd');
            }
        }
    }

};

Mesa.prototype.adicionaPeca = function(peca, posicao, lado){
    var pecaAntiga = this.pecasAtuais[posicao].p;
    this.pecas.push(peca);
    this.pecasAtuais[posicao].p = peca;
    this.pecasAtuais[posicao].side = lado;
    if(this.numeroPecas == 0){
        this.pecasAtuais[posicao].p.x = game.world.centerX;
        this.pecasAtuais[posicao].p.y = game.world.centerY;
    }else{
        if(posicao == 'cima'){
            if(this.pecasAtuais[posicao].side == 1)
                this.pecasAtuais[posicao].p.angle = 270;
            if(this.pecasAtuais[posicao].side == 2)
                this.pecasAtuais[posicao].p.angle = 90;
            this.pecasAtuais[posicao].p.x = pecaAntiga.x;
            this.pecasAtuais[posicao].p.y = pecaAntiga.y+70;
        }
        if(posicao == 'baixo'){
            if(this.pecasAtuais[posicao].side == 1)
                this.pecasAtuais[posicao].p.angle = 90;
            if(this.pecasAtuais[posicao].side == 2)
                this.pecasAtuais[posicao].p.angle = 270;
            this.pecasAtuais[posicao].p.x = pecaAntiga.x;
            this.pecasAtuais[posicao].p.y = pecaAntiga.y-70;
        }
        if(posicao == 'esquerda'){
            if(this.pecasAtuais[posicao].side == 1)
                this.pecasAtuais[posicao].p.angle = 0;
            if(this.pecasAtuais[posicao].side == 2)
                this.pecasAtuais[posicao].p.angle = 180;
            this.pecasAtuais[posicao].p.x = pecaAntiga.x-70;
            this.pecasAtuais[posicao].p.y = pecaAntiga.y;
        }
        if(posicao == 'direita'){
            if(this.pecasAtuais[posicao].side == 1)
                this.pecasAtuais[posicao].p.angle = 180;
            if(this.pecasAtuais[posicao].side == 2)
                this.pecasAtuais[posicao].p.angle = 0;
            this.pecasAtuais[posicao].p.x = pecaAntiga.x+70;
            this.pecasAtuais[posicao].p.y = pecaAntiga.y;
        }
    }
    console.info('adiciona peca ', this.pecasAtuais);
    this.verficaPontuacao();
};

Mesa.prototype.verificaInsercao = function(sprite){
    var a = sprite.bounds;
    for(var i=0; i<this.marcadores.length; i++){
        var b = this.marcadores[i].bounds;
        if(Phaser.Rectangle.intersects(a, b)){
            sprite.input.draggable = false;
            if(this.marcadores[i].posicaoMesa == 'centro'){
                this.adicionaPeca(sprite, 'cima', 1);
                this.adicionaPeca(sprite, 'baixo', 1);
                this.adicionaPeca(sprite, 'esquerda', 1);
                this.adicionaPeca(sprite, 'direita', 1);
            }else{
                var lado = 2;
                if(this.pecasAtuais[this.marcadores[i].posicaoMesa].side == 1){
                    if(this.pecasAtuais[this.marcadores[i].posicaoMesa].p.valor1 == sprite.valor2)
                        lado = 1;
                }
                if(this.pecasAtuais[this.marcadores[i].posicaoMesa].side == 2){
                    if(this.pecasAtuais[this.marcadores[i].posicaoMesa].p.valor2 == sprite.valor2)
                        lado = 1;
                }
                this.adicionaPeca(sprite, this.marcadores[i].posicaoMesa, lado);
            }
            this.numeroPecas++;
        }
    }
    this.removeMarcadores();
};

Mesa.prototype.adicionaRetangulo = function(pos, w, h, posX, posY, color){
    var drawnObject;
    var bmd = game.add.bitmapData(w, h);
    bmd.context.beginPath();
    bmd.context.rect(0, 0, w, h);
    bmd.context.fillStyle = color;
    bmd.context.fill();
    drawnObject = game.add.sprite(posX, posY, bmd);
    drawnObject.anchor.setTo(0.5, 0.5);
    drawnObject.posicaoMesa = pos;
    this.marcadores.push(drawnObject);
};

Mesa.prototype.adicionaPecaMesa = function(sprite, pos, side){
    this.pecas.push(sprite);
    if(this.numeroPecas == 0){
        this.pecasAtuais['cima'].p = sprite;
        this.pecasAtuais['baixo'].p = sprite;
        this.pecasAtuais['esquerda'].p = sprite;
        this.pecasAtuais['direita'].p = sprite;
        this.pecasAtuais['cima'].side = 1;
        this.pecasAtuais['baixo'].side = 1;
        this.pecasAtuais['esquerda'].side = 1;
        this.pecasAtuais['direita'].side = 1;
    }else{
        this.pecasAtuais[pos].p = sprite;
        this.pecasAtuais[pos].side = side;
    }
    this.numeroPecas++;
};

Mesa.prototype.verificaPecaMesa = function(sprite){
    for(var key in this.pecasAtuais){
        if(this.pecasAtuais[key].p){
            if(this.pecasAtuais[key].p.id == sprite.id)
                return {pos: key, side: this.pecasAtuais[key].side};
        }
    }
    return false;
};

Mesa.prototype.removeMarcadores = function(){
    for(var i=0; i<this.marcadores.length; i++){
        this.marcadores[i].destroy();
    }
    this.marcadores = [];
};