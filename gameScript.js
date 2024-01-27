const wrapper = document.querySelector(".wrapper");
let vh = window.innerHeight;
let vw = window.innerWidth;
let min;
let s = Math.min(vh, vw)*1;
if(vh<vw){
    wrapper.setAttribute("style", "height: 90dvh");
    wrapper.style.fontSize = 5+"dvh";
    console.log("height one");

}
else{
    wrapper.setAttribute("style", "width: 90dvw");
    wrapper.style.fontSize = 5+"dvw";
    console.log("width one");
}
console.log("the size of font should be", s);
// wrapper.setAttribute("style", "font-size: "+s+"px");


console.log('all set and go');
console.log(vh, vw);




class Room{

    static currentRoom;
    static currentRoomDiv;
    constructor(i, j){
        if(j!=undefined)
            this.j= j;
        this.i= i;
        this.occupies="";
        this.div = document.createElement('div');
        this.curtain = document.createElement('button');
        this.curtain.className = "curtain";
        this.div.className = "box";
        // this.curtain.addEventListener("click", this.addJob(Event));


        this.curtain.addEventListener("click", (e)=>{
            this.walk(e);
            Game.checkState(e, this);
        } );
        //add defulat class for styles
    }

    async addJob(e){
            await this.walk(e);
            Game.checkState(e, this);         
    }


    getNeighbours(currentPosition = this.i){
        let x = Math.floor(currentPosition/4);
        let y = Math.floor(currentPosition%4);
        const neighbours = [];
        let temp;
        if(y>0){
            temp = x*4 + (y-1);
            neighbours.push(temp);
        }
        if(y<3){
            temp = x*4 + (y+1);
            neighbours.push(temp);
        }
        if(x>0){
            temp = (x-1)*4 + y;
            neighbours.push(temp);
        }
        if(x<3){
            temp = (x+1)*4 + y;
            neighbours.push(temp);
        }
        return neighbours;
    }

    allocate(obj="gold"){
        this.occupies = obj;
        // neighbours = this.getNeighbours();
        console.log(obj+": "+this.i);
        if(obj=='monster'){
            this.div.style.backgroundImage = "url(images/monster.png)"
        }
        else if(obj=='pit'){
            this.div.style.backgroundImage = "url(images/pit.png)"
        }
        else{
            this.div.style.backgroundImage = "url(images/treasure.png)"
        }
    }

    placeHints(room, palace){
        let hint = {'monster':'url(images/stink.png)', 'pit':'url(images/wind.png)'}
        let neighbours = room.getNeighbours();
        neighbours.forEach((roomNumber)=>{
            let nearNeighbour = palace[roomNumber]; 
            if(nearNeighbour.occupies==""){
                nearNeighbour.div.style.backgroundImage = hint[room.occupies];
                nearNeighbour.occupies = 'hint-'+room.occupies;
            }
            else if(nearNeighbour.occupies.includes('hint')){
                if(nearNeighbour.occupies != 'hint-'+room.occupies){
                    nearNeighbour.div.style.backgroundImage = 'url(images/wind-stink.png)';
                }
            }
        });

    }

    async walk(e){
        let reachableRooms = this.getNeighbours(this.constructor.currentRoom);
        // console.log(e);
        // console.log("reachable ne: ", reachableRooms);

        if(reachableRooms.includes(this.i)){
            //pulling the clicked box curtain and then rolling back the previous curtain;
            await this.pullCurtain();
            await this.constructor.currentRoomDiv.rollCurtain();
            this.constructor.currentRoom = this.i;
            this.constructor.currentRoomDiv = this;
        }
    }
    async pullCurtain(){
        this.curtain.style.background = "transparent";
        //unhide with html-css element
    }
    async rollCurtain(){
        this.curtain.style.background = "#4F518C";
    }
    get currentPosition(){
        return currentRoomDiv;
    }
}

class Game{
    static currentPosition;
    #obstacles=[];
    #validRooms=[0, 1, 2, 3, 4, 5, 6, 7, 10, 11, 14, 15];
    static resultBox = document.querySelector(".result");
    static palace;


    constructor(){
        this.start();
    }

    start(){
        //build palace      DONE
        //plant treasure    DONE
        //plant obstacles   workingOn
        //plant hints

        console.log("start")
        const palace = this.buildPalace();
        Game.palace = palace;
        this.plantTreasure(palace);
        this.plantObstacles(palace);
    }

    restart(){
        location.reload();
    }

    getObs(){
        console.log(this.#obstacles);
    }
    
    static checkState(currentPosition, room){
        // console.log("the obstacles");
        // console.log(currentPosition.target);
        // console.log(room);  
        Game.currentPosition = currentPosition;
        if(room.occupies == "monster" || room.occupies == "pit"){
            this.disableCurtains();
            document.querySelector("#resultLabel").textContent = "Game Lost";
            setTimeout(function(){Game.resultBox.style.visibility = 'visible';}, 750);
            
        }else if(room.occupies == "gold"){
            document.querySelector("#resultLabel").textContent = "Treasure";
            this.resultBox.style.visibility = 'visible';
            this.disableCurtains();
        }
    }

    static disableCurtains(){
        document.querySelectorAll(".curtain").forEach((btn)=>{
            btn.setAttribute("disabled", "disabled");
        });
    }

    plantTreasure(palace){
        let n = this.#validRooms.length;
        //randomly generating the index so to choose from the array
        let indx =  this.randInt(n);
        let loc = this.#validRooms[indx];

        palace[loc].allocate();
        this.#validRooms.splice(indx, 1);
        console.log("Treasure: "+loc);
        console.log(this.#validRooms);

    }
    randInt(j, i=0){
        return Math.floor(Math.random()*(j-i)+i);
    }

    buildPalace(){
        const wrapper = document.querySelector(".wrapper");
        const overlaybox= document.createElement("div");
        overlaybox.className ="overlaybox";
        wrapper.appendChild(overlaybox);
        const palace =[];
        for (let i=0; i<16; i++){
            let r = new Room(i);
            palace.push(r);
            wrapper.appendChild(r.div);
            overlaybox.appendChild(r.curtain);
        }
        Room.currentRoomDiv = palace[12];
        Room.currentRoom = 12;
        
        return palace;
    }

    plantObstacles(palace){
        let totalObs = this.randInt(3, 7);
        let monsterLoc;
        let pitLoc;
        let tossForMonster, tossForPit;
        for(let i=0; i<totalObs; i++){
            tossForMonster = this.randInt(2)
            tossForPit = this.randInt(2)
            if(tossForMonster==1)
                monsterLoc = this.#validRooms[this.randInt(this.#validRooms.length)];
            if(tossForPit==1)
                pitLoc = this.#validRooms[this.randInt(this.#validRooms.length)];

            
            while(pitLoc==monsterLoc){
                pitLoc = this.#validRooms[this.randInt(this.#validRooms.length)];
                tossForMonster = 0;
            }

            while(this.#obstacles.includes(pitLoc)){
                pitLoc = this.#validRooms[this.randInt(this.#validRooms.length)];
            }
            while(this.#obstacles.includes(monsterLoc)){
                monsterLoc = this.#validRooms[this.randInt(this.#validRooms.length)];
            }
            if(tossForMonster!=0){
                this.#obstacles.push(monsterLoc);
                palace[monsterLoc].allocate("monster");
                palace[monsterLoc].placeHints(palace[monsterLoc], palace);

            }
            if(tossForPit!=0){
                this.#obstacles.push(pitLoc);
                palace[pitLoc].allocate("pit");
                palace[pitLoc].placeHints(palace[pitLoc], palace);
            }
        }
    }

}

g = new Game();

