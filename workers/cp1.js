'use strict';
const Redis = require('ioredis');
const redis = new Redis();
const scala = require('../services/scala');
const path = require('path');
const fs = require('fs');

const splitBy = 10;
const perBlockCP = 0;
const syncTime = 10000;
let lastInsertedHeight = 0;

const main = async () => {
	const info = await scala.getInfo();
	if(!info) return;
	if(!("height" in info)) return;
	if(!info.height) return;

	const currentHeight =  parseInt(info.height);
	if(lastInsertedHeight > currentHeight) return;
	
	let i = await redis.zcard("checkpoint");

	while(i < (currentHeight - 2)) {
		const start = i;
		let end = start + splitBy; 
		if(end < lastInsertedHeight) continue;
		if(end > currentHeight) end = currentHeight -1;

		const blocks = await scala.getBlocksByRange(start, end);
		if(!blocks) {
			console.log("No blocks avaliable ", start, end, currentHeight);
			break;
		}
		if(!('headers' in blocks))  {
			console.log("No blocks header avaliable ", start, end, currentHeight);
			break;
		}

		for(let block of blocks.headers) {
			if(!('height' in block)) continue;
			if(!('hash' in block)) continue;
			
			const height = parseInt(block.height);
			if (!height || height <= 0 || height <= lastInsertedHeight) {
				continue;
			}
			if(perBlockCP !== 0 && height % perBlockCP !== 0 ) {
				continue;
			}
			await redis.zadd("checkpoint", height, JSON.stringify(block));
			console.log(block.hash, block.height, block.wide_cumulative_difficulty);
		}
		i=end;
	}
};
const sleep = async time => await new Promise((resolve,reject) => setTimeout(resolve,time));
(async() =>{
	while(true) {
		await main().catch(console.log);
		await redis.save();
		await sleep(syncTime);
	}
})();