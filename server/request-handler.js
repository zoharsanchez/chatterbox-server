/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var results = [];

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  var endpoints = ['/send', '/log', '/classes/messages'];
  var body = [];
  
  var responseBody = {
    headers: headers,
    method: request.method,
    url: request.url,
    results: results
  };

  // message sent by POST
  // var body = '';
  
  if (request.method === 'OPTIONS') {
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(responseBody));
  } else if (request.method === 'POST') {

    statusCode = 201;

    request.on('error', function(err) {
      console.error(err);
    });

    request.on('data', function(chunk) {
      body.push(chunk);
    });

    request.on('end', function() {
      body = Buffer.concat(body).toString();
      results.push(JSON.parse(body));

      response.writeHead(statusCode, headers);
      console.log(JSON.parse(JSON.stringify(responseBody)));
      response.end(JSON.stringify(responseBody));
    });
    
  } else if (endpoints.indexOf(request.url) === -1) {
    statusCode = 404;
    response.writeHead(statusCode, headers);
  } else if (request.method === 'GET') {
    console.log('in get');
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(responseBody));
  }

};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

module.exports.requestHandler = requestHandler;

