
window.addEventListener('DOMContentLoaded', game);

const constants = {
    src: {
        earth: "https://marclopezavila.github.io/planet-defense-game/img/sprite.png",
        explosion: "https://marclopezavila.github.io/planet-defense-game/img/explosion.png"
    }
}

function game() {
    
    const player = new Player();

    const canvas = document.getElementsByTagName('canvas')[0];
    const context = canvas.getContext('2d');

    const sprite = new Image();
    sprite.src = constants.src.earth;

    const spriteExplosion = new Image();
    spriteExplosion.src = constants.src.explosion;

    let asteroids = [];
    let bullets = [];
    let explosions = [];

    let height = (context.canvas.height = window.innerHeight);
    let width = (context.canvas.width  = window.innerWidth);
    let planet_deg= 0;
    let gameOver = false;
    let playing = false;
    let destroyed = 0;
    let record = 0;
    let count = 0;

    canvas.addEventListener('click', action);
    canvas.addEventListener('mousemove', action);
    window.addEventListener("resize", update);

    init();

    function init() {
        window.requestAnimationFrame(init);

        if (!gameOver) {
            // Clear canvas
            context.clearRect(0, 0, width, height);
            context.beginPath();

            // Init player
            initPlanet();
            initPlayer();
            
            // Init opposition
            if (playing) {
                initAsteroids();

                context.font = "20px Verdana";
                context.fillStyle = "white";
                context.textBaseline = 'middle';
                context.textAlign = "left";
                context.fillText('Record: ' + record + '', 20, 30);

                context.font = "40px Verdana";
                context.fillStyle = "white";
                context.strokeStyle = "black";
                context.textAlign = "center";
                context.textBaseline = 'middle';
                context.strokeText('' + destroyed + '', width * .5, height * .5);
                context.fillText('' + destroyed + '', width * .5, height * .5);

            } else {
                context.drawImage(sprite, 428, 12, 70, 70, width * .5 - 35, height * .5 - 35, 70,70);
            }
        
        } else if (count < 1) {
            count = 1;
            context.fillStyle = 'rgba(0,0,0,0.75)';
            context.rect(0,0, width, height);
            context.fill();

            context.font = "60px Verdana";
            context.fillStyle = "white";
            context.textAlign = "center";
            context.fillText("GAME OVER",width * .5,height * .5 - 150);

            context.font = "20px Verdana";
            context.fillStyle = "white";
            context.textAlign = "center";
            context.fillText("Total destroyed: "+ destroyed, width * .5,height * .5 + 140);

            record = destroyed > record ? destroyed : record;

            context.font = "20px Verdana";
            context.fillStyle = "white";
            context.textAlign = "center";
            context.fillText("RECORD: "+ record, width * .5,height * .5 + 185);

            context.drawImage(sprite, 500, 18, 70, 70, width * .5 - 35, height * .5 + 40, 70,70);

            canvas.removeAttribute('class');
        }
    }
    
    function initAsteroids() {
        let distance;

        for (let i = 0; i < asteroids.length; i++) {
            if (!asteroids[i].destroyed) {
                context.save();
                context.translate(asteroids[i].coordsX, asteroids[i].coordsY);
                context.rotate(asteroids[i].deg);

                context.drawImage(
                    sprite,
                    asteroids[i].x,
                    asteroids[i].y,
                    asteroids[i].width,
                    asteroids[i].height,
                    -(asteroids[i].width / asteroids[i].size) / 2,
                    asteroids[i].moveY += 1/(asteroids[i].size),
                    asteroids[i].width / asteroids[i].size,
                    asteroids[i].height / asteroids[i].size
                );

                context.restore();

                // Real Coords
                asteroids[i].realX = (0) - (asteroids[i].moveY + ((asteroids[i].height / asteroids[i].size)/2)) * Math.sin(asteroids[i].deg);
                asteroids[i].realY = (0) + (asteroids[i].moveY + ((asteroids[i].height / asteroids[i].size)/2)) * Math.cos(asteroids[i].deg);

                asteroids[i].realX += asteroids[i].coordsX;
                asteroids[i].realY += asteroids[i].coordsY;

                // Game Over
                distance = Math.sqrt(Math.pow(asteroids[i].realX -  (width * .5), 2) + Math.pow(asteroids[i].realY - (height * .5), 2));
                if (distance < (((asteroids[i].width/asteroids[i].size) / 2) - 4) + 100) {
                    gameOver = true;
                    playing  = false;
                    canvas.addEventListener('mousemove', action);
                }
            } else if (!asteroids[i].extinct) {
                explode(asteroids[i]);
            }
        }

        if (asteroids.length - destroyed < 10 + (Math.floor(destroyed / 6))) {
            asteroids.push(new Asteroid(width, height));
        }
    }

    function initPlanet() {
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

    function initPlayer() {
        context.save();
        context.translate(width * .5, height * .5);

        context.rotate(player.deg);
        context.drawImage(
            sprite,
            200,
            0,
            player.width,
            player.height,
            player.posX,
            player.posY,
            player.width,
            player.height
        );

        context.restore();

        if (bullets.length - destroyed && playing) fire();
    }

    function action(e) {
        e.preventDefault();

        if (playing) {
            bullets.push(new Bullet(e, height, width));

        } else {
            const w = width * .5, h = height * .5;
            const x = e.offsetX, y = e.offsetY;
            let distance;

            if (gameOver) {
                distance = Math.sqrt(((x - w) * (x - w)) + ((y - (h + 45 + 22)) * (y - (h + 45 + 22))));

                if (distance < 27) {
                    if (e.type === 'click') {
                        gameOver   = false;
                        count      = 0;
                        bullets    = [];
                        asteroids  = [];
                        explosions = [];
                        destroyed  = 0;
                        player.deg = 0;
                        canvas.removeEventListener('contextmenu', action);
                        canvas.removeEventListener('mousemove', move);
                        canvas.style.cursor = "default";
                    } else {
                        canvas.style.cursor = "pointer";
                    }
                } else {
                    canvas.style.cursor = "default";
                }
            } else {
                distance = Math.sqrt(((x - w) * (x - w)) + ((y - h) * (y - h)));

                if (distance < 27) {
                    if (e.type === 'click') {
                        playing = true;
                        canvas.removeEventListener("mousemove", action);
                        canvas.addEventListener('contextmenu', action);
                        canvas.addEventListener('mousemove', move);
                        canvas.setAttribute("class", "playing");
                        canvas.style.cursor = "default";
                    } else {
                        canvas.style.cursor = "pointer";
                    }
                } else {
                    canvas.style.cursor = "default";
                }
            }
        }
    }

    function explode(asteroid) {
        context.save();
        context.translate(asteroid.realX, asteroid.realY);
        context.rotate(asteroid.deg);

        let spriteY;
        let spriteX = 256;
        if (asteroid.state === 0) {
            spriteY = 0;
            spriteX = 0;
        } else if (asteroid.state < 8) {
            spriteY = 0;
        } else if (asteroid.state < 16) {
            spriteY = 256;
        } else if (asteroid.state < 24) {
            spriteY = 512;
        } else {
            spriteY = 768;
        }

        if (asteroid.state === 8 || asteroid.state === 16 || asteroid.state === 24) {
            asteroid.stateX = 0;
        }

        context.drawImage(
            spriteExplosion,
            asteroid.stateX += spriteX,
            spriteY,
            256,
            256,
            -(asteroid.width / asteroid.size) * .5,
            -(asteroid.height / asteroid.size) * .5,
            asteroid.width / asteroid.size,
            asteroid.height / asteroid.size
        );
        asteroid.state += 1;

        if (asteroid.state === 31) {
            asteroid.extinct = true;
        }

        context.restore();
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
                for (var j = 0; j < asteroids.length; j++) {
                    if (!asteroids[j].destroyed) {
                        distance = Math.sqrt(Math.pow(asteroids[j].realX - bullets[i].realX, 2) + Math.pow(asteroids[j].realY - bullets[i].realY, 2));

                        if (distance < (((asteroids[j].width / asteroids[j].size) / 2) - 4) + ((19 / 2) - 4)) {
                            destroyed += 1;
                            asteroids[j].destroyed = true;
                            bullets[i].destroyed   = true;
                            explosions.push(asteroids[j]);
                        }
                    }
                }
            }
        }
    }

    function move(e) {
        player.deg = Math.atan2(e.offsetX - (width * .5), -(e.offsetY - (height * .5)));
    }

    function update() {
        height = context.canvas.height = window.innerHeight;
        width = context.canvas.width  = window.innerWidth;
    }

}

