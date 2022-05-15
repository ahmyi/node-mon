const http = require('http');

const request = async (method, data = false) => await new Promise((resolve, reject) => {
	const postData = {"jsonrpc":"2.0","id":"0","method": method};
	if(data) {
		postData["params"] = data;
	}
	const postJson = JSON.stringify(postData);
	const options = {
		hostname: "localhost",
		port: 22822,
		method: 'POST',
		path: "/json_rpc",
		headers: {
			'Content-Type': 'application/json',
		  	'Content-Length': Buffer.byteLength(postJson)
		}
	};


	const req = http.request(options, res => {
		res.setEncoding('utf8');

		let chunk;;
		res.on('data', d => {
			if(!chunk) chunk = d;
			else chunk += d;
		});
		res.on('end', () => {
			let dbuff;
			if (typeof chunk === 'string') {
				dbuff = chunk;
			} else {
				dbuff = Buffer.from(chunk).toString();
			}
			let response;
			try {
				response = JSON.parse(dbuff);
			} catch (e) {
				return reject(new Error(e.message));
			}
			if (!response) return reject(new Error('No response for ' + method));
			if ('error' in response) return reject(new Error(response.error.message + " post : " + postJson));
			if (!('result' in response)) return reject(new Error('No response result ' + method));
			resolve(response.result);
		});
	});
	req.write(postJson);
	req.on('error', error => reject(error));
});


exports.getInfo = async () => await request('get_info').catch(e => {});  
    
exports.getBlocksByRange = async (start, end) => await request('get_block_headers_range', {"start_height":start,"end_height":end}).catch(e => {}); 

exports.getBlock = async height => await request('get_block', {"height":height}).catch(e => {});  
 