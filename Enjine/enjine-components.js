class Animation {
	spriteSheet = undefined;
	spriteSize = new vec();
	animation = 0;
	frame = 0;
	frameCount = 0;
	animationSpeed = 1;
	mirror = new vec(1, 1);
	constructor(e) {
		if (e != undefined) {
			var {spriteSheet, spriteSize, animation, animationSpeed, frameCount, frame} = e;
			this.spriteSheet = spriteSheet ?? this.spriteSheet;
			this.spriteSize = spriteSize ?? this.spriteSize;
			this.animation = animation ?? this.animation;
			this.frameCount = frameCount ?? this.frameCount;
			this.animationSpeed = animationSpeed ?? this.animationSpeed;
			this.frame = frame ?? this.frame;
		}
	}
	timer = 0;
	Update() {
		if (this.frame == this.frameCount - 1) {
			this.timer = 0;
			this.frame = 0;
		} else {
			this.timer += this.animationSpeed;
			this.frame = Math.floor(this.timer);
		}
	}
}
class Physics {
	velocity = new vec();
	momentum = new vec();
	slippery = .5;
	Update() {
		
	}
}
class Transform {
	position = new vec();
	rotation = 0;
	scale = new vec();
	depth = 0;
	pivot = new vec();
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
class Collider {
	offset = new vec();
	scale = new vec(32, 32);
	position = new vec();
	color = "#00000077";
	constructor(e) {
		if (e != undefined) {
			var {offset, scale} = e;
			this.offset = offset ?? this.offset;
			this.scale = scale ?? this.scale;
		}
	}
	IsOverlapping(c) {
		var {position, scale} = c.collider;
		return position.x < this.position.x + this.scale.x &&
	    position.x + scale.x > this.position.x &&
	    position.y < this.position.y + this.scale.y &&
	    position.y + scale.y > this.position.y;
	}
}

class GameObject {
	animation = new Animation();
	transform = new Transform();
	collider = new Collider();
	physics = new Physics();

	Left = 0;
	Right = 0;
	Top = 0;
	Bottom = 0;

	collisionOffset = 10;
	_colisionState = false;
	constructor() {}
	OnCollide(c) {
		var res = this.IsCollideLeft(c) || this.IsCollideTop(c) || this.IsCollideRight(c) || this.IsCollideBottom(c);
    		if (res && !this._colisionState) {
    			this._colisionState = true;
    			return this._colisionState;
    		}
    		if (!res) {
    			this._colisionState = false;
    		}
    	return false;
	}
	IsCollideLeft(c) {
		var vel = this.physics.velocity;
		return this.Right + vel.x > c.Left &&
			this.Left < c.Left &&
			this.Bottom - this.collisionOffset > c.Top + this.collisionOffset && 
			this.Top + this.collisionOffset < c.Bottom - this.collisionOffset;
	}
	IsCollideRight(c) {
		var vel = this.physics.velocity;
		return this.Left + vel.x < c.Right &&
			this.Right > c.Right &&
			this.Bottom - this.collisionOffset > c.Top + this.collisionOffset && 
			this.Top + this.collisionOffset < c.Bottom - this.collisionOffset;
	}
	IsCollideTop(c) {
		var vel = this.physics.velocity;
		return this.Bottom + vel.y > c.Top && 
			this.Top < c.Top &&
			this.Left + this.collisionOffset < c.Right - this.collisionOffset &&
			this.Right - this.collisionOffset > c.Left + this.collisionOffset;
	}
	IsCollideBottom(c) {
		var vel = this.physics.velocity;
		return this.Top + vel.y < c.Bottom && 
			this.Bottom > c.Bottom &&
			this.Left + this.collisionOffset < c.Right - this.collisionOffset &&
			this.Right - this.collisionOffset > c.Left + this.collisionOffset;
	}
	Draw() {
		var _screen = MainCamera.ScreenPosition(this.transform.position);
		if (!(_screen.x + this.transform.scale.x < 0 &&
			_screen.y + this.transform.scale.y < 0 &&
			_screen.x > MainCamera.resolution.x &&
			_screen.y > MainCamera.resolution.y) &&
			this.animation.spriteSheet != undefined) {
			context.save();
			context.translate(_screen.x + this.transform.pivot.x, _screen.y + this.transform.pivot.y);
			context.rotate(this.transform.rotation * degToRad);
			context.scale(this.animation.mirror.x, this.animation.mirror.y);
			context.translate(-_screen.x - this.transform.pivot.x, -_screen.y - this.transform.pivot.y);
			context.drawImage(
				this.animation.spriteSheet, 
				this.animation.frame * this.animation.spriteSize.x,
				this.animation.animation * this.animation.spriteSize.y,
				this.animation.spriteSize.x,
				this.animation.spriteSize.y, 
				_screen.x, 
				_screen.y,
				this.transform.scale.x,
				this.transform.scale.y
			);
			context.restore();

			var _colliderScreen = MainCamera.ScreenPosition(this.collider.position);

			if (GameSettings.ShowColliders) {
				context.fillStyle = this.collider.color;
				context.fillRect(_colliderScreen.x, _colliderScreen.y, this.collider.scale.x, this.collider.scale.y);
				context.fillStyle = "#00f6";
				context.fillRect(_colliderScreen.x + this.physics.velocity.x, _colliderScreen.y + this.physics.velocity.y, this.collider.scale.x, this.collider.scale.y);
			}

			if (this.animation.frameCount > 0 || this.animationSpeed > 0) {
				this.animation.Update();
			}
			this.physics.momentum = this.physics.momentum.lerp(this.physics.velocity, this.physics.slippery)
			this.physics.Update();
			this.transform.position.translate(this.physics.momentum);
		}
	}
	Update() {
		this.Left = this.collider.position.x;
		this.Right = this.collider.position.x + this.collider.scale.x;
		this.Top = this.collider.position.y;
		this.Bottom = this.collider.position.y + this.collider.scale.y;

		this.collider.position = this.transform.position.add(this.collider.offset);
	}
}