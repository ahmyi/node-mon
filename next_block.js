// Require the framework and instantiate it
const fastify = require('fastify')({ logger: false })
const scala = require('./services/scala');
let captured = {};
let lastHeight = {};
let logs = [];
fastify.get('/log',async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    const {log} = req.query;

    if(log) {
      // console.log(log);
      logs.push([parseInt(Date.now()/1000),log]);
      return await res.send("Ok");
    }

    return await res.send(logs);
})

fastify.get('/cp', async(req,res) => {
  const filePath = path.join(process.cwd(),'checkpoints.json');
  if(!fs.existsSync(filePath)) {
    return Promise.reject(new Error("Checkpoints.json not ready"));
  }

  return await reply.sendFile(filePath)
});
const blockHeaders = {};
fastify.get('/block', async(req,res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    const {height} = req.query;

    if(!height) {
      return Promise.reject(new Error("Missing height"));
    }
    let out;
    if(height in blockHeaders) {
      out = blockHeaders[height];
    } else {
      out = await scala.getBlock(height);
      if(out) {
        blockHeaders[height] = out;
      }
    }
    return await res.send(out.block_header);
});

fastify.get('/',async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    if('clear' in req.query) {
      captured = {};
      return await res.send("Cleared");
    }
    const {height, algo, diff} = req.query;
    let output = {};

    if(!height || !algo || !diff) {
      if(algo) {
        output[algo] = algo in captured ? captured[algo] : [];
      } else {
        output = captured;
      }
      return await res.send(output);
    }
    captured[algo] = algo in captured ? captured[algo] : [];
    lastHeight[algo] = algo in lastHeight ? lastHeight[algo] : 0;
    // if(lastHeight[algo] === 0 && parseInt(height) !== 1) {
    //   return await res.send("Not inserted");
    // }
    if(lastHeight[algo] >= parseInt(height) ||  parseInt(height) <= 0) {
      return Promise.reject(new Error("Not inserted"));
    }
    // console.log("New height " +height+ " for diff " + diff);
    captured[algo].push({
      height:parseInt(height),
      diff:parseInt(diff),
      ts: Date.now()
    });
    lastHeight[algo] = parseInt(height);
    return await res.send("Success");

});


// Run the server!
const start = async () => {
  console.log("Starting server");
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    setTimeout(start,500);
  }
};
start();