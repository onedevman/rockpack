import http from 'http';

const port = 3005;

const requestHandler = (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', '*');
  response.setHeader('Access-Control-Allow-Headers', 'origin, content-type');
  response.writeHead(200, { 'Content-Type': 'application/json' });
  const otherArray = ['item1', 'item2'];
  const otherObject = { item1: 'item1val', item2: 'item2val' };
  const json = JSON.stringify({
    anObject: otherObject,
    anArray: otherArray,
    another: 'item'
  });
  response.end(json);
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
});
