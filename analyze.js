const fs = require('fs/promises');

(async () => {
	const file = await fs.readFile(process.argv[2], 'utf8');
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

	const last = data[data.length - 1];

	function printStats(window) {
		const x30 = data.findLast((d) => ((d.timestamp + window * 1000) < last.timestamp));

		const x = x30.x - last.x;
		const y = x30.y - last.y;
	
		const dist = Math.sqrt(x*x + y*y);
		console.log(`[last ${window} seconds] distance: ${dist.toFixed(1)}; ${(dist / window).toFixed(1)}/s`);
	}

	printStats(10);
	printStats(30);
	printStats(60);
	printStats(120);
})();
