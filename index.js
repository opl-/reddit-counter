const fs = require('fs/promises');

async function getCurrentCount() {
	const response = await fetch("https://devvit-gateway.reddit.com/devvit.reddit.custom_post.v1alpha.CustomPost/RenderPost", {
		body: new Uint8Array([ 0, 0, 0, 0, 76, 10, 57, 10, 55, 10, 10, 95, 95, 112, 111, 115, 116, 68, 97, 116, 97, 18, 41, 42, 39, 10, 23, 10, 7, 116, 104, 105, 110, 103, 73, 100, 18, 12, 26, 10, 116, 51, 95, 49, 98, 116, 56, 102, 119, 51, 10, 12, 10, 6, 99, 111, 110, 102, 105, 103, 18, 2, 42, 0, 18, 2, 26, 0, 26, 11, 8, 192, 2, 16, 160, 2, 29, 0, 0, 128, 63, ]),
		headers: {
			"content-type": "application/grpc-web+proto",
			"devvit-actor": "main",
			"devvit-installation": "e4c7b4f5-9dcd-4098-a512-cb2c19958e7a",
			"x-grpc-web": "1",
			"x-user-agent": "grpc-web-javascript/0.1",
		},
		method: "post",
		referrer: "https://www.reddit.com/",
		referrerPolicy: "strict-origin-when-cross-origin",
	});

	const text = await response.text();

	const regexes = [
		/The counter is at: ([^.]+)\./,
		/The counter ([^.]+)\./,
	];

	for (const regex of regexes) {
		const match = text.match(regex);

		if (match) {
			return match[1];
		}
	}

	return null;
}

(async () => {
	const file = await fs.open(`./data/${Date.now()}.csv`, 'a+');
	const out = file.createWriteStream();

	setInterval(async () => {
		const time = Date.now();
		try {
			const count = await getCurrentCount();

			out.write(`${time},${count}\n`);
	
			console.log(`${new Date().toISOString()} ${count}`);
		} catch (ex) {
			console.error(`${new Date().toISOString()} error`, ex);
		}
	}, 1000);
})();
