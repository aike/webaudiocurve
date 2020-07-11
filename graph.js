class Graph {
	constructor(canvas) {
		this.marginLeft = 80;
		this.marginRight = 30;
		this.marginTop = 20;
		this.marginBottom = 50;

		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.plotWidth = canvas.width - this.marginLeft - this.marginRight;
		this.plotHeight = canvas.height - this.marginTop - this.marginBottom;
		this.plotZeroX = this.marginLeft;
		this.plotZeroY = this.marginTop + this.plotHeight;
		this.plotMaxX = this.marginLeft + this.plotWidth;
		this.plotMaxY = this.marginTop;

		this.maxY = 1.2;
		this.maxX = 500;

		this.init();
	}

	init() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.lineWidth = 1;
		this.ctx.strokeStyle = 'rgb(50, 50, 50)';
		this.ctx.strokeRect(this.plotZeroX - 1, this.plotZeroY + 1, this.plotWidth + 2, -(this.plotHeight + 2));
	}

	drawHorizontalLine(y, col) {
		const ypos = this.plotZeroY - (this.plotHeight * y / this.maxY);
		this.ctx.strokeStyle = col;
		this.ctx.beginPath();
		this.ctx.moveTo(this.plotZeroX, ypos);
		this.ctx.lineTo(this.plotMaxX, ypos);
		this.ctx.closePath();
		this.ctx.stroke();
	}

	drawVerticalLine(x, col) {
		const xpos = this.plotZeroX + (this.plotWidth * x / this.maxX);
		this.ctx.strokeStyle = col;
		this.ctx.beginPath();
		this.ctx.moveTo(xpos, this.plotZeroY);
		this.ctx.lineTo(xpos, this.plotMaxY);
		this.ctx.closePath();
		this.ctx.stroke();
	}

	drawXLabel(x, val, offset) {
		if (offset === undefined) {
			offset = 0;
		}
		const xpos = this.plotZeroX + (this.plotWidth * x / this.maxX) - 3 * val.length;
		this.ctx.font = "12px serif";
		this.ctx.fillStyle = 'rgb(0,0,0)';
		this.ctx.fillText(val, xpos, this.plotZeroY + 20 + offset);
	}

	drawYLabel(y, val, offset) {
		if (offset === undefined) {
			offset = 0;
		}
		const ypos = this.plotZeroY - (this.plotHeight * y / this.maxY) + 6;
		this.ctx.font = "12px serif";
		this.ctx.fillStyle = 'rgb(0,0,0)';
		this.ctx.fillText(val, this.plotZeroX - 12 - 5 * val.length - offset, ypos);
	}

	plot(arr, start, len) {
		const width = Math.floor(this.plotWidth / len) + 1;
		this.ctx.beginPath();
		this.ctx.fillStyle = 'rgb(100,100,200)';
		for (let i = 0; i < len; i++) {
			const val = arr[start + i];
			const pos = this.plotZeroX + Math.floor(this.plotWidth * i / len);
			this.ctx.fillRect(pos, this.plotZeroY, width, - (this.plotHeight * val / this.maxY));
		}
	}
}