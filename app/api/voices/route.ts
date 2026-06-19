import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey || apiKey === "your_key_here") {
    return NextResponse.json(
      { error: "ELEVENLABS_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: {
        "xi-api-key": apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `ElevenLabs API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Filter and shape the voice data for the client
    const voices = data.voices.map(
      (voice: {
        voice_id: string;
        name: string;
        category: string;
        labels: Record<string, string>;
        preview_url: string;
        description: string;
      }) => ({
        voice_id: voice.voice_id,
        name: voice.name,
        category: voice.category,
        labels: voice.labels || {},
        preview_url: voice.preview_url,
        description: voice.description || "",
      })
    );

    return NextResponse.json({ voices });
  } catch (error) {
    console.error("Error fetching voices:", error);
    return NextResponse.json(
      { error: "Failed to fetch voices from ElevenLabs" },
      { status: 500 }
    );
  }
}
