var canvas;
var context;

const startEvent = new Event("start");
const updateEvent = new Event("update");
const drawEvent = new Event("draw");

var MainCamera = new Camera();

document.body.addEventListener("keydown", e => {
	Input.Keyboard.keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", e => {
	Input.Keyboard.keys[e.keyCode] = false;
});

var Events = [];

var GameSettings = {
	EnableSmoothing: false,
	canvas: "#canvas",
	ClearColor: "#8dcaff",
	ShowColliders: false
}

var GameState = {
	ContentLoaded: false
}
var Input = {
	Keyboard: {
		keys: [],
		IsKeyDown(k) {
			return Input.Keyboard.keys[k];
		}
	},
	Mouse: {
		m0: false,
		m1: false,
		m2: false,
		position: new vec()
	}
}

var Content = {};

var Time = {
	deltaTime: 0,
	elapsed: 0,
	lag: 0,
	fps: 0
}

function EventHandler(e, f) {
	Events.push({event: e, func: f});
}

window.onload = () => {
	canvas = document.querySelector(GameSettings.canvas);
	context = canvas.getContext("2d");

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	MainCamera.resolution = new vec(canvas.width, canvas.height);
	MainCamera.UpdateAspectRatio();

	Events.forEach(v => {
		canvas.addEventListener(v.event, v.func);
	});

	canvas.dispatchEvent(startEvent);
	context.webkitImageSmoothingEnabled = GameSettings.EnableSmoothing;
	context.mozImageSmoothingEnabled = GameSettings.EnableSmoothing;
	context.imageSmoothingEnabled = GameSettings.EnableSmoothing;
	gameLoop();
}

document.body.addEventListener("mousemove", e => {
	Input.Mouse.position = new vec(e.clientX, e.clientY);
});

let fps = 60,
	start = Date.now(),
	frameDuration = 1000 / fps,
	lag = 0;
function gameLoop() {
	requestAnimationFrame(gameLoop, canvas);
	var current = Date.now(),
		elapsed = current - start;
	start = current;
	lag += elapsed;
	while (lag >= frameDuration){
		lag -= frameDuration;
		canvas.dispatchEvent(updateEvent);
	}
	context.fillStyle = GameSettings.ClearColor;
	context.fillRect(0, 0, canvas.width, canvas.height);
	canvas.dispatchEvent(drawEvent);
	Time.deltaTime = lag / frameDuration
	Time.lag = Math.floor(lag);
	Time.fps = Math.floor(1000 / elapsed);
	Time.elapsed = elapsed;
}