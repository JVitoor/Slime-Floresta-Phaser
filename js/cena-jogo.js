import Jogador from "./jogador.js";

export default class CenaJogo extends Phaser.Scene {
    constructor() {
        super({
            key: 'CenaJogo'
        });
    }

    preload() {

    }

    create() {
        // const larguraJogo = this.sys.canvas.width;
        // const alturaJogo = this.sys.canvas.height;
        // this.add.image(larguraJogo/2, alturaJogo/2, 'forest');
        const imagemFundo = this.add.image(0, 0, 'forest');
        imagemFundo.setOrigin(0, 0);

        const plataformas = this.physics.add.staticGroup();
        plataformas.create(0, 184, 'chao').setOrigin(0, 0).refreshBody();
        plataformas.create(400 - 30, 240 - 56 - 34 - 34, 'platform').setOrigin(0, 0).refreshBody();
        plataformas.create(400 - 60, 240 - 56 - 34, 'platform').setOrigin(0, 0).refreshBody();
        plataformas.create(190, 120, 'platform').setOrigin(0, 0).refreshBody();
        plataformas.create(30, 80, 'platform').setOrigin(0, 0).refreshBody();

        this.jogador = new Jogador(this);
        this.physics.add.collider(this.jogador.sprite, plataformas);
        const jogador = this.jogador.sprite;

        const estrelas = this.physics.add.group();
        estrelas.createFromConfig({
            key: "estrela",
            repeat: 4,
            setXY: { x: 60, y: 0, stepX: 80 },
            setScale: { x: 1, y: 1 },
          });
      
          estrelas.children.iterate((estrela) => {
            estrela.setBounceY(Phaser.Math.FloatBetween(0.2, 0.6));
          });
      
          this.physics.add.collider(estrelas, plataformas);
          this.physics.add.overlap(this.jogador.sprite, estrelas, coletaEstrela, null, this);

        let pontos = 0;
        let textoPontos;
            textoPontos = this.add.text(10, 200, "Pontuação: 0", { fontSize: '32px', fill: '#000' });

        function coletaEstrela (jogador, estrela){
            estrela.disableBody(true, true);

            pontos += 10;
            textoPontos.setText(`Pontuação: ` + pontos);

            if (estrelas.countActive(true) === 0){
                estrelas.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

                });

                let x = (this.jogador.sprite.x < 200) ? Phaser.Math.Between(200, 400) : Phaser.Math.Between(0, 200);

                let inimigo = inimigos.create(x, 16, 'inimigo');
                inimigo.setBounce(1);
                inimigo.setCollideWorldBounds(true);
                inimigo.setVelocity(Phaser.Math.Between(-200, 200), 20);
            }
        }

        const inimigos = this.physics.add.group();
        let gameOver;

        this.physics.add.collider(inimigos, plataformas);
        this.physics.add.collider(this.jogador.sprite, inimigos, colideInimigo, null, this);

        function colideInimigo(){
            this.physics.pause();

            jogador.setTint(0xff0000);

            jogador.anims.play('turn');

            gameOver = true;
        }

        this.teclas = this.input.keyboard.createCursorKeys();
    }

    update() {
        // cria um atalho pra evitar ficar digitando "this.jogador.sprite"
        const jogador = this.jogador.sprite;

        // setas da esquerda, direita (ou sem movimento)
        if (this.teclas.left.isDown) {
            jogador.setVelocityX(-160);
            jogador.setFlip(true, false)
            jogador.anims.play('esquerda', true);
        }
        else if (this.teclas.right.isDown) {
            jogador.setVelocityX(160);
            jogador.setFlip(false, false)
            jogador.anims.play('direita', true);
        } else {
            // nem esquerda, nem direita - parado ou pulando
            jogador.setVelocityX(0);
            if (jogador.body.touching.down) {
                jogador.anims.play('atoa');
            }
        }

        // seta para cima fazendo pular, mas só se estiver no chão
        if (this.teclas.up.isDown && jogador.body.touching.down) {
            jogador.setVelocityY(-100);
            jogador.anims.play('pulando')
        }
    }
}
