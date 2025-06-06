import { sql } from "../utils/db.js";

export async function initDB() {
  try {
    await sql`
           CREATE TABLE IF NOT EXISTS users(
           id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
           username VARCHAR(50) UNIQUE NOT NULL,
           email VARCHAR(100) UNIQUE NOT NULL,
           password VARCHAR(255) NOT NULL,
           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
           )

           
          `;
    await sql`
          CREATE TABLE IF NOT EXISTS conversations(
           id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
           participant_one UUID REFERENCES users(id),
           participant_two UUID REFERENCES users(id),
           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
           )
          `;

          await sql`
          CREATE TABLE IF NOT EXISTS messages(
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          conversation_id UUID REFERENCES conversations(id),
          sender_id UUID REFERENCES users(id),
          content TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
          `;

    console.log("database set up successfully");
  } catch (error) {
    console.log("Error initializing database:", error);
  }
}
