import server from "./server";
import colors from "colors";
import db from "./config/db";

const port = process.env.PORT || 4000

export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
    } catch (error) {
        console.log(colors.red('connection error'))
    }
}
connectDB()

server.listen(port, () => {
    console.log(colors.cyan(`Rest API in port ${port}`))

})