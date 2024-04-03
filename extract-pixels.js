const fs = require('fs/promises');
const path = require('path');

(async () => {
	const files = await fs.readdir(process.argv[2]);
	files.sort();

	const combined = [];

	for (const filename of files) {
		const file = await fs.readFile(path.join(process.argv[2], filename), 'utf8');
		const lines = file.split('\n');
		const data = lines
			.map((line) =>
				(d => !d ? null : ({
					timestamp: d[1],
					x: d[2],
					y: d[3],
				}))(/(\d+),\((\-?\d+),(\-?\d+)\)/.exec(line))
			)
			.filter(d => !!d);

			for (const line of data) {
				combined.push(line);
			}
	}

	for (const line of combined.sort((a,b) => a.timestamp - b.timestamp)) {
		console.log(`${line.x},${line.y}`);
	}
})();
