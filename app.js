// Dollar sign is cool 😎
function $(element) {
	return document.getElementById(element);
}

class Grid {
	constructor(grid, canvas, ctx) {
		this.grid = grid;
		this.canvas = canvas;
		this.ctx = ctx;
		this.xOffset = 0;
		this.yOffset = 0;
		this.scale = 1;
	}

	draw() {
		this.ctx.fillStyle = "white";

		this.clear();
		for (let i = 0; i < this.grid.length; i++) {
			for (let j = 0; j < this.grid[i].length; j++) {
				const cell = this.grid[i][j];
				const length = 100 * this.scale - 10 * this.scale;
				this.ctx.fillRect(i * 100 * this.scale + this.xOffset, j * 100 * this.scale + this.yOffset, length, length);
			}
		}
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

function setup() {
	const map = $("map");
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

	// Setups listeners
	map.addEventListener("wheel", wheel => {
		wheel.preventDefault();

		// Calculates the new scale
		let newScale = grid.scale + wheel.deltaY * -0.0004;
		newScale = Math.min(Math.max(.125, newScale), 4);

		// Calculates the offset, so that
		// it zooms on the point where the cursor
		// is at.
		let x = (wheel.pageX - grid.xOffset) / grid.scale;
		let y = (wheel.pageY - grid.yOffset) / grid.scale;
		grid.xOffset -= x * newScale - x * grid.scale;
		grid.yOffset -= y * newScale - y * grid.scale;

		grid.scale = newScale;
		grid.draw();
	});

	map.addEventListener("mousemove", mouse => {
		if (mouse.buttons == 1) {
			grid.xOffset += mouse.movementX;
			grid.yOffset += mouse.movementY;
			grid.draw();
		}
	});

	window.onresize = () => {
		map.width = window.innerWidth;
		map.height = window.innerHeight;
		grid.draw();
	};

	grid.draw();
}

setup();
