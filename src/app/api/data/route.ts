import { NextRequest, NextResponse } from "next/server";

const BIN_ID = "67ac8637ad19ca34f8007afc"; // Replace with your JSONBin.io Bin ID
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`;
const MASTER_KEY =
  "$2a$10$oZihc1sipw8kPQGERtHtpO8UtsmZAvkJkFmE1c3/MnsIoA8/Ykdoi";

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/latest`, {
      headers: { "X-Master-Key": MASTER_KEY },
    });

    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();
    return NextResponse.json(data.record);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // New JSON data from request

    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": MASTER_KEY,
        "X-Bin-Private": "true", // Change to "true" if you want private storage
      },
      body: JSON.stringify(body),
    });

    console.log("response", JSON.stringify(response));
    if (!response.ok) throw new Error("Failed to update data");

    const data = await response.json();
    return NextResponse.json({ message: "Data updated successfully", data });
  } catch (error) {
    console.log(JSON.stringify(error));
    return NextResponse.json(
      { error: "Failed to update data" },
      { status: 500 }
    );
  }
}
