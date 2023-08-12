import { sql } from "../database/database.js";

const lastFive = async () => {
    return await sql`SELECT * FROM messages ORDER BY id DESC LIMIT 5`;
}

const create = async (id, sender, message) => {
    await sql`INSERT INTO messages (id, sender, message) VALUES (${id}, ${sender}, ${message})`;
}

export { lastFive, create }