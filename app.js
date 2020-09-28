// Dollar sign is cool
function $(element) {
	return document.getElementById(element);
}

const map = $("map");

let scale = 1;
let xOffset = 0;
let yOffset = 0;
let xAnchor = 0;
let zAnchor = 0;

class Grid {
	constructor(grid, canvas, ctx) {
		this.grid = grid;
		this.canvas = canvas;
		this.ctx = ctx;
	}

	draw() {
		this.clear();
		for (let i = 0; i < this.grid.length; i++) {
		for (let j = 0; j < this.grid[i].length; j++) {
			const cell = this.grid[i][j];
			this.ctx.fillStyle = "white";
			this.ctx.fillRect(i*100*scale + xOffset, j*100*scale+yOffset, 100*scale-10*scale, 100*scale-10*scale);
		}
		}
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

function setup() {
	const ctx = map.getContext("2d");

	// Sets the canvas to fit the whole page (can't do that via CSS)
	map.width = window.innerWidth;
	map.height = window.innerHeight;

	// Creates the grid
	let grid = new Grid([
		[1, 0, 1, 0],
		[0, 1, 0, 1],
		[1, 0, 1, 0],
		[0, 1, 0, 1]
	], map, ctx);

	map.addEventListener("wheel", wheel => {
		wheel.preventDefault();

		// Calculates the new scale
		let newScale = scale + wheel.deltaY * -0.0004;
		newScale = Math.min(Math.max(.125, newScale), 4);

		// Calculates the offset, so that
		// it zooms on the point where the cursor
		// is at.
		let x = (wheel.pageX-xOffset)/scale;
		let y = (wheel.pageY-yOffset)/scale;
		xOffset -= x*newScale-x*scale;
		yOffset -= y*newScale-y*scale;

		scale = newScale;
		grid.draw();
	});

	map.addEventListener("mousemove", mouse => {
        if (mouse.buttons == 1) {
			xOffset += mouse.movementX;
			yOffset += mouse.movementY;
			grid.draw();
        }
	});

	grid.draw();
}

window.onresize = () => {
	map.width = window.innerWidth;
	map.height = window.innerHeight;
	grid.draw();
};

setup();
