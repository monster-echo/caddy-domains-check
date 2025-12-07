import { getAllowedPrefixes } from "@/lib/storage";
import { NextResponse } from "next/server";

export async function GET() {
  const prefixes = await getAllowedPrefixes();
  return NextResponse.json({ prefixes });
}
