import { NextRequest, NextResponse } from "next/server";
import { addAllowedPrefix } from "@/lib/storage";

export async function POST(request: NextRequest) {
  // 1. 简单的鉴权检查
  const authHeader = request.headers.get("authorization");
  const expectedToken = `Bearer ${process.env.CADDY_ADMIN_TOKEN}`;

  if (authHeader !== expectedToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 2. 解析 Body
  try {
    const body = await request.json();
    const { prefix } = body;

    if (!prefix || typeof prefix !== "string") {
      return new NextResponse("Invalid prefix", { status: 400 });
    }

    // 3. 写入文件
    await addAllowedPrefix(prefix);

    return NextResponse.json({
      success: true,
      message: `Added ${prefix} to allowlist`,
    });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