// Model
class Asteroid {

    coordsX = 0;
    coordsY = 0;
    realX = 0;
    realY = 0;
    deg = 0;
    x = 278;
    y = 0;
    state = 0;
    stateX = 0;
    width = 134;
    height = 123;
    moveY = 0;
    size = random(1, 3);
    destroyed = false;

    constructor(width, height) {
        const type = random(1,4);

        switch(type){
            case 1:
                this.coordsX = random(0, width);
                this.coordsY = 0 - 150;
                break;
            case 2:
                this.coordsX = width + 150;
                this.coordsY = random(0, height);
                break;
            case 3:
                this.coordsX = random(0, width);
                this.coordsY = height + 150;
                break;
            case 4:
                this.coordsX = 0 - 150;
                this.coordsY = random(0, height);
                break;
        }

        this.realX = this.coordsX;
        this.realY = this.coordsY;
        this.deg = Math.atan2(this.coordsX  - (width * .5), -(this.coordsY - (height * .5)));
    }
}

class Bullet {
    event = {};
    height = 0;
    width = 0;
    realX = 0;
    realY = 0;
    deg = 0;

    x = -8;
    y = -179;
    destroyed= false;

    constructor(event, height, width) {
        this.event = event;
        this.height = height;
        this.width = width;

        this.realX = event.offsetX;
        this.realY = event.offsetY;
        this.deg = Math.atan2(event.offsetX - (width * .5), -(event.offsetY - (height * .5)));
    }
}

class Player {
    posX  = -35;
    posY  = -182;
    width = 70;
    height= 79;
    deg   = 0;
}

// Utils
function random(from, to) {
    return Math.floor(Math.random() * (to - from + 1)) + from;
}
