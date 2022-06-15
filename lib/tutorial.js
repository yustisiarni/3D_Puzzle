// import { FontLoader } from './node_modules/three/examples/jsm/loaders/FontLoader.js';
var scene = new THREE.Scene();
var cam = new THREE.PerspectiveCamera(45,innerWidth/innerHeight,1,1000);

cam.position.set(8, 2, 8);

scene.background = new THREE.Color(0x0a0a0a);

let renderer = new THREE.WebGL1Renderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);
let controls = new THREE.OrbitControls(cam,renderer.domElement);

controls.enabled = true;

var Grid = new THREE.GridHelper(10,10,0x0a0a0a,0x000000);
Grid.position.set(0.5,-0.49,0);
scene.add(Grid);

var text2 = document.createElement('div');
text2.style.position = 'absolute';
//text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
text2.style.width = 100;
text2.style.height = 100;
text2.style.backgroundColor = "white";
text2.innerHTML = "hi there!";
text2.style.top = 200 + 'px';
text2.style.right = 200 + 'px';
document.body.appendChild(text2);

let pLight = new THREE.PointLight(0xffffff,0.5);
pLight.castShadow=true;
pLight.position.z=2;
// scene.add(pLight);
let sLight = new THREE.PointLight(0xffffff,1);
sLight.castShadow=true;
sLight.position.z=46;
sLight.position.y=5;
sLight.position.x=0;
scene.add(sLight);
const light = new THREE.AmbientLight( 0xC1C1C1 ); // soft white light
// scene.add( light );
// let sLight2 = new THREE.PointLight(0xffffff,0.5);
// sLight2.castShadow=true;
// sLight2.position.z=49;
// sLight2.position.y=5;
// sLight2.position.x=5;
// scene.add(sLight2);


const geo_saya = new THREE.BoxGeometry(1,1,1);
const geo_material= new THREE.MeshBasicMaterial({    color:0xff0000,wireframe:true});
const a = new THREE.Mesh(geo_saya,geo_material);
a.position.set(0,0,0.5)
// scene.add(a);

let wireBB = new THREE.Box3(new THREE.Vector3(),new THREE.Vector3);
wireBB.setFromObject(a);

////////////////////////////////////////////////////////////////////////

let world = new CANNON.World();
world.gravity.set(0,-10,0);
world.broadphase = new CANNON.NaiveBroadphase();//perhitungan tumbukan
let timeStamp = 1.0/60.0;

let wall = new CANNON.Box(new CANNON.Vec3(5,5,0.01));

let plane = new CANNON.Plane();
let planebody = new CANNON.Body({shape:plane, mass:0});
planebody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI/2);
planebody.position.y=-0.5;
planebody.position.x=+0.5;
let wall1 = new CANNON.Body({shape:wall, mass:0})
wall1.position.z=+5;
wall1.position.x=+0.5;
wall1.position.y=+4.5;
let wall2 = new CANNON.Body({shape:wall, mass:0})
wall2.position.z=-5;
wall2.position.x=+0.5;
wall2.position.y=+4.5;
let wall3 = new CANNON.Body({shape:wall, mass:0})
wall3.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), -Math.PI/2);
wall3.position.x=-4.5;
wall3.position.y=+4.5;
let wall4 = new CANNON.Body({shape:wall, mass:0})
wall4.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), -Math.PI/2);
wall4.position.x=+5.5;
wall4.position.y=+4.5;


world.addBody(planebody);
world.addBody(wall1);
world.addBody(wall2);
world.addBody(wall3);
world.addBody(wall4);


let box = new CANNON.Box(new CANNON.Vec3(0.5,0.5,0.5));
let boxBody = new CANNON.Body({shape:box, mass:0});
boxBody.position.set(2,0,0);
// world.addBody(boxBody);

let bMesh =new THREE.Mesh
(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:0xff00ff})
);


let debugRenderer = new THREE.CannonDebugRenderer(scene,world);

let v=0;
let balls=[];

