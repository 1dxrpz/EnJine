class Animation {
	_parent = undefined;
	name = "animation";
	enabled = true;

	spriteSheet = undefined;
	spriteSize = new vec();
	animation = 0;
	frame = 0;
	frameCount = 0;
	animationSpeed = 0;
	mirror = new vec(1, 1);
	constructor(e) {
		this.SetAnimation(e);
	}
	timer = 0;
	SetAnimation(e) {
		if (e != undefined) {
			var {spriteSheet, spriteSize, animation, animationSpeed, frameCount, frame} = e;
			this.spriteSheet = spriteSheet ?? this.spriteSheet;
			this.spriteSize = spriteSize ?? this.spriteSize;
			this.animation = animation ?? this.animation;
			this.frameCount = frameCount ?? this.frameCount;
			this.animationSpeed = animationSpeed ?? this.animationSpeed;
			this.frame = frame ?? this.frame;
		}
		this.timer = 0;
	}
	Update() {
		if (this.frameCount > 0 && this.animationSpeed > 0 && this.enabled) {
			if (this.frame >= this.frameCount - 1) {
				this.timer = 0;
				this.frame = 0;
			} else {
				this.timer += this.animationSpeed;
				this.frame = Math.floor(this.timer);
			}
		}
	}
	Pause = _ => this.enabled = false;
	Play = _ => this.enabled = true;
	Toggle = _ => this.enabled = !this.enabled;
}
class Physics {
	_parent = undefined;
	name = "physics";
	enabled = true;

	velocity = new vec();
	momentum = new vec();
	force = new vec();

	mass = 1;
	immovable = false;
	slippery = .5;
	constructor(e) {
		if (e != undefined) {
			var {slippery, immovable, mass} = e;
			this.slippery = slippery ?? this.slippery;
			this.immovable = immovable ?? this.immovable;
			this.mass = mass ?? this.mass;
		}
	}
	Update() {
		this.velocity = this.velocity.lerp(new vec(), this.slippery);
		this.momentum = this.momentum.lerp(this.velocity, this.slippery);
		this._parent.GetComponent('transform').position.translate(this.momentum);
	}
	ApplyForce(r) {
		if (!this.immovable)
			this.velocity = r.multiply(1 / this.mass);
	}
}
class Transform {
	_parent = undefined;
	name = "transform";
	enabled = true;

	position = new vec();
	rotation = 0;
	scale = new vec();
	depth = 0;
	pivot = new vec();
	constructor(e) {
		if (e != undefined) {
			var {position, rotation, scale, depth, pivot} = e;
			this.position = position ?? this.position;
			this.rotation = rotation ?? this.rotation;
			this.scale = scale ?? this.scale;
			this.depth = depth ?? this.depth;
			this.pivot = pivot ?? this.pivot;
		}
	}
	Update() {}
}
class Collider {
	_parent = undefined;
	name = "collider";
	enabled = true;

	offset = new vec();
	scale = new vec(32, 32);
	position = new vec();
	color = "#00000077";

	Left = 0;
	Right = 0;
	Top = 0;
	Bottom = 0;
	
