import { sql } from "../utils/db.js";
import TryCatch from "../utils/TryCatch.js";

export const fetchAllMessageByConversationId = TryCatch(async (req, res) => {
  let userId = null;
  if (req.user) {
    userId = req.user.id;
  }

  const results = await sql`
SELECT c.id AS conversation_id,
  CASE
    WHEN u1.id = ${userId} THEN u2.username
    ELSE u1.username
  END AS participant_name,
  m.content AS last_message,
  m.created_at AS last_message_time
FROM conversations c
JOIN users u1 ON u1.id = c.participant_one
JOIN users u2 ON u2.id = c.participant_two
LEFT JOIN LATERAL (
  SELECT content, created_at
  FROM messages
  WHERE conversation_id = c.id
  ORDER BY created_at DESC
  LIMIT 1
) m ON true
WHERE c.participant_one = ${userId} OR c.participant_two = ${userId}
ORDER BY m.created_at DESC;
`;

  res.json(results);
});

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
