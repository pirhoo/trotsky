import { get } from "https"
import { createWriteStream } from "fs"
import { readFile } from "fs/promises"

export function download (url: string, output: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(output)

    get(url, function (response) {
      response.pipe(file)
      file.on("error", (err) => reject(err))       
      file.on("finish", async () => {
        file.close()
        await readFile(output).then(resolve)
      })
    })
  })
}

export async function downloadOnce (url: string, output: string): Promise<Buffer> {
  try {
    return await readFile(output)
  } catch {
    return download(url, output)
  }
}