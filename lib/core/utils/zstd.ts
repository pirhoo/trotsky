import { mkdtempSync } from "fs"
import { join } from "path"
import { tmpdir } from "os"
import { decompress } from "@skhaz/zstd"

import { downloadOnce } from "./https"

const JETSTREAM_ZSTD_DICT_URL = "https://raw.githubusercontent.com/bluesky-social/jetstream/main/pkg/models/zstd_dictionary"

export async function downloadJetstreamZstdDict (): Promise<Buffer> {
  const dir = mkdtempSync(join(tmpdir(), "zstd-"))
  const filepath = join(dir, "dictionary")
  return downloadOnce(JETSTREAM_ZSTD_DICT_URL, filepath)
}

export async function decompressJetstreamZstd (buffer: Buffer): Promise<Buffer> {
  const dict = await downloadJetstreamZstdDict()
  return decompress(buffer, { dict })
}