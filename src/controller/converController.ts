import { sql } from "../utils/db.js";
import TryCatch from "../utils/TryCatch.js";

export const converController = TryCatch(async(req,res)=>{
     let userId = null;

     if(req.user){
          userId = req.user.id;
     }

     const result = await sql`
     SELECT c.id AS conversation_id, u.username AS paticipant_name, m.content AS last_message, m.created_at AS last_message_time
     FROM conversations c
     JOIN users u ON (u.id = c.participant_two AND u.id != ${userId})
     LEFT JOIN LATERAL(
     SELECT content,created_at
     FROM messages
     WHERE conversation_id=c.id
     ORDER BY created_at DESC
     LIMIT 1
     ) m ON true
     WHERE c.participant_one = ${userId} OR c.participant_two = ${userId}
     ORDER BY m.created_at DESC
     `

     res.json(result);
})