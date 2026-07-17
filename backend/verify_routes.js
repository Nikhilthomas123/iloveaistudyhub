const express = require('express');
const app = express();
app.use(express.json());

const apiRouter = require('./routers');
app.use('/api', apiRouter);

console.log('Routes loaded successfully.');
app._router.stack.forEach(layer => {
  if (layer.name === 'router') {
    layer.handle.stack.forEach(subLayer => {
      if (subLayer.name === 'router') {
        const prefix = subLayer.regexp.toString().replace('/^\\', '').replace('\\/?(?=\\/|$)/i', '').replace(/\\\//g, '/');
        subLayer.handle.stack.forEach(nestedLayer => {
          if (nestedLayer.route) {
            console.log(`Route: /api${prefix}${nestedLayer.route.path} [${Object.keys(nestedLayer.route.methods).join(', ').toUpperCase()}]`);
          }
        });
      }
    });
  }
});
process.exit(0);
