var container;
var camera, scene, renderer;
var mouseX = 0,
    mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

// Object3D ("Group") nodes and Mesh nodes
var sceneRoot = new THREE.Group();

var earthSpin = new THREE.Group();
var earthMesh;

var moonSpin = new THREE.Group();
var moonMesh;

var SunSpin = new THREE.Group();
var SunMesh;

var sunLight = new THREE.PointLight(0xffffff, 50, 100);




var earth_moon =  new THREE.Group();
var Sun_earth = new THREE.Group();

var animation = true;

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    // mouseX, mouseY are in the range [-1, 1]
    mouseX = (event.clientX - windowHalfX) / windowHalfX;
    mouseY = (event.clientY - windowHalfY) / windowHalfY;
}

function createSceneGraph() {
    scene = new THREE.Scene();

    // Top-level node
    scene.add(sceneRoot);
    // earth branch
    //sceneRoot.add(earthSpin);
    //sceneRoot.add(moonSpin);
    scene.add(sunLight);

    sceneRoot.add(Sun_earth);

    
    Sun_earth.add(SunSpin);

    SunSpin.scale.set(0.7,0.7,0.7);

    SunSpin.add(SunMesh);

    Sun_earth.add(earth_moon);

    earth_moon.add(earthSpin);
    earth_moon.add(moonSpin);

    earthSpin.add(earthMesh);
    moonSpin.add(moonMesh);

    sunLight.position.set(SunMesh.position.x, SunMesh.position.y, SunMesh.position.z);
    
    earthSpin.scale.set(0.3, 0.3, 0.3);
    earthSpin.rotation.z = 23.44 * Math.PI / 180.0;


    moonSpin.position.x = 0.6;
    moonSpin.scale.set(0.3, 0.3, 0.3);
    moonSpin.rotation.z = 5.15 * Math.PI / 180.0;

    earth_moon.position.x = 5.0;

}

function init() {
    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 1;
    
    var texloader = new THREE.TextureLoader();
    
    // Earth mesh
	var geometryEarth = new THREE.SphereGeometry(radius = 1, widthSegments = 100, heightSegments = 100);    
    var geometryMoon = new THREE.SphereGeometry(radius = 0.3, widthSegments = 100, heightSegments = 100);
    var geometrySun = new THREE.SphereGeometry(radius = 2, widthSegments = 100, heightSegments = 100);


    var materialEarth = new THREE.MeshLambertMaterial();
    var materialMoon = new THREE.MeshLambertMaterial();
    var materialSun = new THREE.MeshBasicMaterial();

    materialEarth.combine = 0;
    materialEarth.needsUpdate = true;
    materialEarth.wireframe = false;    

    materialMoon.combine = 0;
    materialMoon.needsUpdate = true;
    materialMoon.wireframe = false;  

    materialSun.combine = 0;
    materialSun.needsUpdate = true;
    materialSun.wireframe = false;  

    //
    // Task 2: uncommenting the following two lines requires you to run this example with a (local) webserver
    //
    // For example using python:
    //    1. open a command line and go to the lab folder
    //    2. run "python -m http.server"
    //    3. open your browser and go to http://localhost:8000
    //
    // see https://threejs.org/docs/#manual/en/introduction/How-to-run-things-locally
    //
	
    const earthTexture = texloader.load('tex/2k_earth_daymap.jpg');
    materialEarth.map = earthTexture;

    const earthspec12Texture = texloader.load('tex/2k_earth_specular_map.jpg');
    materialEarth.map = earthTexture;


    const moonTexture = texloader.load('tex/2k_moon.jpg');
    materialMoon.map = moonTexture;

    const SunTexture = texloader.load('tex/2k_sun.jpg');
    materialSun.map = SunTexture;
    

    // Task 7: material using custom Vertex Shader and Fragment Shader
    
	var uniforms = THREE.UniformsUtils.merge( [
	    { 
	    	colorTexture : { value : new THREE.Texture() }
    	},
	    THREE.UniformsLib[ "lights" ]
	] );

	const shaderMaterial = new THREE.ShaderMaterial({
		uniforms : uniforms,
		vertexShader : document.getElementById('vertexShader').textContent.trim(),
		fragmentShader : document.getElementById('fragmentShader').textContent.trim(),
		lights : true
	});

	shaderMaterial.uniforms.colorTexture.value = earthTexture;
	



    //earthMesh = new THREE.Mesh(geometryEarth, shaderMaterial);
    earthMesh = new THREE.Mesh(geometryEarth, materialEarth);
    moonMesh = new THREE.Mesh(geometryMoon, materialMoon);
    SunMesh = new THREE.Mesh(geometrySun, materialSun);

    createSceneGraph();

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

    var checkBoxAnim = document.getElementById('animation');
    animation = checkBoxAnim.checked;
    checkBoxAnim.addEventListener('change', (event) => {
    	animation = event.target.checked;
    });

	var checkBoxWireframe = document.getElementById('wireframe');
    earthMesh.material.wireframe = checkBoxWireframe.checked;
    checkBoxWireframe.addEventListener('change', (event) => {
    	earthMesh.material.wireframe = event.target.checked;
    });
}

function render() {
    // Set up the camera
    camera.position.x = mouseX * 10;
    camera.position.y = -mouseY * 10;
    camera.lookAt(scene.position);

    // Perform animations
    if (animation) {

        Sun_earth.rotation.y += (2*Math.PI)/(365*144.0);

        SunSpin.rotation.y += (2*Math.PI)/(25*60.0)-(2*Math.PI)/(365*144.0);

        earth_moon.rotation.y += (2*Math.PI)/(27.3*144);

        earthSpin.rotation.y+= (2*Math.PI)/(1*144.0)-(2*Math.PI)/(27.3*144);

    }

    // Render the scene
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate); // Request to be called again for next frame
    render();
}

init(); // Set up the scene
animate(); // Enter an infinite loop
