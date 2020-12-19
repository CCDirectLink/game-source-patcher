export default class GameSourcePatcher extends Plugin {
	constructor(mod) {
		super();
		this.mod = mod;
	}

	async preload() {
		const worker = new Worker('/' + this.mod.baseDirectory + '/worker.js');
		worker.terminate();
	}

	async postload() {

	}

	async prestart() {

	}
}