function createBall(x,y,z){
    const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.1),
        new THREE.MeshBasicMaterial( { color: 0xffff00 } )
    )
    ball.position.set(x,y,z)
    let ballBB = new THREE.Sphere(ball.position,0.1);
    ball.userData = {BB:ballBB,index:v,boxI:20};
    balls.push(ball);
    scene.add(ball);
    v+=1
}
// for(var z=1.5;z>-1.5;z--){
//     for(var x=3;x>0;x--){
//         for(var y=4;y>1;y--){
//             createBall(x,y,z);
//         }
//     }

// }


let boxx = new CANNON.Box(new CANNON.Vec3(0.5,0.5,0.5));

let objects = [];

const right = new THREE.TextureLoader().load('./texture/red.png');
const left = new THREE.TextureLoader().load('./texture/orange.png');
const front = new THREE.TextureLoader().load('./texture/green.png');
const back = new THREE.TextureLoader().load('./texture/blue.png');
const upside = new THREE.TextureLoader().load('./texture/white.png');
const downside = new THREE.TextureLoader().load('./texture/yellow.png');
const noside = new THREE.TextureLoader().load('./texture/noside.png');





// function createBox(fr,bc,up,dw,rg,lf){
function createBox(warna,index){
    const mat_array =[
        new THREE.MeshStandardMaterial({map:warna[0]==1?front:noside}),
        new THREE.MeshStandardMaterial({map:warna[1]==1?back:noside}),
        new THREE.MeshStandardMaterial({map:warna[2]==1?upside:noside}),
        new THREE.MeshStandardMaterial({map:warna[3]==1?downside:noside}),
        new THREE.MeshStandardMaterial({map:warna[4]==1?right:noside}),
        new THREE.MeshStandardMaterial({map:warna[5]==1?left:noside}),
    ]
    
    const geo_saya = new THREE.BoxGeometry(1,1,1);
    const geo_material= new THREE.MeshStandardMaterial({    color:0xff00ff,});
    if(objects.length==2){}
    const box = new THREE.Mesh(geo_saya,mat_array);

    scene.add(box);
    objects.push(box);
    
    let boxBB = new THREE.Box3(new THREE.Vector3(),new THREE.Vector3);
    boxBB.setFromObject(box);
    // box.userData={BB:boxBB};

    let boxBody = new CANNON.Body({shape:boxx, mass:5});
    boxBody.position.set(0,5,0);
    world.addBody(boxBody);
    box.userData={cn:boxBody,BB:boxBB,i:index};
    // console.log(box.userData);
}
// for (var i=0;i<27;i++){
//     createBox();
// }

let warna = [
    //  fr,bc,up,dw,rg,lf

    [1,0 , 1, 0 ,1 ,0],
    [1,0 , 0, 0 ,1 ,0],
    [1,0 , 0, 1 ,1 ,0],
    
    [0,0 , 1, 0 ,1 ,0],
    [0,0 , 0, 0 ,1 ,0],
    [0,0 , 0, 1 ,1 ,0],

    [0,1 , 1, 0 ,1 ,0],
    [0,1 , 0, 0 ,1 ,0],
    [0,1 , 0, 1 ,1 ,0],
//sisi kedua dri kanan
    [1,0 , 1, 0 ,0 ,0],
    [1,0 , 0, 0 ,0 ,0],
    [1,0 , 0, 1 ,0 ,0],

    [0,0 , 1, 0 ,0 ,0],
    [0,0 , 0, 1 ,0 ,0],
    
    [0,1 , 1, 0 ,0 ,0],
    [0,1 , 0, 0 ,0 ,0],
    [0,1 , 0, 1 ,0 ,0],
//sisi trakhir dri kanan
    [1,0 , 1, 0 ,0 ,1],
    [1,0 , 0, 0 ,0 ,1],
    [1,0 , 0, 1 ,0 ,1],

    [0,0 , 1, 0 ,0 ,1],
    [0,0 , 0, 0 ,0 ,1],
    [0,0 , 0, 1 ,0 ,1],

    [0,1 , 1, 0 ,0 ,1],
    [0,1 , 0, 0 ,0 ,1],
    [0,1 , 0, 1 ,0 ,1],
]


