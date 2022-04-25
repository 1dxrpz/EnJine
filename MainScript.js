//import {EventHandler} from './Enjine/enjine-core.js';

var info = document.querySelector(".info");

LoadContent({
	PlayerSprite: "player.png",
	prop: "props.png"
});

var player = new GameObject();
var prop = new GameObject();

var gameObjects = [player, prop];

EventHandler("start", v => {
	GameSettings.EnableSmoothing = false;
	GameSettings.ShowColliders = false;

	player.animation = new Animation({
		spriteSheet: Content.PlayerSprite,
		frameCount: 7,
		animation: 1,
		animationSpeed: .1,
		spriteSize: new vec(50, 37)
	});
	player.collider = new Collider({
		offset: new vec(80, 150),
		scale: new vec(100, 30)
	});
	player.physics.slippery = .1;

	prop.animation = new Animation({
		spriteSheet: Content.prop,
		animation: 0,
		frame: 1,
		spriteSize: new vec(32, 32 * 2)
	});
	prop.collider = new Collider({
		offset: new vec(0, 96),
		scale: new vec(64, 32)
	});
	player.transform.scale = new vec(50 * 5, 37 * 5);
	player.transform.pivot = player.transform.scale.multiply(.5);
	prop.transform.scale = new vec(32 * 2, 32 * 4);
	player.transform.depth = 1;
	player.transform.position = new vec(100, 100);
	prop.transform.depth = 0;
});

EventHandler("update", v => {
	var _pos = player.transform.position
				.add(
					MainCamera.resolution
						.multiply(.5)
						.invert()
					)
				.add(player.transform.scale.multiply(.5));
	MainCamera.position = MainCamera.position.lerp(_pos, .1);
	
	if (player.collider.IsOverlapping(prop)) {
		player.collider.color = "#ff000077";
	} else {
		player.collider.color = "#00000077";
	}

	var direction = new vec();
	if (Input.Keyboard.IsKeyDown(Keys.d) && !player.IsCollideLeft(prop)) {
		direction.x = 1;
		player.animation.mirror.x = 1;
	}
	if (Input.Keyboard.IsKeyDown(Keys.a) && !player.IsCollideRight(prop)) {
		direction.x = -1;
		player.animation.mirror.x = -1;
	}
	if (Input.Keyboard.IsKeyDown(Keys.w) && !player.IsCollideBottom(prop)) {
		direction.y = -1;
	}
	if (Input.Keyboard.IsKeyDown(Keys.s) && !player.IsCollideTop(prop)) {
		direction.y = 1;
	}
	if (player.OnCollide(prop)) {
		player.physics.momentum = new vec();
	}
	var speed = direction.normalize().multiply(10);
	player.physics.velocity = speed;
	//player.physics.velocity = player.physics.velocity.lerp(speed, .1);

	player.transform.depth = player.transform.position.y + player.transform.scale.y < prop.transform.position.y + prop.transform.scale.y ? -1 : 1;

	info.innerHTML = player.transform.position;

	gameObjects
		.sort((a, b) => a.transform.depth - b.transform.depth)
		.forEach(v => v.Update());
});
EventHandler("draw", v => {
	gameObjects
		.forEach(v => v.Draw());
});