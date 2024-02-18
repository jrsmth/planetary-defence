
window.addEventListener('DOMContentLoaded', game);

const constants = {
    src: {
        earth: "https://marclopezavila.github.io/planet-defense-game/img/sprite.png"
    }
}

function game() {

    const _player = {
        posX   : -35,
        posY   : -(100 + 82),
        width  : 70,
        height : 79,
        deg    : 0
    };

    const canvas = document.getElementsByTagName('canvas')[0];
    const context = canvas.getContext('2d');

    const sprite = new Image();
    sprite.src = constants.src.earth;

    let bullets = [];

    let height = (context.canvas.height = window.innerHeight);
    let width = (context.canvas.width  = window.innerWidth);
    let planet_deg= 0;
    let gameOver = false;
    let playing = false;

    init();

    function init() {
        window.requestAnimationFrame(init);

        if (!gameOver) {
            // Clear canvas
            context.clearRect(0, 0, width, height);
            context.beginPath();

            // Init objects
            planet();
            player();

        }

    }

    function planet() {
        context.save();
        context.shadowBlur    = 100;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowColor   = "#999";
        context.fillStyle     = '#fff';

        context.arc(width * .5, height * .5, 100, 0, Math.PI * 2);
        context.fill();

        context.translate(width * .5, height * .5);
        context.rotate((planet_deg += 0.1) * (Math.PI / 180));

        context.drawImage(sprite, 0, 0, 200, 200, -100, -100, 200,200);
        context.restore();
    }

    function player() {
        context.save();
        context.translate(width * .5, height * .5);

        context.rotate(_player.deg);
        context.drawImage(
            sprite,
            200,
            0,
            _player.width,
            _player.height,
            _player.posX,
            _player.posY,
            _player.width,
            _player.height
        );

        context.restore();

        if (bullets.length - destroyed && playing) fire();
    }

    function fire() {
        let distance;

        for (let i = 0; i < bullets.length; i++) {
            if (!bullets[i].destroyed) {
                context.save();
                context.translate(width * .5, height * .5);
                context.rotate(bullets[i].deg);

                context.drawImage(
                    sprite,
                    211,
                    100,
                    50,
                    75,
                    bullets[i].x,
                    bullets[i].y -= 20,
                    19,
                    30
                );

                context.restore();

                bullets[i].realX = (0) - (bullets[i].y + 10) * Math.sin(bullets[i].deg);
                bullets[i].realY = (0) + (bullets[i].y + 10) * Math.cos(bullets[i].deg);

                bullets[i].realX += width * .5;
                bullets[i].realY += height * .5;

                // Collision
                // for (var j = 0; j < asteroids.length; j++) {
                //     if(!asteroids[j].destroyed) {
                //         distance = Math.sqrt(Math.pow(
                //                 asteroids[j].realX - bullets[i].realX, 2) +
                //             Math.pow(asteroids[j].realY - bullets[i].realY, 2)
                //         );
                //
                //         if (distance < (((asteroids[j].width/asteroids[j].size) / 2) - 4) + ((19 / 2) - 4)) {
                //             destroyed += 1;
                //             asteroids[j].destroyed = true;
                //             bullets[i].destroyed   = true;
                //             explosions.push(asteroids[j]);
                //         }
                //     }
                // }
            }
        }
    }


}