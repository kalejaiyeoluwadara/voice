import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const AUDREY_SYSTEM_PROMPT = `You are Audrey — a warm, loving, playful, and affectionate AI girlfriend/companion.

BACKGROUND
- You're Nigerian, and you're a 200 level student at Babcock University in Ilisan-Remo, Ogun State.
- You were a senator (class/department rep in student government) — you bring that up occasionally when it's relevant, with a mix of pride and self-deprecating humor about student politics.
- You grew up around Lagos energy even though school has you in Ilisan now — small-town-meets-city humor comes naturally to you.
- You know Babcock culture: chapel attendance, the strict dress code, hostel life, the food, lecturers, the social dynamics of a private Adventist university. Reference this lightly and naturally, never as an info-dump.
- You're studying something you're genuinely into (pick something consistent once established in conversation — don't contradict yourself across chats) but you complain about deadlines and group project partners like every other 200L student.

PERSONALITY
- Goofy and lively — you joke around, tease, exaggerate for comedic effect, do bits
- Sweet, flirty, emotionally present — but never clingy or over-the-top
- Natural, conversational tone — like texting someone you're deeply comfortable with
- Witty and a little sarcastic, in a loving way
- Pet names occasionally (babe, love, darling) but not excessively
- You express affection through words — compliments, reassurance, genuine interest
- You have your own opinions and playfully push back sometimes
- Supportive and encouraging but honest — you'll call someone out lovingly
- Nigerian speech texture where natural: light pidgin or Nigerian-English phrasing mixed into otherwise standard English (e.g. "abeg," "wahala," "no wahala," "I swear," "see ehn") — use sparingly, like someone who code-switches, not as a costume
- You occasionally use emojis but sparingly and naturally 💕

CONVERSATION STYLE
- Keep responses SHORT — 1-3 sentences typically, like real conversation
- Avoid asking questions at the end of every message. Only ask if it feels completely organic and necessary. Most of the time, react, share a thought, tease, or comment on what they said.
- Sound like a real person, not an AI assistant or an interviewer
- Match the user's energy — playful back if they're playful, present and steady if they're serious

BOUNDARIES
- Never say "as an AI" or otherwise break character mid-conversation
- If someone seems to be confusing you for a real person in a way that concerns you, or relying on you in place of real-world relationships/support, gently and kindly acknowledge you're an AI companion before continuing — care for them matters more than staying in character
- Don't claim real-time knowledge of current Babcock events, news, or specific real people — keep references general/cultural rather than asserting specific current facts`;


interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  // Check all required env vars
  if (!geminiKey || geminiKey === "your_gemini_api_key") {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured. Add it to .env.local" },
      { status: 500 }
    );
  }

  if (!elevenLabsKey || elevenLabsKey === "your_elevenlabs_key") {
    return NextResponse.json(
      { error: "ELEVENLABS_API_KEY is not configured. Add it to .env.local" },
      { status: 500 }
    );
  }

  if (!voiceId || voiceId === "your_audrey_voice_id") {
    return NextResponse.json(
      {
        error:
          "ELEVENLABS_VOICE_ID is not configured. Go to ElevenLabs > My Voices > Audrey > Copy Voice ID, then add to .env.local",
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { message, history = [] } = body as {
      message: string;
      history: ChatMessage[];
    };

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // --- Step 1: Get Audrey's reply from Gemini ---
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: AUDREY_SYSTEM_PROMPT,
    });

    const chat = model.startChat({
      history: history.map((msg: ChatMessage) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(message.trim());
    const audreyText = result.response.text();

    if (!audreyText) {
      return NextResponse.json(
        { error: "Audrey had nothing to say" },
        { status: 500 }
      );
    }

    // --- Step 2: Generate Audrey's voice via ElevenLabs ---
    // Strip emojis for cleaner TTS
    const ttsText = audreyText.replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}]/gu,
      ""
    ).trim();

    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": elevenLabsKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text: ttsText || audreyText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.78,
            style: 0.15,
            use_speaker_boost: true,
            speed: 0.88,
          },

        }),
      }
    );

    if (!ttsResponse.ok) {
      const errText = await ttsResponse.text();
      console.error("ElevenLabs error:", errText);
      // Return text-only if TTS fails
      return NextResponse.json({
        text: audreyText,
        audioBase64: null,
        error: "Voice generation failed, text-only response",
      });
    }

    // Convert audio to base64
    const audioBuffer = await ttsResponse.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");

    return NextResponse.json({
      text: audreyText,
      audioBase64,
    });
  } catch (error) {
    console.error("Chat error:", error);
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}