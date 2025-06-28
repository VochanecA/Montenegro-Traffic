// app/api/jams/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

// NOTE: Removed 'fs/promises' and 'path' imports, as they are not needed here.
// They belong in your /api/upload route.

// Define the type for your jam with user info
interface TrafficJamWithUser {
  id: number;
  user_id: number | null;
  title: string;
  description?: string | null;
  latitude: number;
  longitude: number;
  address?: string | null;
  jam_type: string;
  severity: string;
  status: string;
  photo_urls: string[] | null; // Assuming this comes as an array of URLs
  created_at: string;
  updated_at: string;
  full_name?: string | null;
  avatar_url?: string | null;
}

export async function GET() {
  try {
    const rawResult = await sql`
      SELECT
        tj.*,
        u.full_name,
        u.avatar_url
      FROM traffic_jams tj
      LEFT JOIN users u ON tj.user_id = u.id
      WHERE tj.status = 'active'
      ORDER BY tj.created_at DESC
    `;

    const jams = rawResult as unknown as TrafficJamWithUser[];

    return NextResponse.json(
      jams.map((jam) => ({
        ...jam,
        // Ensure photo_urls is an array. If it's null, default to empty array.
        photo_urls: (jam.photo_urls && Array.isArray(jam.photo_urls)) ? jam.photo_urls : [],
        user: jam.full_name
          ? {
              full_name: jam.full_name,
              avatar_url: jam.avatar_url,
            }
          : undefined,
      })),
    );
  } catch (error) {
    console.error("Failed to fetch jams:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
const token = request.cookies.get("token")?.value; // Now matches frontend cookie

    // --- CRITICAL DEBUGGING LOGS FOR AUTHENTICATION ---
    console.log("--- /api/jams POST Request Debugging ---");
    console.log("Server received token:", token ? "Token present (first few chars: " + token.substring(0, 10) + "...)" : "No token received.");
    console.log("All cookies received:", request.cookies.getAll()); // Log all cookies to see if 'auth-token' is even there
    // --- END CRITICAL DEBUGGING LOGS ---

    if (!token) {
      console.error("Authentication required: No 'auth-token' found in request cookies.");
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      console.error("Invalid token: getUserFromToken returned null/undefined.");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Correctly parse JSON body for the jam data
    const {
      title,
      description,
      latitude,
      longitude,
      address,
      jam_type,
      severity,
      photo_urls // This should be an array of strings (URLs) from the frontend
    } = await request.json();

    // --- Debugging logs for incoming data payload ---
    console.log("Incoming data payload for /api/jams POST request:");
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Latitude:", latitude, " (Type:", typeof latitude, ")");
    console.log("Longitude:", longitude, " (Type:", typeof longitude, ")");
    console.log("Address:", address);
    console.log("Jam Type:", jam_type);
    console.log("Severity:", severity);
    console.log("Photo URLs:", photo_urls, " (Type:", typeof photo_urls, ", IsArray:", Array.isArray(photo_urls), ")");
    console.log("User ID from token:", user.id);
    // --- End debugging logs ---

    // Validate required fields and data types
    if (!title || typeof title !== 'string' || title.trim() === '') {
      console.error("Validation Error: Title is required or invalid.");
      return NextResponse.json({ error: "Title is required and must be a non-empty string." }, { status: 400 });
    }
    if (typeof latitude !== 'number' || isNaN(latitude)) {
      console.error("Validation Error: Latitude is required or invalid.");
      return NextResponse.json({ error: "Latitude is required and must be a valid number." }, { status: 400 });
    }
    if (typeof longitude !== 'number' || isNaN(longitude)) {
      console.error("Validation Error: Longitude is required or invalid.");
      return NextResponse.json({ error: "Longitude is required and must be a valid number." }, { status: 400 });
    }

    // Ensure photo_urls is a valid array for JSON.stringify
    const photoUrlsToInsert = Array.isArray(photo_urls) ? JSON.stringify(photo_urls) : '[]';

    // --- More debugging logs before SQL insert ---
    console.log("photoUrlsToInsert (JSON string for DB insertion):", photoUrlsToInsert);
    // --- End of debugging logs ---

    const result = await sql`
      INSERT INTO traffic_jams (
        user_id, title, description, latitude, longitude,
        address, jam_type, severity, photo_urls
      )
      VALUES (
        ${user.id},
        ${title},
        ${description || null},
        ${latitude},
        ${longitude},
        ${address || null},
        ${jam_type || "traffic_jam"},
        ${severity || "medium"},
        ${photoUrlsToInsert}::jsonb
      )
      RETURNING *
    `;

    const jams = result as unknown as TrafficJamWithUser[];
    const newJam = jams.at(0);

    if (!newJam) {
      console.error("SQL INSERT returned no row, which is unexpected for a successful insert. Database might not have returned the new row.");
      return NextResponse.json({ error: "Failed to retrieve newly created jam after insertion." }, { status: 500 });
    }

    console.log("Traffic jam reported successfully. New Jam ID:", newJam.id);
    return NextResponse.json(newJam);

  } catch (error) {
    console.error("--- Error in /api/jams POST handler ---");
    if (error instanceof Error) {
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        console.error("Error Stack:", error.stack); // Full stack trace for debugging
    } else {
        console.error("Unknown error type (not an Error instance):", JSON.stringify(error, null, 2));
    }

    // Provide more specific error messages based on common PostgreSQL error codes
    if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'string') {
        switch (error.code) {
            case '23502': // Not null violation
                return NextResponse.json({ error: "Missing required data for database (NOT NULL constraint violation)." }, { status: 400 });
            case '22P02': // Invalid text representation for type (e.g., trying to put text into a number column)
                return NextResponse.json({ error: "Invalid data format provided (e.g., non-numeric for latitude/longitude)." }, { status: 400 });
            case '23503': // Foreign key violation (e.g., user_id does not exist)
                return NextResponse.json({ error: "Invalid user ID or related data." }, { status: 400 });
            default:
                return NextResponse.json({ error: `Database error: ${error.code}. Please try again.` }, { status: 500 });
        }
    }

    return NextResponse.json({ error: "An unexpected internal server error occurred." }, { status: 500 });
  }
}