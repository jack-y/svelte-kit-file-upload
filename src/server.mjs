import polka from 'polka';
import {assetsMiddleware, kitMiddleware, prerenderedMiddleware} from '../build/middlewares.js';
import {uploadMiddleware} from './lib/uploadPlugin.mjs';

const app = polka();
const port = 3000;

app.use(uploadMiddleware);
app.all('*', assetsMiddleware, prerenderedMiddleware, kitMiddleware);

app.listen(port);
console.log('Polka server running on port', port);
console.log('http://localhost:' + port);
