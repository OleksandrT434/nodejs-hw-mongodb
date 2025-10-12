import express from 'express';
import contactRouter from './routers/contacts.js';
import {errorHandler} from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';
import { auth } from './middlewares/authenticate.js';
import path from 'node:path';

const app = express();

app.use(cookieParser());
app.use('/photos', express.static(path.resolve('src/uploads/photos')));
app.set('json spaces', 2);
app.use(express.json());
app.use('/contacts', auth, contactRouter)
app.use('/auth', authRouter);


export function setupServer() {

app.use(notFoundHandler);
app.use(errorHandler)
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
}
setupServer();
