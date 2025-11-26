import { NextResponse } from "next/server";

const UPSTREAM_BASE =
  process.env.FAYDA_UPSTREAM_BASE ?? "http://localhost:3000/api";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const {
      code,
      code_verifier: codeVerifier,
      redirect_uri: redirectUri,
      client_id: clientId,
      grant_type: grantType,
    } = payload || {};

    if (!code) {
      return NextResponse.json(
        { error: "Missing authorization code" },
        { status: 400 }
      );
    }

    const upstreamUrl = `${UPSTREAM_BASE.replace(/\/$/, "")}/token`;
    const response = await fetch(upstreamUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        code_verifier: codeVerifier,
        redirect_uri: redirectUri,
        client_id: clientId,
        grant_type: grantType ?? "authorization_code",
      }),
    });

    const data = await response
      .json()
      .catch(() => ({ error: "Invalid JSON from upstream" }));

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Token proxy failed", error);
    return NextResponse.json(
      { error: "Unable to reach Fayda token service" },
      { status: 502 }
    );
  }
}
