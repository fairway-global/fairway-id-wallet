import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { access_token } = payload;

    if (!access_token) {
      return NextResponse.json(
        { error: "Missing access token" },
        { status: 400 }
      );
    }

    const userinfoEndpoint = process.env.NEXT_APP_USERINFO_ENDPOINT;

    if (!userinfoEndpoint) {
      console.error("Missing NEXT_APP_USERINFO_ENDPOINT environment variable");
      return NextResponse.json(
        {
          error: "Configuration error",
          error_description:
            "Missing NEXT_APP_USERINFO_ENDPOINT environment variable",
        },
        { status: 500 }
      );
    }

    const response = await axios.get(userinfoEndpoint, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(
      "Userinfo request error:",
      error.response?.data || error.message
    );

    // If axios got an error response, forward it
    if (error.response?.data) {
      return NextResponse.json(
        {
          error: "Userinfo request failed",
          error_description:
            error.response.data.error_description || error.message,
        },
        { status: error.response.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "Userinfo request failed", error_description: error.message },
      { status: 500 }
    );
  }
}
