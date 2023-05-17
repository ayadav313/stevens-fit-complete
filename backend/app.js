import express from 'express';
import swaggerMiddleware from './swagger.js';
import configRoutes from './routes/index.js';
import cors from 'cors';
import session from 'express-session';

const app = express();

// Mount Swagger middleware on /api-docs route
swaggerMiddleware(app);

// Configure application to parse JSON data in request bodies
app.use(express.json());
// app.use(cors());
app.use(cors({credentials: true, origin: 'http://localhost:3001'}));

app.use(
  session({
    name: 'AuthCookie',
    secret: 'superSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 2 * 60 * 60 * 1000},
  
  })
);

// Mount userRoutes middleware on /api/users route
//app.use('/api/users', userRoutes);

configRoutes(app);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
