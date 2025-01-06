import { get } from "https"
import { createWriteStream } from "fs"
import { readFile } from "fs/promises"

/**
 * Downloads a file from a given URL and saves it to the specified output path.
 * Resolves with the file's contents as a buffer after the download is complete.
 * 
 * @param url - The URL of the file to download.
 * @param output - The file path where the downloaded file should be saved.
 * @returns A promise that resolves to the contents of the downloaded file as a buffer.
 */
export function download (url: string, output: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(output)

    get(url, function (response) {
      response.pipe(file)
      file.on("error", (err) => reject(err))
      file.on("finish", async () => {
        file.close()
        try {
          const data = await readFile(output)
          resolve(data)
        } catch (err) {
          reject(err)
        }
      })
    }).on("error", (err) => reject(err))
  })
}

/**
 * Attempts to read a file from the specified output path. If the file does not exist,
 * it downloads the file from the given URL and saves it to the output path.
 * 
 * @param url - The URL of the file to download if it does not already exist.
 * @param output - The file path where the downloaded or existing file should be saved/read.
 * @returns A promise that resolves to the contents of the file as a buffer.
 */
export async function downloadOnce (url: string, output: string): Promise<Buffer> {
  try {
    return await readFile(output)
  } catch {
    return download(url, output)
  }
}
