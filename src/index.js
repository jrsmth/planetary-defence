window.addEventListener('DOMContentLoaded', game);

function game() {
    canvas.addEventListener('click', action);
    canvas.addEventListener('mousemove', action);
    window.addEventListener("resize", update);

    init();
}

function action(e) {
    e.preventDefault();

    if (playing) {
        if (shots === -1) shots++

        shots++;
        bullets.push(new Bullet(e, height, width));

    } else {
        const x = e.offsetX, y = e.offsetY;

        if (gameOver) {
            const w = width * .5, h = height * .575;
            const distance = Math.sqrt(((x - w) * (x - w)) + ((y - h) * (y - h)));

            if (distance < 225) {
                if (e.type === 'click') {
                    gameOver   = false;
                    count      = 0;
                    bullets    = [];
                    asteroids  = [];
                    explosions = [];
                    score      = 0;
                    shots      = -1;
                    player.deg = 0;
                    canvas.removeEventListener('contextmenu', action);
                    canvas.removeEventListener('mousemove', move);
                    canvas.style.cursor = "default";

                    playing = true;
                    // Note :: take away this section for BEAM!!
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
            for (let j = 0; j < asteroids.length; j++) {
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