	collisionOffset = 10;
	_colisionState = false;
	constructor(e) {
		if (e != undefined) {
			var {offset, scale} = e;
			this.offset = offset ?? this.offset;
			this.scale = scale ?? this.scale;
		}
	}
	Update() {
		this.Left = this.position.x;
		this.Right = this.position.x + this.scale.x;
		this.Top = this.position.y;
		this.Bottom = this.position.y + this.scale.y;

		this.position = this._parent.GetComponent('transform').position.add(this.offset);
	}
	IsOverlapping(c) {
		if (!c.HasComponent('collider'))
			return false;
		var {position, scale} = c.GetComponent('collider');
		return this.enabled && position.x < this.position.x + this.scale.x &&
	    position.x + scale.x > this.position.x &&
	    position.y < this.position.y + this.scale.y &&
	    position.y + scale.y > this.position.y;
	}
	OnCollide(c, f) {
		if (!c.HasComponent('collider'))
			return false;
		var res = (this.IsCollideLeft(c) || this.IsCollideTop(c) || this.IsCollideRight(c) || this.IsCollideBottom(c));
    		if (res && !this._colisionState) {
    			this._colisionState = true;
    			if (f != undefined) f();
    			return this._colisionState;
    		}
    		if (!res) {
    			this._colisionState = false;
    		}
    	return false;
	}
	IsCollideLeft(c) {
		if (!c.HasComponent('collider'))
			return false;
		var vel = this._parent.GetComponent('physics').velocity;
		var _c = c.GetComponent('collider');
		return this.enabled && this.Right + vel.x > _c.Left &&
			this.Left < _c.Left &&
			this.Bottom - this.collisionOffset > _c.Top + this.collisionOffset && 
			this.Top + this.collisionOffset < _c.Bottom - this.collisionOffset;
	}
	IsCollideRight(c) {
		if (!c.HasComponent('collider'))
			return false;
		var _c = c.GetComponent('collider');
		var vel = this._parent.GetComponent('physics').velocity;
		return this.enabled && this.Left + vel.x < _c.Right &&
			this.Right > _c.Right &&
			this.Bottom - this.collisionOffset > _c.Top + this.collisionOffset && 
			this.Top + this.collisionOffset < _c.Bottom - this.collisionOffset;
	}
	IsCollideTop(c) {
		if (!c.HasComponent('collider'))
			return false;
		var _c = c.GetComponent('collider');
		var vel = this._parent.GetComponent('physics').velocity;
		return this.enabled && this.Bottom + vel.y > _c.Top && 
			this.Top < _c.Top &&
			this.Left + this.collisionOffset < _c.Right - this.collisionOffset &&
			this.Right - this.collisionOffset > _c.Left + this.collisionOffset;
	}
	IsCollideBottom(c) {
		if (!c.HasComponent('collider'))
			return false;
		var _c = c.GetComponent('collider');
		var vel = this._parent.GetComponent('physics').velocity;
		return this.enabled && this.Top + vel.y < _c.Bottom && 
			this.Bottom > _c.Bottom &&
			this.Left + this.collisionOffset < _c.Right - this.collisionOffset &&
			this.Right - this.collisionOffset > _c.Left + this.collisionOffset;
	}
}
class Trigger extends Collider{
	_parent = undefined;
	name = "trigger";

	constructor(e) {
		super(e);
	}
}
class Shadow {
	_parent = undefined;
	name = "shadow";
	enabled = true;

	radius = 100;
	color = new Color();

	constructor(e) {
		if (e != undefined) {
			var {radius, color} = e;
			this.radius = radius ?? this.radius;
			this.color = color ?? this.color;
		}
	}
	Update = () => {}
}

class GameObject {
	components = {};

	constructor() {}

