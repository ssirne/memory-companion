import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.post("/api/conversation-idea", async (req, res) => {
  const { person } = req.body;

  if (!person) {
    return res.status(400).json({ error: "No person was sent." });
  }

  const profileSummary = `
Name: ${person.name}
Interests: ${person.profile.interests.join(", ") || "none listed"}
Hobbies: ${person.profile.hobbies.join(", ") || "none listed"}
Family & important people: ${person.profile.family.join(", ") || "none listed"}
Life story: ${person.profile.lifeStory.join(", ") || "none listed"}
`;

  const memories = person.memories || [];

  const memoriesSummary = memories.length === 0
    ? "No memories have been added yet."
    : memories
        .map((memory) => {
          const parts = [`- ${memory.title} (${memory.type}, ${memory.date})`];

          if (memory.description) {
            parts.push(`  Details: ${memory.description}`);
          }

          return parts.join("\n");
        })
        .join("\n");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `You are generating conversation starters for Memory Companion.

Your job is to create exactly 3 warm, natural conversation questions that a family member or caregiver can ask a person with memory loss or another memory-related condition.

The questions should:
- Be about the person's life, interests, hobbies, memories, experiences, relationships, preferences, or things they enjoy.
- Feel personal and meaningful rather than generic.
- Encourage the person to share a story, opinion, memory, or personal experience.
- Be short, simple, and easy to understand.
- Sound like something a family member would naturally ask.
- Be gentle and never make the person feel pressured to remember something correctly.
- Use the profile information AND the specific memories below whenever relevant — reference an actual memory by name when it fits naturally, rather than staying purely generic.

Do NOT:
- Give advice to the caregiver.
- Explain why you chose the questions.
- Include a caregiver tip.
- Include an introduction or conclusion.
- Ask about the person's medical condition.
- Ask generic questions such as "How are you feeling today?"
- Suggest activities such as drinking tea, sitting by a window, or going for a walk.
- Add anything other than the 3 questions.

Your entire response MUST contain exactly 3 questions and nothing else.

Format the response as:

1. [question]
2. [question]
3. [question]

Profile:
${profileSummary}

Memories:
${memoriesSummary}`
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "AI request failed." });
  }
});

app.listen(3001, () => {
  console.log("Memory Companion AI server running on http://localhost:3001");
});