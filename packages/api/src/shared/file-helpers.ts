import fs from 'fs/promises'
import path from 'path'

async function* getFiles(directory: string) {
  const dirents = await fs.readdir(directory, { withFileTypes: true })
  for (const dirent of dirents) {
    const res = path.resolve(directory, dirent.name)
    if (dirent.isDirectory()) {
      if (dirent.name === 'dist') {
        continue
      }
      yield* getFiles(res)
    } else {
      yield res
    }
  }
}

export async function* getFilesWithMatch(directory: string, search: string) {
  for await (const file of getFiles(directory)) {
    const contents = await fs.readFile(file)
    if (contents.includes(search)) {
      yield file
    }
  }
}

export async function clearDirectory(directory: string) {
  await fs.rm(directory, {
    recursive: true,
    force: true,
  })
  await fs.mkdir(directory)
}
