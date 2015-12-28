var scene,cube,captionScreen,leftCamera,rightCamera,planeCamera,animationHandle,allrenderer;
var eyedistance = 6, screenDistance=50;
var movieTexture;
var leftControler,rightControler,planeControler;
var divCanvasPressed=false;
function initAll()
{
	initThree();//Initialize the threejs components
	init3DCamera();//Initialize the cameras
	initControlers();
	initScene();//Initialize the scene
	initObject();//Initialize the objects
/*	touchCanvasSignal();
	pressCanvasSignal();
	//	clickCanvasSignal();
	releaseCanvasSignal();*/
}

function initThree()
{//allrenderer renders all the addons onto the video streams
	allrenderer = new THREE.WebGLRenderer(
		{
			canvas:document.getElementById("canvasAll"),
			antialias:true,
			precision:"highp",
			alpha:true,
			premultipliedAlpha:false,
			stencil:false,
			preserveDrawingBuffer:true,
			maxLights:1
		}
	);
	var divLayer=$("#divCanvas");
	//set the rendering region
	allrenderer.setSize(divLayer.width(),divLayer.height());
}

function init3DCamera()
{
	var divLayer=$("#divCanvas");

	//Initialize the left and right cameras
	leftCamera = new THREE.PerspectiveCamera(75,divLayer.width()/divLayer.height()/2, 0.1, 1000 );
	//set the parameters of the cameras in the world coordinate
	leftCamera.position.set(-eyedistance/2,0,screenDistance);
	//	leftControler.update();
	//set the up direction of the cameras
	leftCamera.up.set(0,1,0);
	//set the cameras
	leftCamera.lookAt({
		x : -eyedistance/2,
		y : 0,
		z : 0
	});

	rightCamera = new THREE.PerspectiveCamera(75,divLayer.width()/divLayer.height()/2, 0.1, 1000 );
	rightCamera.position.set(eyedistance/2,0,screenDistance);
	rightCamera.up.set(0,1,0);
	rightCamera.lookAt({
		x : eyedistance/2,
		y : 0,
		z : 0
	});

	planeCamera = new THREE.PerspectiveCamera(75,divLayer.width()/divLayer.height(), 0.1, 1000 );
	planeCamera.position.set(0,0,screenDistance);
	planeCamera.up.set(0,1,0);
	planeCamera.lookAt({
		x : 0,
		y : 0,
		z : 0
	});
}

function initScene() {//initialize the scene
	scene = new THREE.Scene();
}

function initObject(){//initialize the objects
	//Effect geometry module
	var effectGeometry = new THREE.CubeGeometry(15,15,15);
	//The material which renders the geometry
	var effectMaterial = new THREE.MeshBasicMaterial({
		map : new THREE.ImageUtils.loadTexture("/images/texture.png")
	});
	cube = new THREE.Mesh( effectGeometry, effectMaterial );
	cube.position.set(0,0,-50);
	scene.add(cube);
	//The caption module
	var textGeometry = new THREE.TextGeometry("Hello!",
	{
		size: 10,
		height: 10,
		curveSegments: 4,
		font: "optimer",
		weight: "bold",
		style: "normal",
		bevelThickness: 1,
		bevelSize: 1,
		bevelEnabled: true,
		material: 0,
		extrudeMaterial: 1
	});
	textGeometry.computeBoundingBox();
	textGeometry.computeVertexNormals();

	//		var captionGeometry = new THREE.PlaneGeometry( 240, 100, 4, 4 );
	var movieMaterial = new THREE.MeshBasicMaterial({
		map : new THREE.ImageUtils.loadTexture("/images/texture.png")
	});
	captionScreen = new THREE.Mesh(textGeometry, effectMaterial );
	captionScreen.position.set(100,0,-50);
//	captionScreen.rotation.x=Math.PI*1/2;

	scene.add(captionScreen);

	//		textGeometry.computeBindingBox();
	//		textGeometry.textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
}
function initControlers()
{
	leftControler= new THREE.DeviceOrientationControls( leftCamera );
	rightControler= new THREE.DeviceOrientationControls( rightCamera );
	planeControler= new THREE.DeviceOrientationControls(planeCamera);
}
function start3DRender()
{
	fittoVideo();
	initThree();//Initialize the threejs components
	init3DCamera();//Initialize the cameras

	initControlers();
	animationHandle=self.setInterval(
		function()
		{
			var divLayer=$("#divCanvas");
			//Enable scissortest of the renderer
			allrenderer.enableScissorTest(true);
			allrenderer.clear();
			cubemovement(0.1);
			captionmovement(0.2);
			leftControler.update();
			rightControler.update();
			//Render the left eye
			allrenderer.setViewport(0,0,divLayer.width()/2,divLayer.height());
			allrenderer.setScissor(0,0,divLayer.width()/2,divLayer.height());
			allrenderer.render(scene,leftCamera);
			//Render the right eye
			allrenderer.setViewport(divLayer.width()/2,0,divLayer.width()/2,divLayer.height());
			allrenderer.setScissor(divLayer.width()/2,0,divLayer.width()/2,divLayer.height());
			allrenderer.render(scene,rightCamera);
			//Disable the scissortest of the renderer
			allrenderer.enableScissorTest( false );
		}
		,30);
	}
	function start2DRender()
	{
		fittoVideo();
		initThree();//Initialize the threejs components
		init3DCamera();//Initialize the cameras
		initControlers();
		animationHandle=self.setInterval(
			function()
			{
				var divLayer=$("#divCanvas");
				//Enable scissortest of the renderer
				allrenderer.enableScissorTest(true);
				allrenderer.clear();
				cubemovement(0.1);
				captionmovement(0.2);
				planeControler.update();
				//Render the 2D eye
				allrenderer.setViewport(0,0,divLayer.width(),divLayer.height());
				allrenderer.setScissor(0,0,divLayer.width(),divLayer.height());
				allrenderer.render(scene,planeCamera);
				//Disable the scissortest of the renderer
				allrenderer.enableScissorTest( false );
			}
			,30);
		}
		function change3Dto2D()
		{
			fittoVideo();
			stopRender();
			start2DRender();
		}

		function change2Dto3D()
		{
			fittoVideo();
			stopRender();
			start3DRender();
		}
		//The Define the movement of the cube
		function cubemovement(speed) {
			cube.rotation.x += speed;
			cube.rotation.y += speed;
			cube.rotation.z += speed;
		}
		//Define the movement of the caption
		function captionmovement(speed)
		{
			captionScreen.position.x-=speed;
		}

		function stopRender()
		{
			clearInterval(animationHandle);
		}

		function fittoVideo()
		{
			$("#divCanvas").width($("#video").width());
			$("#divCanvas").height($("#video").height());
			$("#divCanvas").offset($("#video").offset());
			$("#canvasAll").width($("#video").width());
			$("#canvasAll").height($("#video").height());
			$("#canvasAll").offset($("#video").offset());
		}

