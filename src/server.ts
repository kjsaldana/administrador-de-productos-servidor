import express, { Express } from 'express'
import router from './router'

import swaggerUi from 'swagger-ui-express'
import swaggerSpec, { swaggerUiOptions } from './config/swagger'
import cors, { CorsOptions } from 'cors'
import morgan from 'morgan'


const server: Express = express()

const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        const whitelist = [process.env.FRONTEND_URL];

        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("conexion no permitida"));
        }
    }
}

server.use(cors(corsOptions))

server.use(express.json())

server.use(morgan('dev'))

server.use('/api/products', router)

server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

export default server