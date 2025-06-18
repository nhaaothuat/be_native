import { sql } from "../utils/db.js";
import TryCatch from "../utils/TryCatch.js";

export const converController = TryCatch(async(req,res)=>{
     let userId = null;

     if(req.user){
          userId = req.user.id;
     }

   const result = await sql`
    SELECT 
      c.id AS conversation_id,
      u.username AS participant_name,
      m.content AS last_message,
      m.created_at AS last_message_time
    FROM conversations c
    -- Join để lấy người còn lại (participant), không phải user hiện tại
    JOIN users u 
      ON (
        (u.id = c.participant_one AND u.id != ${userId}) OR 
        (u.id = c.participant_two AND u.id != ${userId})
      )
    -- Join lateral để lấy tin nhắn mới nhất
    LEFT JOIN LATERAL (
      SELECT content, created_at
      FROM messages
      WHERE conversation_id = c.id
      ORDER BY created_at DESC
    
    ) m ON true
    -- Chỉ lấy các cuộc hội thoại có user hiện tại tham gia
    WHERE c.participant_one = ${userId} OR c.participant_two = ${userId}
    ORDER BY m.created_at DESC NULLS LAST
  `;

 //  LIMIT 1
     res.json(result);
})