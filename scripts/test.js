let animationFPS = 12;
let currentFrames = 0;
let animatedFrames = 0;
const fps = 30;

console.log((fps/12))
while(true){
    if(currentFrames == fps){break};
    if(fps % (fps/currentFrames) == 0){
        animatedFrames++
    }
    currentFrames++
}
console.log(animatedFrames)