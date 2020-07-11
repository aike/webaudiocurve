function over(d0, d1, val) {
	const sign1 = Math.sign(d0 - val);
	const sign2 = Math.sign(d1 - val);
	if (sign1 !== sign2) {
		return true;
	}
	return false;
}

window.addEventListener('load', (e) => {
	let algorithm;
	let val0;
	let val1;
	let duration;
	let pct63;
	let pct99;

	const graph = new Graph(document.querySelector('#drawarea'));
	const sound = new SoundGenerator();
	sound.setButton('#play');
	sound.beforeCallback = () => {
		graph.init();

		algorithm = document.querySelector('#algorithm').value;
		val0 = parseFloat(document.querySelector('#startvalue').value);
		val1 = parseFloat(document.querySelector('#endvalue').value);
		duration = parseFloat(document.querySelector('#duration').value);
		pct63 = val0 - (val0 - val1) * 0.632;
		pct99 = val0 - (val0 - val1) * 0.99;

		sound.algorithm = algorithm;
		sound.startValue = val0;
		sound.endValue = val1;
		sound.duration = duration;
	};
	sound.afterCallback = (data) => {
		// plot graph
		graph.plot(data, 0, data.length);

		// draw lines
		let minx = undefined;
		let pct63x = undefined;
		let pct99x = undefined;
		let maxx = undefined;
		for (let i = 1; i < data.length; i++) {
			if (minx === undefined && data[i] !== data[i - 1]) {
				minx = i;
			}
			if (pct63x === undefined && (over(data[i], data[i - 1], pct63))) {
				pct63x = i;
			}
			if (pct99x === undefined && (over(data[i], data[i - 1], pct99))) {
				pct99x = i;
			}
		}
		maxx = minx + 100 * 5;
		graph.maxX = data.length;
		graph.drawVerticalLine(minx, 'rgb(80,80,80)');
		graph.drawVerticalLine(pct99x, 'rgb(255,255,0)');
		graph.drawHorizontalLine(pct99, 'rgb(255,255,0)');

		// draw vertical grid
		for (let i = 0; i <= 5; i++) {
			const pos = minx + ((maxx - minx) / 5) * i;
			graph.drawVerticalLine(pos, 'rgb(180,180,180)');
			graph.drawXLabel(pos, i.toString());
		}
		graph.drawXLabel(graph.maxX, "sec");
		const pct99xtime = (pct99x - minx) / (maxx - minx) * 5;
		graph.drawXLabel(pct99x, pct99xtime.toFixed(3), 16);

		// draw horizontal grid
		for (let i = 0; i < 5; i++) {
			const pos = (i + 1) / 5;
			graph.drawHorizontalLine(pos, 'rgb(180,180,180)');
			graph.drawYLabel(pos, (1 / 5 * (i + 1)).toFixed(1));
		}
		graph.drawYLabel(0, "0");
		graph.drawYLabel(pct99, "99%", 24);
		graph.drawYLabel(graph.maxY, "vol");

		if (algorithm === 'setTargetAtTime') {
			graph.drawVerticalLine(pct63x, 'rgb(255,0,0)');
			graph.drawHorizontalLine(pct63, 'rgb(255,0,0)');
			graph.drawYLabel(pct63, "63%", 24);
			const pct63xtime = (pct63x - minx) / (maxx - minx) * 5;
			graph.drawXLabel(pct63x, pct63xtime.toFixed(3), 16);
		}
	};
});


