import { exit } from 'node:process'
import db from '../config/db'
import colors from 'colors'

export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
    } catch (error) {
        console.log(colors.red('connection error'))
    }
}
connectDB()

const clearDB = async () => {
    try {
        await db.sync({ force: true })
        console.log('Data deleted successfully')
        exit()
    } catch (error) {
        console.log(error)
        exit(1)
    }
}

if (process.argv[2] === '--clear') {
    clearDB()
}