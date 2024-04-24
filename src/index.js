window.addEventListener('DOMContentLoaded', () => {
    window.addEventListener("resize", update);

    /** Start the game: */
    startGame();
    /** We need to register the ability to click on the screen! */

    init();
});

function fire() {
    for (let i = 0; i < bullets.length; i++) {
        if (!bullets[i].destroyed) {
            trace(i);

            for (let j = 0; j < asteroids.length; j++) {
                /** Collision Detection: */
                /** We need to check if a bullet is touching any asteroids */

            }
        }
    }
}

function action(e) {
    e.preventDefault();

    if (playing) {
        shots++;
        bullets.push(new Bullet(e, height, width));

    } else {
        if (e.type === 'click')
            handleStart(e);
        else
            canvas.style.cursor = "pointer";
    }
}
