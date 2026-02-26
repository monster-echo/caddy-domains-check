import { getAllowedPrefixes } from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get("domain");

  if (!domain) {
    return new NextResponse("Domain parameter missing", { status: 400 });
  }

  // 支持多个合法后缀，通过环境变量 ALLOWED_BASE_DOMAINS 配置（逗号分隔）
  // 例如: ALLOWED_BASE_DOMAINS=qnap.aishuohua.art,frps.rwecho.top
  const allowedBases = (
    process.env.ALLOWED_BASE_DOMAINS || "qnap.aishuohua.art"
  )
    .split(",")
    .map((b) => b.trim())
    .filter(Boolean);

  // 检查当前请求的域名属于哪一个后缀
  const baseDomain = allowedBases.find((base) => domain.endsWith(`.${base}`));

  if (!baseDomain) {
    // 没有匹配的后缀，拒绝
    return new NextResponse("Domain mismatch", { status: 403 });
  }

  // 提取前缀
  // 例如: "wechat.frps.rwecho.top" -> 移除 ".frps.rwecho.top" 得到 "wechat"
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
