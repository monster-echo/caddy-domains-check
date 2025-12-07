import { getAllowedPrefixes } from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get("domain");

  if (!domain) {
    return new NextResponse("Domain parameter missing", { status: 400 });
  }

  // 假设你的主域名是 qnap.aishuohua.art
  // 我们需要提取前缀。例如: "fastapi.qnap.aishuohua.art" -> "fastapi"
  const baseDomain = "qnap.aishuohua.art";

  if (!domain.endsWith(baseDomain)) {
    // 如果不是你的主域名，直接拒绝 (防止别人把你的服务器当公共 DNS 用)
    return new NextResponse("Domain mismatch", { status: 403 });
  }

  // 提取前缀
  // slice(0, -length - 1) 移除后缀和前面的点
  const prefix = domain.slice(0, -(baseDomain.length + 1));

  // 获取白名单
  const allowedPrefixes = await getAllowedPrefixes();

  // 检查
  if (allowedPrefixes.includes(prefix)) {
    return new NextResponse("Allowed", { status: 200 });
  } else {
    console.log(`Blocked attempt for: ${domain}`);
    return new NextResponse("Forbidden", { status: 403 });
  }
}
