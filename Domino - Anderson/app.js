var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
server.listen(process.env.PORT || 3010);

var salas = {};
var jogadores = {};
var pecas = {};

var lista_pecas = [[0,0], [0,1], [0,2], [0,3], [0,4], [0,5], [0,6],
                   [1,1], [1,2], [1,3], [1,4], [1,5], [1,6],
                   [2,2], [2,3], [2,4], [2,5], [2,6],
                   [3,3], [3,4], [3,5], [3,6],
                   [4,4], [4,5], [4,6],
                   [5,5], [5,6],
                   [6,6]
                  ];

app.set('views', __dirname, + '/views');
app.set('view engine', 'html');
app.set('view options', { layout: false });
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static('public'));
app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
    res.render(__dirname+'/public/index.html');
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

io.sockets.on('connection', function(socket){

    socket.on('buscarSalas', function(data){
        if(jogadores.hasOwnProperty(data.nomeJogador)){
            var dados = [];
            for (var nomeSala in salas) {
                var jogadoresSala = [];
                for (var nomeJogador in salas[nomeSala])
                    jogadoresSala.push(salas[nomeSala]['jogadores'][nomeJogador]);
                dados.push({
                    sala: nomeSala,
                    jogadores: jogadoresSala
                });
            }
            jogadores[data.nomeJogador].emit('salasDisponiveis', dados);
        }else {
            console.log('BUSCAR_SALAS: Jogador não encontrado - ' + data.nomeJogador);
        }
    });

    socket.on('adicionarJogador', function(data){
        socket.nomeJogador = data.nomeJogador;
        jogadores[data.nomeJogador] = socket;
        console.log('ADICIONAR_JOGADOR: Jogador ' + data.nomeJogador + ' entrou');
    });

    socket.on('criarSala', function(data){
        salas[data.nomeSala] = {};
        if( data.hasOwnProperty('dados') )
            salas[data.nomeSala]['dados'] = data.dados;
        salas[data.nomeSala]['jogadores'] = {};
        salas[data.nomeSala]['pecas'] = {};

        //SORTEIO

        var pecas = lista_pecas;
        salas[data.nomeSala]['sorteio'] = [];
        while(pecas.length > 0){
            var pecas_jogador = [];
            for(var i=0; i<7; i++){
                var index = Math.floor(Math.random() * pecas.length);
                while(index < 0) {
                    index = Math.floor(Math.random() * pecas.length);
                }
                pecas_jogador.push(pecas[index]);
                pecas.splice(index, 1);
            }
            salas[data.nomeSala].sorteio.push(pecas_jogador);
        }

        console.log('LISTA PECAS: ', lista_pecas);

        //FIM SORTEIO

        console.log('CRIAR_SALA: sala ' + data.nomeSala + ' criada');
    });

    socket.on('entrarSala', function(data){
        if(salas.hasOwnProperty(data.nomeSala)){
            if(salas[data.nomeSala].sorteio.length > 0) {
                salas[data.nomeSala]['jogadores'][data.dadosJogador.nome] = data.dadosJogador;
                console.log('ENTRAR_SALA: jogador ' + data.dadosJogador.nome + ' entrou na sala ' + data.nomeSala);
            }
        }else{
            socket.emit('erro', {msg: 'Sala não encontrada'});
            console.log('ENTRAR_SALA: Sala não encontrada - ' + data.nomeSala);
        }
    });

    socket.on('mensagemJogador', function(data){
        if(jogadores.hasOwnProperty(data.nomeJogador)){
            jogadores[data.nomeJogador].emit('mensagem', data.msg);
        }else{
            console.log('MENSAGEM_JOGADOR: Jogador não encontrado - ' + data.nomeJogador);
        }
    });

    socket.on('mensagemSala', function(data){
        if(salas.hasOwnProperty(data.nomeSala)){
            for(var nomeJogador in salas[data.nomeSala]['jogadores']){
                jogadores[nomeJogador].emit('mensagemSala', {data: data.msg});
            }
        }else{
            console.log('MENSAGEM_SALA: Sala não encontrada - ' + data.nomeSala);
        }
    });

    socket.on('obterJogadores', function(data){
        if(salas.hasOwnProperty(data.nomeSala)){
            for(var nomeJogador in salas[data.nomeSala]['jogadores']){
                jogadores[nomeJogador].emit('jogadoresSala', {data: salas[data.nomeSala]['jogadores']});
            }
        }else{
            console.log('MENSAGEM_SALA: Sala não encontrada - ' + data.nomeSala);
        }
    });

    socket.on('obterPosicoes', function(data){
        if(salas.hasOwnProperty(data.nomeSala)){
            for(var nomeJogador in salas[data.nomeSala]['jogadores']){
                jogadores[nomeJogador].emit('atualizarPosicoes', salas[data.nomeSala].pecas);
            }
        }else{
            console.log('MENSAGEM_JOGADOR: Jogador não encontrado - ' + data.nomeJogador);
        }
    });

    socket.on('obterPecas', function(data){
        if(salas.hasOwnProperty(data.nomeSala)){
            jogadores[data.nomeJogador].emit('pecasSorteio', {numero:salas[data.nomeSala].sorteio.length, pecas: salas[data.nomeSala].sorteio[0]});
            salas[data.nomeSala].sorteio.splice(0, 1);
        }else{
            console.log('MENSAGEM_JOGADOR: Jogador não encontrado - ' + data.nomeJogador);
        }
    });

    socket.on('adicionaPecas', function(data){
        if(salas.hasOwnProperty(data.nomeSala)){
            for(var i=0; i<data.pecas.length; i++){
                salas[data.nomeSala].pecas[data.pecas[i].id] = {x:data.pecas[i].x, y:data.pecas[i].y, angulo:data.pecas[i].angulo};
            }
            for(var nomeJogador in salas[data.nomeSala]['jogadores']){
                jogadores[nomeJogador].emit('adicionaPecasOk');
            }
        }else{
            console.log('MENSAGEM_JOGADOR: Sala não encontrada - ' + data.nomeSala);
        }
    });

    socket.on('novaPosicao', function(data){
        if(salas.hasOwnProperty(data.nomeSala)){
            for(var nomeJogador in salas[data.nomeSala]['jogadores']){
                salas[data.nomeSala].pecas[data.id] = {x:data.posX, y:data.posY, angulo:data.angulo};
                jogadores[nomeJogador].emit('novaPosicao', {id:data.id, posX:data.posX, posY:data.posY, angulo:data.angulo,
                                                            posicao:data.posicao, side:data.side, p:data.p, nomeJogador:data.nomeJogador});
            }
        }else{
            console.log('MENSAGEM_SALA: Sala não encontrada - ' + data.nomeSala);
        }
    });

    socket.on('disconnect', function(){
        console.log('DISCONNECT: Jogador ' + socket.nomeJogador + ' saiu');
        delete jogadores[socket.nomeJogador];
    });

});