// Require the framework and instantiate it
const fastify = require('fastify')({ logger: false })
const Redis = require('ioredis');
const redis = new Redis();

fastify.get('/block', async(req,res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    let {height} = req.query;

    if(!height) {
      return Promise.reject(new Error("Missing height"));
    }
    height = parseInt(height);
    const count = await redis.zcard("checkpoint");
    if(height > count) {
       return Promise.reject(new Error("Invalid height"));
    }

    const resp = await redis.zrange('checkpoint', (height-1), height);
    const last = JSON.parse(resp[0]);
    const output = JSON.parse(resp[1]);
    output.block_time = output.timestamp - last.timestamp;
    return await res.send(output);
});

fastify.get('/',async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    const count = await redis.zcard("checkpoint");
    return await res.send({
        count
    });
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