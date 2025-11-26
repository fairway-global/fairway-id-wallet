import { NextResponse } from "next/server";

const UPSTREAM_BASE =
  process.env.FAYDA_UPSTREAM_BASE ?? "http://localhost:3000/api";

export async function POST(request: Request) {
  try {
    const { access_token: accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Missing access token" },
        { status: 400 }
      );
    }

    const upstreamUrl = `${UPSTREAM_BASE.replace(/\/$/, "")}/userinfo/`;
    const response = await fetch(upstreamUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: accessToken }),
    });

    const data = await response
      .json()
      .catch(() => ({ error: "Invalid JSON from upstream" }));

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Userinfo proxy failed", error);
    return NextResponse.json(
      { error: "Unable to reach Fayda userinfo service" },
      { status: 502 }
    );
  }
}
