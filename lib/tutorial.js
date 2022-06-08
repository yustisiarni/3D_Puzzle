var scene = new THREE.Scene();
var cam = new THREE.PerspectiveCamera(45,innerWidth/innerHeight,1,100);

cam.position.set(8, 2, 8);

scene.background = new THREE.Color(0x0a0a0a);

let renderer = new THREE.WebGL1Renderer();

renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);
let controls = new THREE.OrbitControls(cam,renderer.domElement);

controls.enabled = true;

var Grid = new THREE.GridHelper(10,10,0x0a0a0a,0x000000);
Grid.position.set(0.5,-0.49,0);
scene.add(Grid);


let pLight = new THREE.PointLight(0xffffff,2);
scene.add(pLight);


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


let balls=[];

function createBall(x,y,z){
    const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.1),
        new THREE.MeshBasicMaterial( { color: 0xffff00 } )
    )
    ball.position.set(x,y,z)
    let ballBB = new THREE.Sphere(ball.position,0.1);
    ball.userData = {BB:ballBB};
    balls.push(ball);
    scene.add(ball);
}
for(var z=-1.5;z<1.5;z++){
    for(var y=1;y<4;y++){
        for(var x=0;x<3;x++){
            createBall(x,y,z);
        }
    }

}


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
function createBox(warna){
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
    box.userData={cn:boxBody,BB:boxBB};
    // console.log(box.userData);
}
// for (var i=0;i<27;i++){
//     createBox();
// }

let warna = [
//  fr,bc,up,dw,rg,lf
    [1,0 , 0, 1 ,1 ,0],
    [1,0 , 0, 0 ,1 ,0],
    [1,0 , 1, 0 ,1 ,0],
    
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
startTimer();
interval =setInterval(startTimer,1000);
function startTimer(){
    
    createBox(warna[i]);
    i+=1;
    if (i==26){
        stopTimer();
    }
}
function stopTimer(){
    clearInterval(interval);
}

const planeGeo = new THREE.PlaneGeometry(100,100);
const planematerial= new THREE.MeshStandardMaterial({    color:0xffffff,});
const planeb = new THREE.Mesh(planeGeo,planematerial);
planeb.rotation.x -=Math.PI/2;
planeb.position.y -= 0.5;
scene.add(planeb)

// scene.add(box1);

cam.position.z =10;
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
function draw(){
    
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
        while(coba && i<balls.length){
            if(objectBB.intersectsSphere(balls[i].userData.BB)){
                object.position.set(balls[i].position.x,balls[i].position.y,balls[i].position.z);
                object.userData.cn.position.copy(object.position);
                object.userData.cn.mass = 0;
                object.userData.cn.updateMassProperties();
                object.userData.cn.velocity.set(0,0,0); 
                object.userData.cn.angularVelocity.set(0,0,0);
                object.userData.cn.quaternion.w=2;
                coba=false
            }
            else{
                object.userData.cn.mass = 5;
                object.userData.cn.updateMassProperties();
            }
            i+=1;
        }

    }
    for (var i=0;i<objects.length;i++){
        objects[i].position.copy(objects[i].userData.cn.position);
        objects[i].quaternion.copy(objects[i].userData.cn.quaternion);
    }
    

    requestAnimationFrame(draw);
  

    renderer.render(scene,cam);
}

draw();