/*		var firstScope,secondScope;
		function touchCanvasSignal()
		{
			var divCan=document.getElementById("divCanvas");
			divCan.addEventListener('touchstart',touchEventFunction,false);
		}

		function touchEventFunction()
		{
			firstScope=leftControler.scope;
		}

		function pressCanvasSignal()
		{
			var divCan=document.getElementById("divCanvas");
			divCan.addEventListener('touchmove',pressEventFunction,false);
		}

		function pressEventFunction()
		{
			stopRender();
			animationHandle=self.setInterval(
				function()
				{

					var divLayer=$("#divCanvas");
					//Enable scissortest of the renderer
					allrenderer.enableScissorTest(true);
					allrenderer.clear();
					cubemovement(0.1);
					captionmovement(0.2);
					leftControler.currentupdate(firstScope);
					rightControler.currentupdate(firstScope);
					//Render the left eye
					allrenderer.setViewport(0,0,divLayer.width()/2,divLayer.height());
					allrenderer.setScissor(0,0,divLayer.width()/2,divLayer.height());
					allrenderer.render(scene,leftCamera);
					//Render the right eye
					allrenderer.setViewport(divLayer.width()/2,0,divLayer.width()/2,divLayer.height());
					allrenderer.setScissor(divLayer.width()/2,0,divLayer.width()/2,divLayer.height());
					allrenderer.render(scene,rightCamera);
					//Disable the scissortest of the renderer
					allrenderer.enableScissorTest( false );
				}
				,30);
			}

			function releaseCanvasSignal()
			{
				var divCan=document.getElementById("divCanvas");
				divCan.addEventListener('touchend',releaseEventFunction,false);
			}

			function releaseEventFunction()
			{
				secondScope=leftControler.scope;
				leftControler.addDelta(firstScope,secondScope);
				rightControler.addDelta(firstScope,secondScope);

				stopRender();
				animationHandle=self.setInterval(
					function()
					{

						var divLayer=$("#divCanvas");
						//Enable scissortest of the renderer
						allrenderer.enableScissorTest(true);
						allrenderer.clear();
						cubemovement(0.1);
						captionmovement(0.2);
						leftControler.update();
						rightControler.update();
						//Render the left eye
						allrenderer.setViewport(0,0,divLayer.width()/2,divLayer.height());
						allrenderer.setScissor(0,0,divLayer.width()/2,divLayer.height());
						allrenderer.render(scene,leftCamera);
						//Render the right eye
						allrenderer.setViewport(divLayer.width()/2,0,divLayer.width()/2,divLayer.height());
						allrenderer.setScissor(divLayer.width()/2,0,divLayer.width()/2,divLayer.height());
						allrenderer.render(scene,rightCamera);
						//Disable the scissortest of the renderer
						allrenderer.enableScissorTest( false );
					}
					,30);

			}*/
