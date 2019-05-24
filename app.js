import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import routes from './server/routes';
import swaggerUi from 'swagger-ui-express';

dotenv.config();
const swaggerDocument = require('./documentation/swagger.json');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true,
}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
routes(app);

export default app;
