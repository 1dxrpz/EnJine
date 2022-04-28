//import {EventHandler} from './Enjine/enjine-core.js';

var info = document.querySelector(".info");

LoadContent({
	PlayerSprite: "player.png",
	PlayerRun: "player_run.png",
	prop: "props.png",
	ground: "ground.png"
});

var player = new GameObject();
var prop = new GameObject();
var ground = new TileMap();

var gameObjects = [prop, player];

EventHandler("resize", v => {
	GameSettings.Window.width = window.innerWidth;
	GameSettings.Window.height = window.innerHeight;
	UpdateResolution();
})
var sound;
EventHandler("start", v => {
	
	GameSettings.EnableSmoothing = false;
	GameSettings.ShowColliders = false;
	GameSettings.Window.width = window.innerWidth;
	GameSettings.Window.height = window.innerHeight;

	UpdateResolution();

	player.AddComponent(new Animation({
		spriteSheet: Content.PlayerSprite,
		frameCount: 4,
		animation: 0,
		animationSpeed: .1,
		spriteSize: new vec(50, 37)
	}));
	player.AddComponent(new Collider({
		offset: new vec(80, 150),
		scale: new vec(100, 30)
	}));
	player.AddComponent(new Physics({
		slippery: .25
	}));
	player.AddComponent(new Transform({
		scale: new vec(50 * 5, 37 * 5),
		depth: 1,
		pivot: new vec(50 * 5 / 2, 37 * 5 / 2),
		position: new vec(100, 100)
	}));
	player.AddComponent(new Trigger({
		offset: new vec(80, 150),
		scale: new vec(100, 30)
	}));
	player.AddComponent(new Shadow({
		radius: 40,
		color: new Color(0, .1)
	}));

	prop.AddComponent(new Animation({
		spriteSheet: Content.prop,
		animation: 0,
		frame: 1,
		spriteSize: new vec(32, 32 * 2)
	}));
	prop.AddComponent(new Collider({
		offset: new vec(0, 96),
		scale: new vec(64, 32)
	}));
	prop.AddComponent(new Transform({
		scale: new vec(32 * 2, 32 * 4),
		depth: 0
	}));
	prop.AddComponent(new Physics({
		mass: 1,
		slippery: .15
	}));
	ground.source = Content.ground;
	ground.map = [
		[29,0,0,7,0],
		[0,0,13,0,9],
		[0,17,54,60,61],
		[28,42,32,41,52],
		[0,0,57,56,0]
	];
	ground.size = new vec(128, 128);
	sound = new SoundEmitter({
		source: ["step1.mp3", "step2.mp3", "step3.mp3"],
		delay: 400,
		randomize: true,
		volume: .01
	});
});

function playsound() {
	var test = new Audio();
	var random = Math.round(Math.random() * 2);
	test.src = `step${random + 1}.mp3`;
	test.play().then(_ => {
	});
}

EventHandler("update", v => {	
	var _pos = player.GetComponent('transform').position
				.add(
					MainCamera.resolution
						.multiply(.5)
						.invert()
					)
				.add(player.GetComponent('transform').scale.multiply(.5));
	MainCamera.position = MainCamera.position.lerp(_pos, .1);
	
	if (player.GetComponent('collider').IsOverlapping(prop)) {
		player.GetComponent('collider').color = "#ff000077";
	} else {
		player.GetComponent('collider').color = "#00000077";
	}
	
	if ((Input.Keyboard.OnKeyUp(Keys.d) || Input.Keyboard.OnKeyUp(Keys.a) || Input.Keyboard.OnKeyUp(Keys.s) || Input.Keyboard.OnKeyUp(Keys.w))
		&& !Input.Keyboard.IsKeyDown(Keys.d) && !Input.Keyboard.IsKeyDown(Keys.a) && !Input.Keyboard.IsKeyDown(Keys.s) && !Input.Keyboard.IsKeyDown(Keys.w)) {
		player.GetComponent('animation').SetAnimation({
			frameCount: 4,
			animation: 0,
			spriteSheet: Content.PlayerSprite
		});
	}
	if (Input.Keyboard.OnKeyDown(Keys.d) || Input.Keyboard.OnKeyDown(Keys.w) || Input.Keyboard.OnKeyDown(Keys.a) || Input.Keyboard.OnKeyDown(Keys.s)) {
		player.GetComponent('animation').SetAnimation({
			frameCount: 6,
			animation: 0,
			spriteSheet: Content.PlayerRun
		});
	}
	
	player.GetComponent('collider').OnCollide(prop, _ => {
		player.GetComponent('physics').momentum = new vec(0, 0);
	});

	var direction = new vec();
	var force = new vec();
	if (Input.Keyboard.IsKeyDown(Keys.d)) {
		if (!player.GetComponent('collider').IsCollideLeft(prop))
			direction.x = 1;
		force.x = 1;
		player.GetComponent('animation').mirror.x = 1;
		sound.Play();
	}
	if (Input.Keyboard.IsKeyDown(Keys.a)) {
		if (!player.GetComponent('collider').IsCollideRight(prop))
			direction.x = -1;
		force.x = -1;
		player.GetComponent('animation').mirror.x = -1;
		sound.Play();
	}
	if (Input.Keyboard.IsKeyDown(Keys.w)) {
		if (!player.GetComponent('collider').IsCollideBottom(prop))
			direction.y = -1;
		force.y = -1;
		sound.Play();
	}
	if (Input.Keyboard.IsKeyDown(Keys.s)) {
		if (!player.GetComponent('collider').IsCollideTop(prop))
			direction.y = 1;
		force.y = 1;
		sound.Play();
	}
	
	var speed = direction.normalize().multiply(10);
	player.GetComponent('physics').velocity = speed;
	player.GetComponent('physics').force = force.normalize().multiply(10);

	if (player.GetComponent('collider').IsOverlapping(prop)) {
		prop.GetComponent('physics').ApplyForce(player.GetComponent('physics').force);
	}
	var _pt = player.GetComponent('transform');
	_pt.depth = _pt.position.y + _pt.scale.y < prop.GetComponent('transform').position.y + prop.GetComponent('transform').scale.y ? -1 : 1;
	/*

	info.innerHTML = player.transform.position;
	*/
	gameObjects
		.sort((a, b) => a.GetComponent('transform').depth - b.GetComponent('transform').depth)
		.forEach(v => v.Update());
});

EventHandler("draw", v => {
	ground.Draw();
	gameObjects
		.forEach(v => v.Draw());
});