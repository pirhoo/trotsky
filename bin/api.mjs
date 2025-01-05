import fsExtra from "fs-extra"
import { readdir } from "fs/promises"
import { createInterface } from "readline"
import { join, parse } from "path"
import { exec } from "child_process"

const API_OUTPUT_DIR = "./docs/api"
const API_PACKAGES_DIR = "./temp"

const EXEC_API_EXTRACTOR = "api-extractor run --local"
const EXEC_API_DOCUMENTER = `api-documenter markdown -i ${API_PACKAGES_DIR} -o ${API_OUTPUT_DIR}`

async function extractor () {
  return new Promise((resolve, reject) => {
    exec(EXEC_API_EXTRACTOR, (err, stdout, stderr) => {
      console.log(stdout)
      console.error(stderr)
      err ? reject(err) : resolve()
    })
  })
}
async function documenter () {
  return new Promise((resolve, reject) => {
    exec(EXEC_API_DOCUMENTER, (err, stdout, stderr) => {
      console.log(stdout)
      console.error(stderr)
      err ? reject(err) : resolve()
    })
  })
}

async function rewrite () {
  const files = await readdir(API_OUTPUT_DIR)
  for (const file of files) {
    try {
      const { "name": id, ext } = parse(file)
      // Skip non-markdown files
      if (ext !== ".md") continue

      const path = join(API_OUTPUT_DIR, file)
      const input = fsExtra.createReadStream(path)
      const output = []
      const lines = createInterface({ input, "crlfDelay": Infinity })

      let title = false
      let breadcrumb = false

      lines.on("line", (line) => {
        // Fix title to use h1
        if (!title && line.match(/## (.*)/)) {
          line = line.replace(/## (.*)/, "# $1")
          title = true
        }

        // Fix breadcrumbs to use a different separator
        if (!breadcrumb && line.match(/\[Home\]\(.\/index\.md\) &gt; (.*)/)) {
          line = line.replace(/\[Home\]/, "\[Packages\]")
          line = line.replace(/&gt;/g, "&nbsp;&#8250;&nbsp;")
          breadcrumb = true
        }

        // Remove breadcrumbs from home page
        if (!breadcrumb && line.match(/\[Home\]\(.\/index\.md\)/)) {
          line = ""
          breadcrumb = true
        }
        
        output.push(line)
      })

      await new Promise((resolve) => lines.once("close", resolve))
      input.close()
      await fsExtra.writeFile(path, output.join("\n"))
    } catch (err) {
      console.error(`Error while processing ${file}: ${err}`)
    }
  }
}

async function main () {
  await extractor()
  await documenter()
  await rewrite()
}

main()
