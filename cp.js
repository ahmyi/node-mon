'use strict';
const cluster = require('cluster');

if(cluster.isWorker) {
	if(process.env.forkId == 0) {
		require('./workers/cp1');
	} else {
		require('./workers/cp2');
	}
	return;
}

const createWorker = function (forkId) {
	const worker = cluster.fork({
		forkId: '' + forkId
	});
	worker.forkId = '' + forkId;
	worker.on('exit', function (code, signal) {
		console.log('[error] Fork ' +forkId+ ' died, spawning replacement worker');
		setTimeout(function () {
			createWorker(forkId);
		}, 1000);
	});
	return worker;
};

createWorker(0);
createWorker(1);