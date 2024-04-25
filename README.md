<a href=""><img src="https://img.shields.io/badge/html5-%23414951.svg?&logo=html5&logoColor=red"></a>
<a href=""><img src="https://img.shields.io/badge/css3-%23414951.svg?logo=css3&logoColor=blue" ></a>
<a href=""><img src="https://img.shields.io/badge/javascript-%23414951.svg?logo=javascript&logoColor=%23F7DF1E"></a>
<a href=""><img src="https://img.shields.io/badge/firebase-414951?&logo=firebase&logoColor=yellow" ></a>
<a href=""><img src="https://img.shields.io/badge/npm-414951?logo=npm&logoColor=red" ></a>
<a href=""><img src="https://img.shields.io/badge/github%20actions-%23414951.svg?&logo=githubactions&logoColor=blue" ></a>
<a href=""><img src="https://img.shields.io/badge/github%20pages-414951?&logo=github&logoColor=white"></a>
<a href=""><img src="https://img.shields.io/badge/markdown-%23414951.svg?&logo=markdown&logoColor=orange" ></a>
<br> *Planetary Defence 🌍💥🕹️*

# Exercise

<br>

## Getting Started (Part 1 of 5)
1. Go to [stackblitz](https://stackblitz.com/~/github.com/jrsmth/planetary-defence/tree/exercise?startScript=stack)

<img width=800 src="https://github.com/jrsmth/planetary-defence/assets/34093915/f13e982c-26bb-4256-b1b9-1e275f1dd9f5">

2. Wait for the server to start, then click the 'open new tab' icon

<img width=800 src="https://github.com/jrsmth/planetary-defence/assets/34093915/1dd6a899-afc7-4887-b883-1fa4406cfe56">

3. Selecting `Connect to Project` loads the game 🎉

<br>

## Fix the Background (Part 2 of 5)
*Ouch! That's a little sore on the eyes...*

<img width=800 src="https://github.com/jrsmth/planetary-defence/assets/34093915/f16886f5-16f1-467f-b9f0-08ca28f9f0a2">

1. Open up `src/index.css` in the editor

<img width=800 src="https://github.com/jrsmth/planetary-defence/assets/34093915/dd1d45cc-e2d7-4798-9e4a-6661e1cb92c9">

2. Update the `background-colour:` to use `#211D49` (dark-blue)

<img width=800 src="https://github.com/jrsmth/planetary-defence/assets/34093915/8a369a6c-c0bd-49ed-8f20-3b1b3cfab951">

3. Save the file with `ctrl/cmd-s` and then refresh

<img width=800 src="https://github.com/jrsmth/planetary-defence/assets/34093915/d6792705-3a92-413d-9159-825441ed44ad">

4. The background is now dark-blue 🎉

<br>

## Fix the Click (Part 3 of 5)
*Ahh! Clicking is not working...*

1. Open up `src/index.js` in the editor

<img width=800 src="https://github.com/jrsmth/planetary-defence/assets/34093915/d18e8b5b-9613-484d-8640-5b05c302954f">

2. Remove 'line 5' (`startGame();`) and replace with `canvas.addEventListener('click', action);`

<img width=800 src="https://github.com/jrsmth/planetary-defence/assets/34093915/2ea188ea-b53d-460f-b390-dc8e4b51b932">

3. Save the file and refresh

<img width=800 src="https://github.com/jrsmth/planetary-defence/assets/34093915/c3b81b69-14f9-4284-85d9-f181c3700eef">

4. Now we can shoot the cannon 🎉

<br>

## Fix the Collision (Part 4 of 5)
*Hold up! I'm sure I hit that asteroid...*

1. Replace the `if ()` statement on 'lines 19-22' with the code block below

```javascript
    if (hasCollision(asteroids[j], bullets[i])) {
        asteroids[j].destroyed = true;
        bullets[i].destroyed   = true;
        explosions.push(asteroids[j]);
        
        /** Add Scoring: */
        /** That score isn't going to increase itself! */
        
    }
```

<img width=800 src="https://github.com/jrsmth/planetary-defence/assets/34093915/52a20fc6-bbcc-4227-b5fd-b4ef0cc93b6c">

2. Save the file and refresh

<img width=800 src="https://github.com/jrsmth/planetary-defence/assets/34093915/b37eada0-15bc-47d0-9c78-81a87c03109a">

3. We can now detect collisions 🎉

<br>

## Fix the Score (Part 5 of 5)
*Hey... Where are my points?!*

1. Increment the score by adding `score += 1;` on 'line 26'

<img width=800 src="https://github.com/jrsmth/planetary-defence/assets/34093915/b10e540f-aecc-47cc-97dd-76615d6d2197">

2. Save the file and refresh

<img width=800 src="https://github.com/jrsmth/planetary-defence/assets/34093915/0f326158-0455-48d5-810b-8bf1e88f6029">

3. Well done, now we can play the game as it was meant to be played! 🎉

<br>

## Stretch Yourself
* What does `score++;` do?
  * How about `score += 7;`?
