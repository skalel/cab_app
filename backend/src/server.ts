require('dotenv').config()

import express from 'express'
import cors from 'cors';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use(routes);

app.listen(PORT, () => {
  console.log('Server running on port '+ PORT +'.'+' '+'http://localhost:'+PORT);
})
