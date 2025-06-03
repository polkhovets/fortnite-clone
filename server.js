const express = require('express');
const app = express();
const port = 8080;

app.use(express.static('public'));

// Add error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const server = app.listen(port, '0.0.0.0', (error) => {
    if (error) {
        console.error('Error starting server:', error);
        return;
    }
    console.log(`Game server running at http://localhost:${port}`);
}); 