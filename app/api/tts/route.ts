import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey || apiKey === "your_key_here") {
    return NextResponse.json(
      { error: "ELEVENLABS_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const {
      text,
      voiceId = "21m00Tcm4TlvDq8ikWAM", // Default: Rachel
      modelId = "eleven_multilingual_v2",
      voiceSettings = {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
      },
    } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // Call ElevenLabs streaming TTS endpoint
    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: modelId,
          voice_settings: {
            stability: voiceSettings.stability,
            similarity_boost: voiceSettings.similarity_boost,
            style: voiceSettings.style,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      console.error("ElevenLabs TTS error:", errorText);
      return NextResponse.json(
        {
          error: `ElevenLabs TTS error: ${ttsResponse.status}`,
          details: errorText,
        },
        { status: ttsResponse.status }
      );
    }

    // Stream the audio data back to the client
    const audioStream = ttsResponse.body;

    if (!audioStream) {
      return NextResponse.json(
        { error: "No audio stream received" },
        { status: 500 }
      );
    }

    return new Response(audioStream, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
