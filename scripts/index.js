<<<<<<< HEAD
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");
const tileUpscale = 64;

const entityStack = []

//fps Counter
class FpsCounter{
    constructor(){
        this.fps = 0
        entityStack.push(this);
    }
    update(dt){
        this.fps = Math.trunc(1/dt)
    }
    draw(ctx){
        ctx.fillStyle = 'red'
        ctx.fillText(`fps: ${this.fps}`, 10, 40)
    }
}
const fpsCounter = new FpsCounter();
//TileMaps
class TileMap{
    constructor(tileSize, tileAmmounts, tileSet, tileMap, rigidTiles){
        this.tileMap = tileMap;
        this.tileSize = tileSize;
        this.tileAmmounts = tileAmmounts;
        this.tileSet = tileSet;
        this.rigidTiles = rigidTiles;
        rigidTiles.prototype = [];
    }
    get getlength(){return this.tileMap[0].length}
    get getheight(){return this.tileMap.length}
}
const testMap = new TileMap(64, 4, 
    document.getElementById("TestTileSheet"),
    [
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
],[3])
//viewport / Camera
const Viewport = function(x,y,w,h){
    this.x = x;
    this.y = y;
    this.w=w; this.h=h;
}
Viewport.prototype = {
    draw:function(){
        ctx.beginPath();
        ctx.lineWidth = "6";
        ctx.strokeStyle = "red";
        ctx.rect((ctx.canvas.width/2)-(this.w/2),
        (ctx.canvas.height/2)-(this.h/2),
        this.w, 
        this.h)
        ctx.stroke();
    },
    scrollTo: function(x,y){
        this.x = x
        this.y = y
    }
}
const viewport = new Viewport(0,0,576,576)
//player
const player = {
    x:0,
    y:0,
    vVec: {x:0, y:0},
    size: 64,
    speed: 200,
    tileSheet: document.getElementById("TestTileSheet"),
    keys: [false, false, false, false],
    draw: function(){
        ctx.drawImage(
            this.tileSheet,this.size*4, 0, 
            this.size, this.size,
            ctx.canvas.width*0.5- this.size*0.5,
            ctx.canvas.height*0.5 -this.size*0.5,
            this.size,this.size
            )
    },
    update:function(dt){
        if(this.keys[0]==true){this.vVec.y += -this.speed*dt}
        if(this.keys[1]==true){this.vVec.y += this.speed*dt}
        if(this.keys[2]==true){this.vVec.x += -this.speed*dt}
        if(this.keys[3]==true){this.vVec.x += this.speed*dt}
        this.move(this.vVec.x, this.vVec.y);
    },
    move:function(vx,vy){
        if(vy != 0 || vx != 0){
            this.move(vx,0);
            this.move(0,vy);
            return;
        }
        if(!this.collision(vx, vy)){
            this.x += vx;
            this.y += vy;
        }
    },
    collision:function(vx, vy){
        var futureX = this.x + vx;
        var futureY = this.y + vy;
        //check for position of tile entities and entities
    }
}
//event listeners
document.addEventListener("keydown", (e)=>{
    switch(e.key){
        case 'w':
            player.keys[0] = true
            break;
        case 's':
            player.keys[1]=true
            break;
        case 'a':
            player.keys[2] = true
            break;
        case 'd':
            player.keys[3] = true
            break;
    }
})
document.addEventListener("keyup", (e)=>{
    switch(e.key){
        case 'w':
            player.keys[0] = false
            break;
        case 's':
            player.keys[1]=false
            break;
        case 'a':
            player.keys[2] = false
            break;
        case 'd':
            player.keys[3] = false
            break;
    }
})
//game loops
function update(dt){
    player.update(dt)
    for(var i = 0; i<entityStack.length;i++){
        entityStack[i].update(dt)
    }
    viewport.scrollTo(player.x, player.y)
}
function draw(dt){
    //clean up outside of viewport camera. start working on actual gamesdd
    //fields of viewport camera
    var x_min = Math.floor(viewport.x / tileUpscale);
    var y_min = Math.floor(viewport.y / tileUpscale);
    var x_max = Math.ceil((viewport.x + viewport.w) / tileUpscale);
    var y_max = Math.ceil((viewport.y + viewport.h) / tileUpscale);
    //draw tiles in camera
    for(var i = y_min; i < y_max; i++){
        for(var j = x_min; j < x_max;j++){
            if(i>=testMap.tileMap.length || j>testMap.getlength|| i<0 || j<0){continue;}
            var tileType = testMap.tileMap[i][j]
            var tileSize = testMap.tileSize;
            ctx.drawImage(
                testMap.tileSet,
                tileSize*tileType,0,
                tileSize-1, tileSize-1,
                (tileUpscale*j)- viewport.x+ctx.canvas.width*0.5-viewport.w/2,
                (tileUpscale*i)-viewport.y+ctx.canvas.height*0.5-viewport.h/2,
                tileUpscale,tileUpscale
            )
        }
    }
    //clean up outside of viewport
    ctx.beginPath()
    ctx.fillStyle = "black";
    ctx.fillRect(
        ctx.canvas.width*0.5-viewport.w*0.5-64, 
        ctx.canvas.height*0.5- viewport.h*0.5-64,
        64, 706)
    ctx.fillRect(
        ctx.canvas.width*0.5+viewport.w*0.5 ,
        ctx.canvas.height*0.5-viewport.h*0.5-64,
          64, 706)
    ctx.fillRect(
        ctx.canvas.width*0.5-viewport.w*0.5-2, 
        ctx.canvas.height*0.5-viewport.h*0.5-64,
        600, 66)
    ctx.fillRect(
        ctx.canvas.width*0.5-viewport.w*0.5-2, 
        ctx.canvas.height*0.5+viewport.h*0.5+2,
        580, 64
    )
    ctx.stroke();
    //player and camera boundries
    viewport.draw()
    player.draw()
    //debuging
    fpsCounter.draw(ctx)
}
let lastTick = Date.now();
function gameLoop(tick){
    const dt = tick -lastTick;
    lastTick = tick
    ctx.canvas.height = document.documentElement.clientHeight;
    ctx.canvas.width = document.documentElement.clientWidth;
    update(dt/1000);
    draw(dt/1000);
    requestAnimationFrame(gameLoop)
}