let interval;
let i =0
// startTimer();
// interval =setInterval(startTimer,1000);
function startTimer(){
    
    createBox(warna[i],i);
    i+=1;
    if (i==26){
        stopTimer();
    }
}
function stopTimer(){
    clearInterval(interval);
}

const planeGeo = new THREE.PlaneGeometry(500,500);
const planematerial= new THREE.MeshPhongMaterial({    color:0xffffff,});
const planeb = new THREE.Mesh(planeGeo,planematerial);
planeb.receiveShadow=true;
planeb.rotation.x -=Math.PI/2;
planeb.position.y -= 0.5;
scene.add(planeb)


// scene.add(box1);

// cam.position.z =10;
// cam.position.y +=10;
let object;
let objectBB;
// console.log(object);
const dControls = new THREE.DragControls(objects,cam,renderer.domElement);;
let drag = false;
dControls.addEventListener( 'dragstart', function ( event ) {

	// event.object.material.emissive.set( 0xaaaaaa );
    object=event.object;
    objectBB=object.userData.BB;
    controls.enabled = false;
    drag=true;
    // console.log(object.userData.i);
} );

dControls.addEventListener( 'dragend', function ( event ) {

	// event.object.material.emissive.set( 0x000000 );
    controls.enabled = true;
    drag=false;

} );




renderer.setSize(innerWidth,innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize',function(){
    renderer.setSize(this.window.innerWidth, this.window.innerHeight);
    cam.aspect = this.window.innerWidth/this.window.innerHeight;
    cam.updateProjectionMatrix();
})


function walls(a){

        if (a.position.x<=-4){
            a.position.x=-4;
        }
        if (a.position.x>=5){
            a.position.x=5;
        }
        if (a.position.z<=-4.5){
            a.position.z=-4.5;
        }
        if (a.position.z>=4.5){
            a.position.z=4.5;
        }
        if(a.position.y<=0){
            a.position.y=0;
        }
        if(a.position.y>=10){
            a.position.y=10;
        }

}

function check(){
    let win=true;
    let i=0;
    let hitung=0;
    while(i<=26&&win){
        win = false;
        if(balls[i].userData.index==balls[i].userData.boxI){
            win=true;
            console.log("bener");
            hitung+=1;
        }else{
            win=false
        }
        i+=1
    }
    // if(i==13){
    //     while(i<=26&&win){
    //         win = false;
    //         if(balls[i].userData.index==balls[i].userData.boxI+1){
    //             win=true;
    //             console.log("benerlagi");
    //             hitung+=1;
    //         }else{
    //             win=false
    //         }
    //         i+=1
    //     }
    // }
    
    return hitung;
}

function inter(){
    for(var i=0;i<balls.length;i++){
        for(var j=0;j<objects.length;j++){
            if(objects[j].userData.BB.intersectsSphere(balls[i].userData.BB)){
                if(objects[j].userData.i>=13){
                    balls[i].userData.boxI=(objects[j].userData.i+1);
                }else{
                    balls[i].userData.boxI=objects[j].userData.i;
                }
                if(i==13){
                    balls[i].userData.boxI=13;
                }
            }
        }
    }
}
function print(){
    for(var i=0;i<balls.length;i++){
        console.log("ball:"+balls[i].userData.index+"box:"+balls[i].userData.boxI)
    }
}
let selectedFont;
let tulisan = "Welcome";
let tulisan2 = `instructions:
Drag the blocks on the 
right spot (the yellow sphere).
Solved it as fast as you can
you will be timed!!

If you're ready drag this red block 
to the the blue sphere.

`;
let tulisan3 = "START";

