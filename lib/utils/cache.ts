import fs from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), ".cache");

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR);
}

export function getCache(key: string): string | null {
  const file = path.join(CACHE_DIR, `${key}.json`);
  if (!fs.existsSync(file)) return null;

  const raw = fs.readFileSync(file, "utf-8");
  const parsed = JSON.parse(raw);

  return parsed.value ?? null;
}

export function setCache(key: string, value: string) {
  const file = path.join(CACHE_DIR, `${key}.json`);

  fs.writeFileSync(
    file,
    JSON.stringify({
      value,
      timestamp: Date.now(),
    })
  );
}