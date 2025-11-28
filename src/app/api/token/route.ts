import { NextResponse } from "next/server";
import axios from "axios";
import { generateSignedJwt } from "@/utils/jwtGenerator";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { code, code_verifier } = payload;

    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    if (!code_verifier) {
      return NextResponse.json(
        { error: "Missing code_verifier" },
        { status: 400 }
      );
    }

    // Validate required environment variables
    const requiredEnvVars = {
      NEXT_APP_REDIRECT_URI: process.env.NEXT_APP_REDIRECT_URI,
      NEXT_APP_CLIENT_ID: process.env.NEXT_APP_CLIENT_ID,
      NEXT_APP_TOKEN_ENDPOINT: process.env.NEXT_APP_TOKEN_ENDPOINT,
    };

    const missingEnvVars = Object.entries(requiredEnvVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingEnvVars.length > 0) {
      console.error("Missing environment variables:", missingEnvVars);
      return NextResponse.json(
        {
          error: "Configuration error",
          error_description: `Missing environment variables: ${missingEnvVars.join(
            ", "
          )}`,
        },
        { status: 500 }
      );
    }

    let jwt;
    try {
      jwt = await generateSignedJwt();
    } catch (jwtError: any) {
      console.error("JWT generation failed:", jwtError);
      return NextResponse.json(
        {
          error: "JWT generation failed",
          error_description:
            jwtError.message || "Failed to generate client assertion",
        },
        { status: 500 }
      );
    }

    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.NEXT_APP_REDIRECT_URI || "",
      client_id: process.env.NEXT_APP_CLIENT_ID || "",
      client_assertion_type:
        process.env.NEXT_APP_CLIENT_ASSERTION_TYPE ||
        "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      client_assertion: jwt,
      code_verifier: code_verifier,
    });

    console.log(
      "Sending token request to:",
      process.env.NEXT_APP_TOKEN_ENDPOINT
    );
    console.log(
      "Request params:",
      params
        .toString()
        .replace(/client_assertion=[^&]+/, "client_assertion=***")
    );

    let response;
    try {
      response = await axios.post(
        process.env.NEXT_APP_TOKEN_ENDPOINT!,
        params.toString(),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          responseType: "text", // Force response to be treated as raw text
          transformResponse: [(data) => data], // Disable auto JSON parsing
        }
      );
    } catch (axiosError: any) {
      console.error("Axios request failed:", {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
      });

      // If the error response has data, try to parse it
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data;
        let parsedError;

        if (typeof errorData === "string") {
          try {
            parsedError = JSON.parse(errorData);
          } catch {
            parsedError = {
              error: "Token request failed",
              error_description: errorData,
            };
          }
        } else {
          parsedError = errorData;
        }

        return NextResponse.json(
          {
            error: parsedError.error || "Token request failed",
            error_description:
              parsedError.error_description ||
              parsedError.error ||
              axiosError.message,
          },
          { status: axiosError.response.status || 500 }
        );
      }

      throw axiosError; // Re-throw to be caught by outer catch
    }

    const rawData = response.data;
    let parsedData;

    if (typeof rawData === "string") {
      try {
        parsedData = JSON.parse(rawData); // Convert JSON string to object
      } catch (err) {
        return NextResponse.json(
          { error: "Invalid JSON from API" },
          { status: 500 }
        );
      }
    } else {
      parsedData = rawData; // already an object
    }

    // Check for error responses from the token endpoint
    if (parsedData.error) {
      console.error("Token endpoint error:", parsedData);
      // Return the error from the token endpoint with appropriate status
      const statusCode =
        parsedData.error === "invalid_transaction"
          ? 409 // Conflict
          : parsedData.error === "invalid_request"
          ? 400 // Bad Request
          : 500; // Internal Server Error

      return NextResponse.json(
        {
          error: parsedData.error,
          error_description: parsedData.error_description || parsedData.error,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error(
      "Token request error:",
      error.response?.data || error.message
    );

    // If axios got an error response, forward it
    if (error.response?.data) {
      const errorData = error.response.data;
      return NextResponse.json(
        {
          error: errorData.error || "Token request failed",
          error_description: errorData.error_description || error.message,
        },
        { status: error.response.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "Token request failed", error_description: error.message },
      { status: 500 }
    );
  }
}