window.onload = ()=>{
    ctx.canvas.height = document.documentElement.clientHeight;
    ctx.canvas.width = document.documentElement.clientWidth;
    ctx.imageSmootingEnabled = false;
    requestAnimationFrame(gameLoop)
=======
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");
const tileUpscale = 64;

const entityStack = []

//fps Counter
class FpsCounter{
    constructor(){
        this.fps = 0
        entityStack.push(this);
    }
    update(dt){
        this.fps = Math.trunc(1/dt)
    }
    draw(ctx){
        ctx.fillStyle = 'red'
        ctx.fillText(`fps: ${this.fps}`, 10, 40)
    }
}
const fpsCounter = new FpsCounter();
//TileMaps
class TileMap{
    constructor(tileSize, tileAmmounts, tileSet, tileMap, rigidTiles){
        this.tileMap = tileMap;
        this.tileSize = tileSize;
        this.tileAmmounts = tileAmmounts;
        this.tileSet = tileSet;
        this.rigidTiles = rigidTiles;
        rigidTiles.prototype = [];
    }
    get getlength(){return this.tileMap[0].length}
    get getheight(){return this.tileMap.length}
}
const testMap = new TileMap(64, 4, 
    document.getElementById("TestTileSheet"),
    [
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
],[3])
//viewport / Camera
const Viewport = function(x,y,w,h){
    this.x = x;
    this.y = y;
    this.w=w; this.h=h;
}
Viewport.prototype = {
    draw:function(){
        ctx.beginPath();
        ctx.lineWidth = "6";
        ctx.strokeStyle = "red";
        ctx.rect((ctx.canvas.width/2)-(this.w/2),
        (ctx.canvas.height/2)-(this.h/2),
        this.w, 
        this.h)
        ctx.stroke();
    },
    scrollTo: function(x,y){
        this.x = x
        this.y = y
    }
}
const viewport = new Viewport(0,0,576,576)
//player
const player = {
    x:0,
    y:0,
    vVec: {x:0, y:0},
    size: 64,
    speed: 200,
    tileSheet: document.getElementById("TestTileSheet"),
    keys: [false, false, false, false],
    draw: function(){
        ctx.drawImage(
            this.tileSheet,this.size*4, 0, 
            this.size, this.size,
            ctx.canvas.width*0.5- this.size*0.5,
            ctx.canvas.height*0.5 -this.size*0.5,
            this.size,this.size
            )
    },
    update:function(dt){
        if(this.keys[0]==true){this.vVec.y += -this.speed*dt}
        if(this.keys[1]==true){this.vVec.y += this.speed*dt}
        if(this.keys[2]==true){this.vVec.x += -this.speed*dt}
        if(this.keys[3]==true){this.vVec.x += this.speed*dt}
        this.move(this.vVec.x, this.vVec.y);
    },
    move:function(vx,vy){
        if(vy != 0 || vx != 0){
            this.move(vx,0);
            this.move(0,vy);
            return;
        }
        if(!this.collision(vx, vy)){
            this.x += vx;
            this.y += vy;
        }
    },
    collision:function(vx, vy){
        var futureX = this.x + vx;
        var futureY = this.y + vy;
        //check for position of tile entities and entities
    }
}
//event listeners
document.addEventListener("keydown", (e)=>{
    switch(e.key){
        case 'w':
            player.keys[0] = true
            break;
        case 's':
            player.keys[1]=true
            break;
        case 'a':
            player.keys[2] = true
            break;
        case 'd':
            player.keys[3] = true
            break;
    }
})
document.addEventListener("keyup", (e)=>{
    switch(e.key){
        case 'w':
            player.keys[0] = false
            break;
        case 's':
            player.keys[1]=false
            break;
        case 'a':
            player.keys[2] = false
            break;
        case 'd':
            player.keys[3] = false
            break;
    }
})
//game loops
function update(dt){
    player.update(dt)
    for(var i = 0; i<entityStack.length;i++){
        entityStack[i].update(dt)
    }
    viewport.scrollTo(player.x, player.y)
}
function draw(dt){
    //clean up outside of viewport camera. start working on actual gamesdd
    //fields of viewport camera
    var x_min = Math.floor(viewport.x / tileUpscale);
    var y_min = Math.floor(viewport.y / tileUpscale);
    var x_max = Math.ceil((viewport.x + viewport.w) / tileUpscale);
    var y_max = Math.ceil((viewport.y + viewport.h) / tileUpscale);
    //draw tiles in camera
    for(var i = y_min; i < y_max; i++){
        for(var j = x_min; j < x_max;j++){
            if(i>=testMap.tileMap.length || j>testMap.getlength|| i<0 || j<0){continue;}
            var tileType = testMap.tileMap[i][j]
            var tileSize = testMap.tileSize;
            ctx.drawImage(
                testMap.tileSet,
                tileSize*tileType,0,
                tileSize-1, tileSize-1,
                (tileUpscale*j)- viewport.x+ctx.canvas.width*0.5-viewport.w/2,
                (tileUpscale*i)-viewport.y+ctx.canvas.height*0.5-viewport.h/2,
                tileUpscale,tileUpscale
            )
        }
    }
    //clean up outside of viewport
    ctx.beginPath()
    ctx.fillStyle = "black";
    ctx.fillRect(
        ctx.canvas.width*0.5-viewport.w*0.5-64, 
        ctx.canvas.height*0.5- viewport.h*0.5-64,
        64, 706)
    ctx.fillRect(
        ctx.canvas.width*0.5+viewport.w*0.5 ,
        ctx.canvas.height*0.5-viewport.h*0.5-64,
          64, 706)
    ctx.fillRect(
        ctx.canvas.width*0.5-viewport.w*0.5-2, 
        ctx.canvas.height*0.5-viewport.h*0.5-64,
        600, 66)
    ctx.fillRect(
        ctx.canvas.width*0.5-viewport.w*0.5-2, 
        ctx.canvas.height*0.5+viewport.h*0.5+2,
        580, 64
    )
    ctx.stroke();
    //player and camera boundries
    viewport.draw()
    player.draw()
    //debuging
    fpsCounter.draw(ctx)
}
let lastTick = Date.now();
function gameLoop(tick){
    const dt = tick -lastTick;
    lastTick = tick
    ctx.canvas.height = document.documentElement.clientHeight;
    ctx.canvas.width = document.documentElement.clientWidth;
    update(dt/1000);
    draw(dt/1000);
    requestAnimationFrame(gameLoop)
}

window.onload = ()=>{
    ctx.canvas.height = document.documentElement.clientHeight;
    ctx.canvas.width = document.documentElement.clientWidth;
    ctx.imageSmootingEnabled = false;
    requestAnimationFrame(gameLoop)
>>>>>>> 43939dc (First Commit.)
}