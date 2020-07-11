class SoundGenerator {
	constructor() {
		this.beforeCallback = undefined;
		this.afterCallback = undefined;

		this.startValue = undefined;
		this.endValue = undefined;
		this.duration = undefined;
		this.algorithm = undefined;

		this.playing = false;
	}

	setButton(id) {
		const button = document.querySelector(id);
		button.addEventListener('click', (e) => {
			if (this.playing) {
				return;
			}
			this.playing = true;

			if (this.beforeCallback !== undefined) {
				this.beforeCallback();
			}

			if (this.ctx === undefined) {
				window.AudioContext = window.AudioContext || window.webkitAudioContext;
				this.ctx = new AudioContext();
				this.osc = this.ctx.createOscillator();
				this.osc.frequency.value = 440;
				this.vol = this.ctx.createGain();
				this.osc.connect(this.vol);
				this.vol.connect(this.ctx.destination);
				this.osc.start();

				this.data = new Array(550);
			}

			this.vol.gain.value = 0.001;
			const t0 = this.ctx.currentTime + 0.2;
			this.vol.gain.setValueAtTime(this.startValue, t0);
			switch(this.algorithm) {
				case 'setValueAtTime':
					this.vol.gain.setValueAtTime(this.endValue, t0 + this.duration);
					break;
				case 'linearRampToValueAtTime':
					this.vol.gain.linearRampToValueAtTime(this.endValue, t0 + this.duration);
					break;
				case 'exponentialRampToValueAtTime':
					this.vol.gain.exponentialRampToValueAtTime(this.endValue, t0 + this.duration);
					break;
				case 'setTargetAtTime':
					this.vol.gain.setTargetAtTime(this.endValue, t0, this.duration);
					break;
				case 'setValueCurveAtTime2':
					this.vol.gain.setValueCurveAtTime(new Float32Array([this.startValue, this.endValue]), t0, this.duration);
					break;
				case 'setValueCurveAtTime4':
					this.vol.gain.setValueCurveAtTime(new Float32Array([this.startValue, 0.2, 0.8, this.endValue]), t0, this.duration);
					break;
				default:
					break;
			}
			this.vol.gain.setValueAtTime(0, t0 + 5);
			this.cnt = 0;
			this.timer = setInterval(() => {
				this.data[this.cnt++] = this.vol.gain.value;
				if (this.cnt >= this.data.length) {
					clearInterval(this.timer);
					if (this.afterCallback !== undefined) {
						this.afterCallback(this.data);
					}
					this.playing = false;
				}
			}, 10);
		});
	}
}