
window.addEventListener('DOMContentLoaded', game);

const server = 'https://planetary-defence-scores.onrender.com';

const constants = {
    api: {
        adjective: "https://random-word-form.herokuapp.com/random/adjective",
        noun: "https://random-word-form.herokuapp.com/random/noun",
        scores: `${server}/scores`
    },
    colour: {
        blue: "#48dee5",
        brown: "#818071",
        green: "#acf762",
        orange: "#f4c316",
        yellow: "#fdfcc2",
        white: "#fff"
    },
    src: {
        asteroid: [
            `${server}/res/asteroid-0.png`,
            `${server}/res/asteroid-1.png`,
            `${server}/res/asteroid-2.png`,
            `${server}/res/asteroid-3.png`
        ],
        cannon: `${server}/res/cannon.png`,
        earth: [
            `${server}/res/earth-0.png`,
            `${server}/res/earth-1.png`,
            `${server}/res/earth-2.png`,
            `${server}/res/earth-3.png`
        ],
        explosion: "https://marclopezavila.github.io/planet-defense-game/img/explosion.png",
        sprite: "https://marclopezavila.github.io/planet-defense-game/img/sprite.png",
        projectile: `${server}/res/projectile.png`,
    }
}

function game() {
    const player = new Player();

    const canvas = document.getElementsByTagName('canvas')[0];
    const context = canvas.getContext('2d');

    const sprite = new Image();
    sprite.src = constants.src.sprite;

    const earth = new Image();

    const spriteExplosion = new Image();
    spriteExplosion.src = constants.src.explosion;

    let asteroids = [];
    let bullets = [];
    let explosions = []; // Remove?

    let height = (context.canvas.height = window.innerHeight);
    let width = (context.canvas.width  = window.innerWidth);
    let planet_deg= 0;
    let gameOver = false;
    let playing = false;
    let firstLoad = true;
    let score = 0;
    let count = 0;
    let shots = 0;

    canvas.addEventListener('click', action);
    canvas.addEventListener('mousemove', action);
    window.addEventListener("resize", update);

    init();

    async function init() {
        window.requestAnimationFrame(init);

        if (firstLoad) {
            firstLoad = false;
            player.name = await generateName();

        } else if (!gameOver) {
            context.clearRect(0, 0, width, height);
            context.beginPath();

            if (playing) {
                context.shadowColor="";
                context.shadowBlur = 0;

                initAsteroids();
                initPlanet();
                initPlayer();

                context.fillStyle = constants.colour.blue;
                context.textBaseline = 'middle';
                context.textAlign = "left";

                // Score
                context.font = "48px Verdana";
                context.fillText(score, 30, 50);
                context.font = "10px Verdana";
                context.fillText('HITS', 30, 80);

                // Accuracy
                const accuracy = (score === 0 ? 0 : Math.round((100 * score) / shots))
                context.font = "48px Verdana";
                context.fillText(accuracy, 30, 140);
                context.font = "10px Verdana";
                context.fillText('ACCURACY %', 30, 170);

                // Points
                const points = score === 0 ? 0 : Math.round(10 * score * (score / shots));
                context.font = "48px Verdana";
                context.fillText(points, 30, 230);
                context.font = "10px Verdana";
                context.fillText('POINTS', 30, 260);


            } else {
                context.font = "24px Verdana";
                context.fillStyle = constants.colour.green;
                context.textAlign = "center";
                context.letterSpacing = "3px";
                context.shadowColor = constants.colour.green;
                context.shadowBlur = 3;
                context.fillText('START', width * .5, height * .5);

            }

        } else if (count < 1) {
            // Game Over
            count = 1;
            context.clearRect(0, 0, width, height);
            context.beginPath();

            context.font = "60px Verdana";
            context.fillStyle = constants.colour.green;
            context.textAlign = "center";
            context.shadowColor = constants.colour.green;
            context.shadowBlur = 6;
            context.fillText('HIGH SCORES',width * .5,height * .125);

            await submit(score, player.name);

            const scores = await topScores();

            for (let i = 0; i < 3; i++) {
                const position = i + 1;
                const record = scores[i];
                const date = new Date(record.timestamp).toLocaleDateString('en-UK');

                context.font = "24px Verdana";
                context.fillText(record.score,width * .5,height * .225 + (i * 85));

                context.font = "16px Verdana";
                context.fillText(position + '. ' + record.name + ' (' + date + ')',width * .5,height * .225 + 30 + (i * 85));
            }

            context.shadowColor = constants.colour.white;
            context.drawImage(sprite, 500, 18, 70, 70, width * .5 - 35, height * .575, 70,70);

            canvas.removeAttribute('class');

            context.font = "96px Verdana";
            context.fillStyle = constants.colour.blue;
            context.shadowColor = constants.colour.blue;
            context.shadowBlur = 6;
            context.textAlign = "center";
            context.fillText(score, width * .5,height * .85 - 55);

            context.font = "24px Verdana";
            context.fillText(player.name, width * .5,height * .85);

        }
    }
    
    function initAsteroids() {
        let distance;

        for (const asteroid of asteroids) {
            if (!asteroid.destroyed) {
                context.save();
                context.translate(asteroid.coordsX, asteroid.coordsY);
                context.rotate(asteroid.deg);

                context.drawImage(
                    asteroid.image,
                    -(asteroid.width / asteroid.size) / 2,
                    asteroid.moveY += 1/(asteroid.size),
                    asteroid.width / asteroid.size,
                    asteroid.height / asteroid.size
                );

                context.restore();

                // Real Coords
                asteroid.realX = (0) - (asteroid.moveY + ((asteroid.height / asteroid.size)/2)) * Math.sin(asteroid.deg);
                asteroid.realY = (0) + (asteroid.moveY + ((asteroid.height / asteroid.size)/2)) * Math.cos(asteroid.deg);

                asteroid.realX += asteroid.coordsX;
                asteroid.realY += asteroid.coordsY;

                // Game Over
                distance = Math.sqrt(Math.pow(asteroid.realX -  (width * .5), 2) + Math.pow(asteroid.realY - (height * .5), 2));
                if (distance < (((asteroid.width/asteroid.size) / 2) - 4) + 100) {
                    gameOver = true;
                    playing  = false;
                    canvas.addEventListener('mousemove', action);
                }
            } else if (!asteroid.extinct) {
                explode(asteroid);
            }
        }

        if (asteroids.length - score < 10 + (Math.floor(score / 6))) {
            asteroids.push(new Asteroid(width, height));
        }
    }

    function initPlanet() {
        context.save();
        context.translate(width * .5, height * .5);
        context.shadowBlur    = 10;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowColor   = constants.colour.blue;

        if (score >= 300) {
            earth.src = constants.src.earth[3];
        } else if (score >= 150) {
            earth.src = constants.src.earth[2];
        } else if (score >= 50) {
            earth.src = constants.src.earth[1];
        } else {
            earth.src = constants.src.earth[0];
        }

        context.drawImage(earth, -100, -100, 200, 200);
        context.restore();
    }

    function initPlayer() {
        context.save();
        context.translate(width * .5, height * .5);
        context.rotate(player.deg);
        context.drawImage(
            player.image,
            player.posX,
            player.posY,
            player.width,
            player.height,
        )
        context.restore();

        if (bullets.length - score && playing)
            fire();
    }

    function action(e) {
        e.preventDefault();

        if (playing) {
            shots++;
            bullets.push(new Bullet(e, height, width));

        } else {
            const x = e.offsetX, y = e.offsetY;

            if (gameOver) {
                const w = width * .5, h = height * .575;
                const distance = Math.sqrt(((x - w) * (x - w)) + ((y - h) * (y - h)));

                if (distance < 27) {
                    if (e.type === 'click') {
                        gameOver   = false;
                        count      = 0;
                        bullets    = [];
                        asteroids  = [];
                        explosions = [];
                        score  = 0;
                        player.deg = 0;
                        canvas.removeEventListener('contextmenu', action);
                        canvas.removeEventListener('mousemove', move);
                        canvas.style.cursor = "default";

                        // playing    = true; // Note :: beam...

                    } else {
                        canvas.style.cursor = "pointer";
                    }
                } else {
                    canvas.style.cursor = "default";
                }
            } else {
                const w = width * .5, h = height * .5;
                const distance = Math.sqrt(((x - w) * (x - w)) + ((y - h) * (y - h)));

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
                    bullets[i].image,
                    bullets[i].x,
                    bullets[i].y -= 10,
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
                            score += 1;
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

    async function submit(score, name) {
        fetch(`${constants.api.scores}/new`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: name,
                score: score,
                timestamp: Date.now()
            })
        }).then(res => {
            console.log(res);
        }).catch(err => {
            console.error(`Error submitting score [${err}]`);
        });
    }

    async function topScores() {
        return fetch(constants.api.scores)
            .then(res => {
                console.log('Top scores successfully retrieved!');
                return res.json();
            }).catch(err => {
                console.error(`Error submitting score [${err}]`);
                return [];
            });
    }

    function update() {
        height = context.canvas.height = window.innerHeight;
        width = context.canvas.width  = window.innerWidth;
    }

}

