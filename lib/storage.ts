// lib/storage.ts
import fs from "fs/promises";
import path from "path";

const FILE_PATH = path.join(
  process.cwd(),
  process.env.ALLOWED_DOMAINS_FILE || "allowed_domains.json"
);

// 默认允许的子域名 (可以先写死一些)
const DEFAULT_ALLOWED = ["frps", "www"];

export async function getAllowedPrefixes(): Promise<string[]> {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // 文件不存在则返回默认
    return DEFAULT_ALLOWED;
  }
}

export async function addAllowedPrefix(prefix: string): Promise<void> {
  const current = await getAllowedPrefixes();
  if (!current.includes(prefix)) {
    current.push(prefix);
    await fs.writeFile(FILE_PATH, JSON.stringify(current, null, 2), "utf-8");
  }
}