let loader = new THREE.FontLoader().load('./fonts/Open_Sans_Bold.json',(e)=>{
    selectedFont = e;
    let tGeo = new THREE.TextGeometry(tulisan,{
        size:2,
        height:0.2,
        font: selectedFont
    });
    let tMat = new THREE.MeshPhongMaterial({
        color:0xff0000
    });
    let tMesh = new THREE.Mesh(tGeo,tMat);
    tMesh.position.z=50;
    tMesh.position.y=-0.5;
    tMesh.position.x=-13;
    tMesh.rotation.y=0.7;
    tMesh.name="t1";
    scene.add(tMesh);
    let tGeo2 = new THREE.TextGeometry(tulisan2,{
        size:0.5,
        height:0.2,
        font: selectedFont
    });
    let tMesh2 = new THREE.Mesh(tGeo2,tMat);
    tMesh2.name="t2";
    tMesh2.position.set(3,6.5,40);
    tMesh2.rotation.y=-0.7;
    scene.add(tMesh2);
    
    let tGeo3 = new THREE.TextGeometry(tulisan3,{
        size:1.5,
        height:0.2,
        font: selectedFont
    });
    let tMesh3 = new THREE.Mesh(tGeo3,tMat);
    tMesh3.position.set(-2.5,-0.5,47);
    tMesh3.rotation.x=-1;
    tMesh3.name="start"
    scene.add(tMesh3);
    tMesh3.castShadow=true;
    tMesh3.receiveShadow=true;
    tMesh2.castShadow=true;
    tMesh2.receiveShadow=true;
    
    tMesh.castShadow=true;
    tMesh.receiveShadow=true;
    
    controls.target = new THREE.Vector3(0,0,50);
    controls.update();
    cam.lookAt(new THREE.Vector3(0,0,tMesh.position.z));
    cam.position.z=70;

    
    // cam.rotation.set( -0.07904715774993527,0.03261899715442653,0.002583358968909609);
});


let rayCast = new THREE.Raycaster();
let mouse = {};
addEventListener("mousedown",(e)=>{
    mouse.x = (e.clientX/window.innerWidth)*2-1;
    mouse.y = (e.clientY/window.innerHeight)*-2+1;
    // console.log(mouse);

    rayCast.setFromCamera(mouse,cam);
    let items = rayCast.intersectObjects(scene.children);

    items.forEach((i)=>{
        if(i.object.name !=""){
            console.log(i.object.name);
            if (i.object.name=="start"){
                start();

            }
        }
    })
});
let waktu;
function start(){
    controls.target = new THREE.Vector3(0,2,0);
    startTimer();
    interval =setInterval(startTimer,1000);
    for(var z=1.5;z>-1.5;z--){
        for(var x=3;x>0;x--){
            for(var y=4;y>1;y--){
                createBall(x,y,z);
            }
        }
    
    }
    cam.position.z=20
    waktu = new Date();
    console.log(waktu);
    // cam.rotation.y+=10;
    scene.add(pLight);
    scene.add(light);
    // // cam.lookAt(new THREE.Vector3(0,0,cam.position.z));
    controls.update();
    // renderer.render(scene,cam); 

    scene.remove(sLight);
}

function win(detik){
    let loader = new THREE.FontLoader().load('./fonts/Open_Sans_Bold.json',(e)=>{
        selectedFont = e;
        let tulisan4 = "Nice job !"
        let tulisan5 = `You did it in
        ${detik} seconds !`;
        let tMat = new THREE.MeshPhongMaterial({
            color:0xff0000
        });
        let tFin = new THREE.TextGeometry(tulisan4,{
            size:1.5,
            height:0.2,
            font: selectedFont
        });
        let fMesh = new THREE.Mesh(tFin,tMat);
        fMesh.position.set(-10,0,-50);
        fMesh.rotation.y=0.7;
        scene.add(fMesh);
        let tFin2 = new THREE.TextGeometry(tulisan5,{
            size:1.5,
            height:0.2,
            font: selectedFont
        });
        let fMesh2 = new THREE.Mesh(tFin2,tMat);
        fMesh2.position.set(3,2.5,-55);
        fMesh2.rotation.y=-0.7;
        scene.add(fMesh2);
        fMesh.castShadow=true;
        fMesh.receiveShadow=true;
        fMesh2.castShadow=true;
        fMesh2.receiveShadow=true;
    });
    let sLight2 = new THREE.PointLight(0xffffff,1);
    sLight2.castShadow=true;
    sLight2.position.z=-46;
    sLight2.position.y=5;
    sLight2.position.x=0;
    scene.add(sLight2);
    controls.target = new THREE.Vector3(2,0,-50);
    controls.update();
    cam.lookAt(new THREE.Vector3(0,0,-50));
    cam.position.z=-20;
}


