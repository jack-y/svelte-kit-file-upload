import polka from 'polka';
import {handler} from '../build/handler.js';
import {uploadMiddleware} from './lib/uploadPlugin.mjs';

const app = polka();
const port = 3000;

app.use(uploadMiddleware);
app.all('*', handler);

app.listen(port);
console.log('Polka server running on port', port);
console.log('http://localhost:' + port);
