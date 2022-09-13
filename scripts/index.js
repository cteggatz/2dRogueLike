const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");
const tileUpscale = 64;

//stacks
const entityStack = []
const UI_Stack = []
const debugStack = []
const mapStack = []

//game variables
let mapNumber = 0;

//functions
const boxCollision = function(boxOne, boxTwo){ 
    if(boxOne.pos.x + boxOne.size.w >= boxTwo.pos.x &&
        boxOne.pos.x <= boxTwo.pos.x + boxTwo.size.w &&
        boxOne.pos.y + boxOne.size.h >= boxTwo.pos.y &&
        boxOne.pos.y <= boxTwo.pos.y + boxTwo.size.h){
        return true
    }
    return false
}

//classes
//TileMaps
class TileMap{
    constructor(tileSize, tileAmmounts, tileSet, tileMap, rigidTiles){
        this.tileMap = tileMap;
        this.tileSize = tileSize;
        this.tileAmmounts = tileAmmounts;
        this.tileSet = tileSet;
        this.rigidTiles = rigidTiles;
        rigidTiles.prototype = [];
        mapStack.push(this);
    }
    get getlength(){return this.tileMap[0].length}
    get getheight(){return this.tileMap.length}
    rigid(y,x){
        if(y<0 || y>this.tileMap.length || x<0 || x>this.tileMap[0].length){return false}
        for(var i = 0; i<this.rigidTiles.length; i++){
            if(this.tileMap[y][x]==this.rigidTiles[i]){return true}
        }
        return false;
    }
    draw(){
        var x_min = Math.floor(viewport.x / tileUpscale);
        var y_min = Math.floor(viewport.y / tileUpscale);
        var x_max = Math.ceil((viewport.x + viewport.w) / tileUpscale);
        var y_max = Math.ceil((viewport.y + viewport.h) / tileUpscale);

        //draw tiles in camera
        for(var i = y_min; i < y_max; i++){
            for(var j = x_min; j < x_max;j++){
                if(i>=this.tileMap.length || j>this.getlength|| i<0 || j<0){continue;}
                var tileType = this.tileMap[i][j]
                var tileSize = this.tileSize;
                ctx.drawImage(
                    this.tileSet,
                    tileSize*tileType,0,
                    tileSize-1, tileSize-1,
                    (tileUpscale*j)- viewport.x+ctx.canvas.width*0.5-viewport.w/2,
                    (tileUpscale*i)-viewport.y+ctx.canvas.height*0.5-viewport.h/2,
                    tileUpscale,tileUpscale
                )
            }
        }
        
    }
}
//viewport / Camera
const Viewport = function(x,y,w,h){
    this.w=w; this.h=h;
    this.x = x;
    this.y = y;
}
Viewport.prototype = {
    draw:function(){
        ctx.beginPath()
        ctx.fillStyle = "black";
        ctx.fillRect(
            ctx.canvas.width*0.5-this.w*0.5-64, 
            ctx.canvas.height*0.5- this.h*0.5-64,
            64, 706)
        ctx.fillRect(
            ctx.canvas.width*0.5+this.w*0.5 ,
            ctx.canvas.height*0.5-this.h*0.5-64,
            64, 706)
        ctx.fillRect(
            ctx.canvas.width*0.5-this.w*0.5-2, 
            ctx.canvas.height*0.5-this.h*0.5-64,
            600, 66)
        ctx.fillRect(
            ctx.canvas.width*0.5-this.w*0.5-2, 
            ctx.canvas.height*0.5+this.h*0.5+2,
            580, 64
        )
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = "6";
        ctx.strokeStyle = "black";
        ctx.rect((ctx.canvas.width/2)-(this.w/2),
        (ctx.canvas.height/2)-(this.h/2),
        this.w, 
        this.h)
        ctx.stroke();
    },
    scrollTo: function(x,y){
        this.x = x -this.w*0.5
        this.y = y -this.h*0.5
    }
}
//player
const player = {
    x:100+32,
    y:100+32,
    offset: 32,
    vVec: {x:0, y:0},
    size: 64,
    speed: 200,
    tileSheet: document.getElementById("TestTileSheet"),
    keys: [false, false, false, false, false],
    getX: function(){return this.x},
    getY: function(){return this.y},
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
        if(this.keys[4]==true){this.speed = 275};
        if(this.keys[4]==false){this.speed = 200};
        if(this.keys[0]==false||this.keys[1]==false){this.vVec.y=0}
        if(this.keys[2]==false||this.keys[3]==false){this.vVec.x=0}
        if(this.keys[0]==true){this.vVec.y = -this.speed*dt}
        if(this.keys[1]==true){this.vVec.y = this.speed*dt}
        if(this.keys[2]==true){this.vVec.x = -this.speed*dt}
        if(this.keys[3]==true){this.vVec.x = this.speed*dt}
        this.move(this.vVec.x, this.vVec.y);
    },
    move:function(vx,vy){
        if(vy != 0 && vx != 0){
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
        var futureX = (this.x + vx);
        var map = mapStack[mapNumber]
        var futureY = (this.y + vy);
        var playerX = Math.floor(player.getX()/tileUpscale);
        var playerY = Math.floor(player.getY()/tileUpscale);
        //tile collision || change map stack
        for(let i = playerY-1; i<=(playerY+1); i++){
            for(let j = playerX-1; j<=(playerX+1); j++){
                if(j===playerX && i===playerY){continue}
                if(map.rigid(i,j)===false){continue}
                if(futureX + tileUpscale-40 >= j*64 && 
                    futureX-32 <= (j*64)+map.tileSize &&
                    futureY + tileUpscale-32>= i*64 &&
                    futureY-32 <= (i*64) + map.tileSize){
                        return true
                    }
            }  
        }
        for(var i = 0; i<entityStack.length; i++){
            if(futureX + this.size -this.offset>= entityStack[i].pos.x &&
                futureX - this.offset < entityStack[i].pos.x + entityStack[i].size.w &&
                futureY + this.size -this.offset >= entityStack[i].pos.x &&
                futureY-this.offset < entityStack[i].pos.y + entityStack[i].size.h){
                    entityStack[i].onCollision(this);
                    if(entityStack[i].rigid){
                        return true
                    }
                }
        }
        return false;
    },
    debugPlayerPos: function(){
        var playerX = Math.floor(player.getX()/tileUpscale);
        var playerY = Math.floor(player.getY()/tileUpscale);
        console.log(map2.rigid(playerY, playerX))
    }
}
//objects
class GameObject{
    constructor(pos, size, rigid){
        this.pos = pos;
        this.size = size;
        this.rigid = rigid;
        this.color= "red"
        entityStack.push(this)
    }
    draw(viewport){
        ctx.fillStyle = this.color
        ctx.fillRect(
            this.pos.x - viewport.x +ctx.canvas.width*0.5-viewport.w/2, 
            this.pos.y - viewport.y +ctx.canvas.height*0.5-viewport.h/2, 
            this.size.w, 
            this.size.h)
    }
    update(){

    }
    onCollision(object){
        this.color="blue"
        mapNumber = 1;
    }
}


