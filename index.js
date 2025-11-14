const express = require('express');
const proxy = require('express-http-proxy');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to log requests
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Proxy setup for the /launch path
app.use('/launch', proxy('https://stoppedwummpython.github.io', {
    // Filter to exclude specific paths from being proxied
    filter: function(req, res) {
        // Exclude the root of /launch and index.html
        return req.path !== '/' && req.path !== '/index.html';
    },
    // Resolve the path for the proxy request
    proxyReqPathResolver: function(req) {
        // This combines the original path from the /launch request
        // e.g., if the request is to /launch/bootstrap.js, the path will be /eageag/eaglercraft_wasm_client/bootstrap.js
        return `/eageag/eaglercraft_wasm_client${req.url}`;
    }
}));

// A simple route for the root of the server
app.get('/', (req, res) => {
    res.send('This is the main page. Go to /launch to see the proxied content (except index.html).');
});

// It's good practice to have a local handler for the path you are excluding from the proxy
app.get('/launch/', (req, res) => {
    res.send('This is the launch index, which is not proxied.');
});

app.get("/bootstrap", (req,res) => {
    res.sendFile(path.join(__dirname, "node_modules/bootstrap/dist/css/bootstrap.min.css"))
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});