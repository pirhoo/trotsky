import { mkdtempSync } from "fs"
import { join } from "path"
import { tmpdir } from "os"
import { decompress } from "@skhaz/zstd"

import { downloadOnce } from "./https"

const JETSTREAM_ZSTD_DICT_URL = "https://raw.githubusercontent.com/bluesky-social/jetstream/main/pkg/models/zstd_dictionary"

/**
 * Downloads the Jetstream Zstandard dictionary for decompression.
 * The dictionary is saved to a temporary directory and returned as a buffer.
 *
 * @returns A promise resolving to the downloaded Zstandard dictionary as a buffer.
 */
export async function downloadJetstreamZstdDict (): Promise<Buffer> {
  const dir = mkdtempSync(join(tmpdir(), "zstd-"))
  const filepath = join(dir, "dictionary")
  return downloadOnce(JETSTREAM_ZSTD_DICT_URL, filepath)
}

/**
 * Decompresses a Jetstream Zstandard-compressed buffer using the Jetstream dictionary.
 *
 * @param buffer - The compressed buffer to decompress.
 * @returns A promise resolving to the decompressed buffer.
 */
export async function decompressJetstreamZstd (buffer: Buffer): Promise<Buffer> {
  const dict = await downloadJetstreamZstdDict()
  return decompress(buffer, { dict })
}
