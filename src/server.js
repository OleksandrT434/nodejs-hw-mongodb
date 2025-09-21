import express from 'express';
import contactRouter from './routers/contacts.js';
import {errorHandler} from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const app = express();

app.set('json spaces', 2);
app.use(express.json());
app.use('/contacts', contactRouter)

export function setupServer() {

app.use(notFoundHandler);
app.use(errorHandler)
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
}
setupServer();
