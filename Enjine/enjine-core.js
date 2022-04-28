var canvas;
var context;

const resizeEvent = new Event("resize");
const startEvent = new Event("start");
const updateEvent = new Event("update");
const drawEvent = new Event("draw");

var MainCamera = new Camera();

window.onresize = _ => {
	canvas.dispatchEvent(resizeEvent);
}

document.addEventListener('contextmenu', event => event.preventDefault());

document.body.addEventListener("keydown", e => {
	Input.Keyboard.keys[e.keyCode].keypress = true;
	Input.Keyboard.keys[e.keyCode].keyup = false;
});
document.body.addEventListener("keyup", e => {
	Input.Keyboard.keys[e.keyCode].keypress = false;
	Input.Keyboard.keys[e.keyCode].keydown = false;
});

var Events = [];

var GameSettings = {
	EnableSmoothing: false,
	canvas: "#canvas",
	ClearColor: "#8dcaff",
	ShowColliders: false,
	Window: {
		width: 1000,
		height: 1000
	}
}

var GameState = {
	ContentLoaded: false
}
var Input = {
	Keyboard: {
		keys: [],
		IsKeyDown(k) {
			return Input.Keyboard.keys[k] == undefined ? false : Input.Keyboard.keys[k].keypress;
		},
		OnKeyDown(k) {
			var key = Input.Keyboard.keys[k];
			if (!key.keydown && key.keypress) {
				key.keydown = true;
				return true;
			}
			return false;
		},
		OnKeyUp(k) {
			var key = Input.Keyboard.keys[k];
			if (!key.keyup && !key.keypress) {
				key.keyup = true;
				return true;
			}
			return false;
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

function UpdateResolution() {
	canvas.width = GameSettings.Window.width;
	canvas.height = GameSettings.Window.height;
	
	MainCamera.resolution = new vec(canvas.width, canvas.height);
	MainCamera.UpdateAspectRatio();

	context.webkitImageSmoothingEnabled = GameSettings.EnableSmoothing;
	context.mozImageSmoothingEnabled = GameSettings.EnableSmoothing;
	context.imageSmoothingEnabled = GameSettings.EnableSmoothing;
}

window.onload = () => {
	canvas = document.querySelector(GameSettings.canvas);
	context = canvas.getContext("2d");

	UpdateResolution();

	Events.forEach(v => {
		canvas.addEventListener(v.event, v.func);
	});

	canvas.dispatchEvent(startEvent);

	Object.values(Keys).forEach(v => {
		Input.Keyboard.keys[v] = {
			keypress: false,
			keydown: false,
			keyup: true
		}
	});

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