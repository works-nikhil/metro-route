import { NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * GET /api/stations
 * Returns all stations with station code and name only.
 * Minimal response for optimal performance.
 */
export async function GET() {
  try {
    const { rows } = await query(`
      SELECT
        s.name,
        s.code
      FROM stations s
      WHERE s.code IS NOT NULL
      ORDER BY s.name;
    `);

    return NextResponse.json({ stations: rows }, { status: 200 });
  } catch (err) {
    console.error("GET /api/stations error:", err);
    return NextResponse.json(
      { error: "Internal server error", message: err.message },
      { status: 500 }
    );
  }
}