//debugs
class FpsCounter{
    constructor(){
        this.fps = 0
        debugStack.push(this);
    }
    update(dt){
        this.fps = Math.trunc(1/dt)
    }
    draw(ctx){
        ctx.fillStyle = 'red'
        ctx.fillText(`fps: ${this.fps}`, 10, 10)
    }
}
const PlayerDebug = function(playerX, playerY, playerVVec){
    this.x = playerX;
    this.y = playerY;
    this.Vec = playerVVec;
}
PlayerDebug.prototype = {
    update:function(x, y, vVec){
        this.x = x;
        this.y = y; 
        this.vVec = vVec;
    },
    draw: function(ctx){
        ctx.fillStyle = "white"
        ctx.fillText(`Player_x: ${Math.floor(this.x/tileUpscale)}, ${this.x}`,10,20)
        ctx.fillText(`Player_y: ${Math.floor(this.y/tileUpscale)}, ${this.y}`,10,30)
        ctx.fillText(`Player_Velocity: ${this.vVec.x}, ${this.vVec.y}`,10,40)
        ctx.fillText(`W: ${player.keys[0]}, S: ${player.keys[1]}, a: ${player.keys[2]}, d: ${player.keys[3]} Shift: ${player.keys[4]}`,10,50)
    }
}


//inits
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
const map2 = new TileMap(64, 4, 
    document.getElementById("TestTileSheet"),
    [[0,0,0,0,0,0,0,0,0,0,0],
     [0,2,2,2,2,2,2,2,2,2,0],
     [0,2,2,2,2,2,2,2,2,2,0],  
     [0,2,2,2,2,2,2,2,2,2,0],
     [0,2,2,2,2,2,2,2,2,2,0],
     [0,2,2,2,2,2,2,2,2,2,0],
     [0,0,0,0,0,0,0,0,0,0,0]], [0])
const viewport = new Viewport(player.x,player.y,576,576)
const box = new GameObject({x:256, y:256}, {w:64, h:100}, false)
new FpsCounter();
const playerDebug = new PlayerDebug(player.x, player.y, player.vVec)


//game loops
function update(dt){
    player.update(dt)
    viewport.scrollTo(player.x, player.y)
    //draw entity stack
    for(var i = 0; i<entityStack.length;i++){
        entityStack[i].update(dt)
    }
    //draw debug stack
    for(var i = 0; i<debugStack.length;i++){
        debugStack[i].update(dt);
    }
    playerDebug.update(player.x, player.y, player.vVec)
}
function draw(dt){
    mapStack[mapNumber].draw()
    //draw Entity stack
    for(var i =0; i<entityStack.length;i++){
        if(entityStack[i].pos.x-20 <= Math.ceil(viewport.x+viewport.w) &&
            entityStack[i].pos.x+entityStack[i].size.w  > viewport.x &&
            entityStack[i].pos.y-20 < Math.ceil(viewport.y+ viewport.h) &&
            entityStack[i].pos.y  + entityStack[i].size.h > viewport.y){
                entityStack[i].draw(viewport)
            }
    }
    player.draw()
    //draw Debug Counters
    for(var i=0; i<debugStack.length;i++){
        debugStack[i].draw(ctx)
    }
    viewport.draw()
    playerDebug.draw(ctx)
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
    console.log(map2.rigid(6, 1))
    //event listeners
    document.addEventListener("keydown", (e)=>{
        if(e.key == "W" || e.key == "w"){player.keys[0] = true}
        if(e.key == "S" || e.key == "s"){player.keys[1] = true}
        if(e.key == "A" || e.key == "a"){player.keys[2] = true}
        if(e.key == "D" || e.key == "d"){player.keys[3] = true}
        if(e.shiftKey){player.keys[4]=true}
        if(e.key == "k"){player.debugPlayerPos()}
    })
    document.addEventListener("keyup", (e)=>{
        if(e.key == "W" || e.key == "w"){player.keys[0] = false}
        if(e.key == "S" || e.key == "s"){player.keys[1] = false}
        if(e.key == "A" || e.key == "a"){player.keys[2] = false}
        if(e.key == "D" || e.key == "d"){player.keys[3] = false}
        if(!e.shiftKey){player.keys[4]=false}
    })

    //init
    ctx.imageSmootingEnabled = false;
    requestAnimationFrame(gameLoop)
}