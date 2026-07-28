import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "dbpractice",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/* ✅ Test DB connection */
export async function checkDBConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("✅ MySQL Database Connected Successfully!");
        connection.release(); // important
    } catch (error) {
        console.error("❌ Database Connection Failed:", error.message);
    }
}

// checkDBConnection();

export default pool;