	AddComponent(c) {
		c._parent = this;
		this.components[c.name] = c;
	}
	GetComponent(n) {
		return this.components[n];
	}
	HasComponent = (n) => this.components[n] != undefined; 
	Draw() {
		if (this.HasComponent('transform') && this.HasComponent('animation')) {
			var _tr = this.GetComponent('transform');
			var _an = this.GetComponent('animation');
			var _screen = MainCamera.ScreenPosition(_tr.position);
			if (!(_screen.x + _tr.scale.x < 0 &&
				_screen.y + _tr.scale.y < 0 &&
				_screen.x > MainCamera.resolution.x &&
				_screen.y > MainCamera.resolution.y) &&
				_an.spriteSheet != undefined) {

				if (this.HasComponent('shadow')) {
					var _sh = this.GetComponent('shadow');

					context.fillStyle = _sh.color._color;
					context.beginPath();
					context.ellipse(_screen.x + _tr.pivot.x, _screen.y + _tr.scale.y, _sh.radius, _sh.radius / 2, 0, 0, Math.PI * 2);
					context.fill();
				}

				context.save();
				context.translate(_screen.x + _tr.pivot.x, _screen.y + _tr.pivot.y);
				context.rotate(_tr.rotation * degToRad);
				context.scale(_an.mirror.x, _an.mirror.y);
				context.translate(-_screen.x - _tr.pivot.x, -_screen.y - _tr.pivot.y);
				context.drawImage(
					_an.spriteSheet,
					_an.frame * _an.spriteSize.x,
					_an.animation * _an.spriteSize.y,
					_an.spriteSize.x,
					_an.spriteSize.y, 
					_screen.x, 
					_screen.y,
					_tr.scale.x,
					_tr.scale.y
				);
				context.restore();

				if (this.HasComponent('collider')) {
					var _col = this.GetComponent('collider');
					if (GameSettings.ShowColliders && _col.enabled) {
						var _colliderScreen = MainCamera.ScreenPosition(_col.position);
						context.fillStyle = _col.color;
						context.fillRect(_colliderScreen.x, _colliderScreen.y, _col.scale.x, _col.scale.y);
					}
				}
				if (this.HasComponent('trigger')) {
					var _trig = this.GetComponent('trigger');
					if (GameSettings.ShowColliders && _trig.enabled) {
						var _triggerScreen = MainCamera.ScreenPosition(_trig.position);
						context.fillStyle = "#00f6";
						context.fillRect(_triggerScreen.x, _triggerScreen.y, _trig.scale.x, _trig.scale.y);
					}
				}
			}
		}
	}
	Update() {
		Object.values(this.components).forEach(v => v.Update());
	}
}
class Camera {
	position = new vec();
	resolution = new vec();
	aspect = 1;
	UpdateAspectRatio() {
		this.aspect = this.resolution.x / this.resolution.y;
	}
	ScreenPosition(v) {
		return v.add(this.position.invert());
	}
}
class Sound {
	source = "";

	_audio;
	constructor(e) {
		_audio = new Audio();
		
		if (e != undefined) {
			var {source} = e;
			this.source = source ?? this.source;

		}
	}
	Play() {

	}
}

class SoundEmitter {
	_sound = undefined;
	_emitState = false;

	randomize = false;
	delay = 100;
	source = [""];
	volume = 1;
	constructor(e) {
		if (e != undefined) {
			var {source, delay, randomize, volume} = e;
			this.source = source ?? this.source;
			this.delay = delay ?? this.delay;
			this.randomize = randomize ?? this.randomize;
			this.volume = volume ?? this.volume;
		}
	}
	Play() {
		if (!this._emitState) {
			this._sound = new Audio();
			if (!this.randomize) {
				this._sound.src = this.source[0];
			} else {
				var r = Math.round(Math.random() * (this.source.length - 1));
				this._sound.src = this.source[r];
			}
			this._sound.volume = this.volume;
			this._emitState = true;
			this._sound.play();
			setTimeout(_ => {
				this._emitState = false;
			}, this.delay);
		}
	}
}

class TileMap {
	visible = true;
	position = new vec();
	size = new vec(256, 256);

	source = undefined;
	tileSize = new vec(32, 32);

	tileCount = new vec();
	map = [];

	constructor() {
		
	}
	Update() {

	}
	Draw() {
		if (this.source != undefined) {
			this.tileCount = new vec(this.source.width / this.tileSize.x, this.source.height / this.tileSize.y);
			for (var y = 0; y < this.map.length; y++) {
				for (var x = 0; x < this.map[y].length; x++) {
					var _tile = this.map[y][x];
					var _screen = MainCamera.ScreenPosition(this.position.add(new vec(x * this.size.x, y * this.size.y)));
					context.drawImage(
						this.source,
						(_tile % this.tileCount.x) * this.tileSize.x,
						Math.floor(_tile / this.tileCount.y) * this.tileSize.y,
						this.tileSize.x,
						this.tileSize.y,
						_screen.x,
						_screen.y,
						this.size.x,
						this.size.y
					);
				}
			}
		}
	}
}