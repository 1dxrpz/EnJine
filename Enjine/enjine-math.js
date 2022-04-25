var degToRad = Math.PI / 180;
var radToDeg = 180 / Math.PI;

class vec {
	x;
	y;
	constructor(x = 0, y = 0){
		this.x = x;
		this.y = y;
	}
	translate(e) {
		this.x += e.x;
		this.y += e.y;
		return this;
	}
	add(v) {
		var {x, y} = v;
		return new vec(this.x + x, this.y + y);
	}
	translate(v) {
		var {x, y} = v;
		this.x += x;
		this.y += y;
	}
	dotProduct(v) {
		var {x, y} = v;
		return new vec(this.x * x, this.y * y);
	}
	fromPolar(center, angle, length = 1) {
		this.x = Math.cos(degToRad * angle) * length + center.x;
		this.y = Math.sin(degToRad * angle) * length + center.y;
	}
	normalize() {
		var len = this.length();
		len = len == 0 ? 1 : len;
		return new vec(this.x / len, this.y / len);
	}
	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	rotate(angle) {
		var px = this.x * Math.cos(angle * degToRad) - this.y * Math.sin(angle * degToRad);
		var py = this.x * Math.sin(angle * degToRad) + this.y * Math.cos(angle * degToRad);
		return new vec(px, py);
	}
	rotateToward(v) {
		var {x, y} = v;
		return this.rotate((-Math.atan(y / x) - (x >= this.x ? 0 : Math.PI)) * radToDeg);
	}
	invert() {
		return new vec(-this.x, -this.y);
	}
	multiply(n) {
		return new vec(this.x * n, this.y * n);
	} 
	lerp(v, t) {
		var {x, y} = v;
		return new vec(this.x * (1 - t) + x * t, this.y * (1 - t) + y * t);
	}
	toString() {
		return `{x: ${Math.round(this.x * 100) / 100}; y: ${Math.round(this.y * 100) / 100}}`;
	}
}

function lerp(start, end, t) {
	return start * (1 - t) + end * t;
}