let winB=false;
let dragO = [];
pLight.position.copy( cam.position );
function draw(){
    // console.log(cam.rotation);
    world.step(timeStamp);
    // debugRenderer.update();
    pLight.position.copy( cam.position );
    

    if (drag){
        walls(object);
        object.userData.cn.position.copy(object.position);
        object.userData.cn.mass=0;
        object.userData.cn.updateMassProperties();

        objectBB.setFromObject(object);
        
  
        let coba = true;
        let i=0;
        // let apa=0;
        while(coba && i<balls.length){
            if(objectBB.intersectsSphere(balls[i].userData.BB)){
                object.position.set(balls[i].position.x,balls[i].position.y,balls[i].position.z);
                object.userData.cn.position.copy(object.position);
                object.userData.cn.mass = 0;
                object.userData.cn.updateMassProperties();
                object.userData.cn.velocity.set(0,0,0); 
                object.userData.cn.angularVelocity.set(0,0,0);
                let x=object.userData.cn.quaternion.x;
                let y=object.userData.cn.quaternion.y;
                let z=object.userData.cn.quaternion.z;
                object.userData.cn.quaternion.w=2;
                // console.log("sudah:"+a);
                // object.userData.cn.quaternion.x=-0.71;
                // object.userData.cn.quaternion.w=0.71;
                // // object.rotation.x=1
                // // object.rotation.y=1
                // // object.userData.cn.rotation.copy(object.rotation);
                // console.log("woiii");
                // // console.log(Math.floor(a));
                // console.log("x:"+object.rotation.x);
                // console.log("y:"+object.rotation.y);
                coba=false
                balls[i].userData.boxI=object.userData.i;
                if(i==20){
                    balls[i].userData.boxI=20;
                }
                // console.log(balls[i].userData.boxI," ", balls[i].userData.index);
                // if(balls[i].userData.boxI===balls[i].userData.index){
                //     apa+=1;
                //     console.log("apa:",apa);
                // }
                // if(apa==26){
                //     console.log("win");
                // }
                // console.log(balls[i].userData.index);
                // console.log(object.userData.i);
                if (!dragO.includes(object.userData.i)){
                    dragO.push(object.userData.i);
                }
            }
            else{
                object.userData.cn.mass = 5;
                object.userData.cn.updateMassProperties();
            }
            
            i+=1;

        }
        
        console.log(dragO)
        if(dragO.length==26){
            console.log(dragO)
            inter();
            print();
            console.log("CHECK"+check());
            if(check()==27 && winB ==false){
                console.log("/////////////////////WIN////////////////////");
                let a=new Date();
                let hasil = a-waktu
                console.log("Detik : "+hasil);
                win(hasil/1000);
                winB=true;
            }
        }

        // if(!objectBB.intersectsSphere(balls[1].userData.BB)){
        //     console.log("here")
        // }
    }
    
    for (var i=0;i<objects.length;i++){
        objects[i].position.copy(objects[i].userData.cn.position);
        objects[i].quaternion.copy(objects[i].userData.cn.quaternion);
    }
    

    requestAnimationFrame(draw);
  

    renderer.render(scene,cam);
}
// window.addEventListener('keydown', function clickListner(ev){
//     if(ev.key==' '){
//         controls.target = new THREE.Vector3(0,2,0);
//         startTimer();
//         interval =setInterval(startTimer,1000);
//         for(var z=1.5;z>-1.5;z--){
//             for(var x=3;x>0;x--){
//                 for(var y=4;y>1;y--){
//                     createBall(x,y,z);
//                 }
//             }
        
//         }
//         cam.position.z=20
//         let waktu = new Date();
//         console.log(waktu);
//         // cam.rotation.y+=10;
//         scene.add(pLight);
//         scene.add(light);
//         // // cam.lookAt(new THREE.Vector3(0,0,cam.position.z));
//         controls.update();
//         // renderer.render(scene,cam); 

//         scene.remove(sLight);
//     }
// })

draw();


