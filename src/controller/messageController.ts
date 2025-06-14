import { sql } from "../utils/db.js";
import TryCatch from "../utils/TryCatch.js";

export const fetchAllMessageByConversationId = TryCatch(async(req,res)=>{
const {conversationId} = req.params;

const results = await sql`
SELECT m.id, m.content,m.sender_id,m.conversation_id,m.created_at
FROM messages m
WHERE m.conversation_id = ${conversationId}
ORDER BY m.created_at ASC
`

res.json(results);
})

export const saveMessage = async (
  conversationId: string,
  senderId: string,
  content: string
) => {
  const results = await sql`
    INSERT INTO messages (conversation_id, sender_id, content)
    VALUES (${conversationId}, ${senderId}, ${content})
    RETURNING *
  `;
  return results[0];
};