import pool from "../service/mysqlDatabase.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllUserFilter = asyncHandler(async (req, res) => {
    try {
        const result = await pool.query("select * from users where city = 'Delhi'");
        res.status(200).json({ success: true, data: result[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
})

export const secondLargest = asyncHandler(async (req, res) => {
    try {
        const result = await pool.query(`
            select max(salary) from users where salary < (
                select max(salary) from users
            )
        `)
        res.status(200).json({ success: true, data: result[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
})