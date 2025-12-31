import express, { Express } from 'express'
import router from './router'
import db from './config/db'
import colors from 'colors'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec, { swaggerUiOptions } from './config/swagger'
import cors, { CorsOptions } from 'cors'
import morgan from 'morgan'


export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        // console.log(colors.blue('connection success'))
    } catch (error) {
        // console.log(error)
        console.log(colors.red('connection error'))
    }
}
connectDB()

const server: Express = express()

const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if (!origin || origin === process.env.FRONTEND_URL) {
            callback(null, true)
        } else {
            callback(new Error("conexion no permitida"))
        }
    }
}

server.use(cors(corsOptions))

server.use(express.json())

server.use(morgan('dev'))

server.use('/api/products', router)

server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

export default server