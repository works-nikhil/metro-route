import { query } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * GET /api/db-check
 * Verifies Postgres connection. Returns 200 with { ok, time } or 500 with error.
 */
export async function GET1() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "DATABASE_URL is not set" },
      { status: 500 }
    );
  }

  try {
    const res = await query("SELECT now() AS time");
    const time = res.rows[0]?.time ?? null;
    return NextResponse.json({ ok: true, time: time?.toISOString?.() ?? time });
  } catch (err) {
    console.error("DB check failed:", err);
    return NextResponse.json(
      { error: "Database connection failed", message: err.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { rows } = await query("SELECT COUNT(*) FROM stations");
    return Response.json(rows[0]);
  } catch (err) {
    console.error("DB check failed:", err);
    return Response.json({ error: "Database connection failed", message: err.message }, { status: 500 });
  }
}