/** Model */
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
    type = 0;
    image = new Image();
    size = random(2, 4);
    destroyed = false;
    rot = 0;

    constructor(width, height) {
        const type = random(0,3);
        this.image.src = constants.src.asteroid[type];

        switch(type){
            case 0:
                this.coordsX = random(0, width);
                this.coordsY = 0 - 150;
                break;
            case 1:
                this.coordsX = width + 150;
                this.coordsY = random(0, height);
                break;
            case 2:
                this.coordsX = random(0, width);
                this.coordsY = height + 150;
                break;
            case 3:
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
    image = new Image();
    event = {};
    height = 20;
    width = 20;
    realX = 0;
    realY = 0;
    deg = 0;

    x = -8;
    y = -178;
    destroyed= false;

    constructor(event, height, width) {
        this.event = event;
        this.height = height;
        this.width = width;

        this.realX = event.offsetX;
        this.realY = event.offsetY;
        this.deg = Math.atan2(event.offsetX - (width * .5), -(event.offsetY - (height * .5)));
        this.image.src = constants.src.projectile;
    }
}

class Player {
    image = new Image();
    posX  = -25;
    posY  = -130;
    width = 50;
    height= 25;
    deg   = 0;
    name = "Unknown"

    constructor(name) {
        this.name = name;
        this.image.src = constants.src.cannon;
    }
}

/** Utils */
function capitalise(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

async function generateName() {
    const noun = await fetch(constants.api.adjective).then(
        res => res.json().then(data => {
            return capitalise(data[0]);
        })
    );

    const adjective = await fetch(constants.api.noun).then(
        res => res.json().then(data => {
            return capitalise(data[0]);
        })
    );

    return noun + adjective;
}

function random(from, to) {
    return Math.floor(Math.random() * (to - from + 1)) + from;
}
