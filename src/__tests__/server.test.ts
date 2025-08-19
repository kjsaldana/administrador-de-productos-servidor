import { connectDB } from "../server"
import db from '../config/db'

jest.mock('../config/db')

describe('connect DB', () => {
    it('Should handle database connection error', async () => {
        jest.spyOn(db, 'authenticate').mockRejectedValueOnce(new Error('connection error'))
        const consoleSpy = jest.spyOn(console, 'log')

        await connectDB()

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('connection error'))
    })
})