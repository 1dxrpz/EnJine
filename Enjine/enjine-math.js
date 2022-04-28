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
		return this.x * x + this.y * y;
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
class Color {
	static black = "#000";
	static blue = "#00f";
	static green = "#0f0";
	static cyan = "#0ff";
	static red = "#f00";
	static magenta = "#f0f";
	static yellow = "#ff0";
	static white = "#fff";
	static orange = "#FFA500";
	static aliceBlue = "#f0f8ff";
	static wheat = "#f5deb3";
	static tomato = "#ff6347";
	static gray = "#808080";
	static pink = "#ee82ee";
	static lightGray = "#d3d3d3";

	_color = "";
	constructor(a, b, c, d) {
		var _c = {r: a, g: b, b: c, a: d};

		if (d == undefined) {
			_c.a = 1;
			if (c == undefined) {
				_c = {r: a == undefined ? 0 : a,
					g: a == undefined ? 0 : a,
					b: a == undefined ? 0 : a,
					a: b == undefined ? 1 : b};
			}
		}
		this._color = `rgba(${_c.r}, ${_c.g}, ${_c.b}, ${_c.a})`;
	}
}
class Ray {
	origin = new vec();
	direction = new vec();
}

function lerp(start, end, t) {
	return start * (1 - t) + end * t;
}