import fs from 'fs/promises'
import path from 'path'
import * as ts from 'typescript'

import { clearDirectory, getFilesWithMatch } from './file-helpers'

const API_DIRECTORY = 'packages/api'
const CONSTANTS_DIRECTORY = 'packages/shared-constants/src'
const COMMENT_TAG = '@share-with-frontend'
const ANNOTATION_REGEX = /\/\/ @share-with-frontend (?<type>[a-z]+)/
const ROOT = path.join(__dirname, '../../../../')

function getProgram(files: string[]) {
  return ts.createProgram(files, {
    noEmitOnError: true,
    noImplicitAny: true,
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
  })
}

async function getAllTags(file: string, program: ts.Program) {
  const sourceFile = program.getSourceFile(file)
  if (!sourceFile) {
    return []
  }
  const fullText = sourceFile.getFullText()
  const matches: { type: string; text: string }[] = []
  ts.forEachChild(sourceFile, (node) => {
    if (!ts.isVariableStatement(node)) {
      return
    }
    const commentRange = ts.getTrailingCommentRanges(fullText, node.getEnd())
    if (!commentRange?.length) {
      return
    }
    for (const range of commentRange) {
      const commentString = fullText.slice(range.pos, range.end)
      const match = commentString.match(ANNOTATION_REGEX)?.groups?.type
      if (match) {
        matches.push({
          type: match,
          text: node.declarationList.declarations[0].getText(sourceFile),
        })
      }
    }
  })
  return matches
}

;(async () => {
  const files: string[] = []
  for await (const f of getFilesWithMatch(
    path.join(ROOT, API_DIRECTORY),
    COMMENT_TAG,
  )) {
    files.push(f)
  }
  const program = getProgram(files)
  const matches: Record<string, string[]> = {}
  for (const f of files) {
    for (const match of await getAllTags(f, program)) {
      matches[match['type']] = [
        match['text'],
        ...(matches[match['type']] || []),
      ]
    }
  }
  await clearDirectory(path.join(ROOT, CONSTANTS_DIRECTORY))
  await Promise.all(
    Object.entries(matches).map(async ([type, text]) => {
      await fs.writeFile(
        path.join(ROOT, CONSTANTS_DIRECTORY, `${type}.ts`),
        text
          .sort()
          .map((t) => `export const ${t}`)
          .join('\n') + '\n',
      )
    }),
  )
  await fs.writeFile(
    path.join(ROOT, CONSTANTS_DIRECTORY, 'index.ts'),
    Object.keys(matches)
      .sort()
      .map((k) => `export * from './${k}'`)
      .join('\n') + '\n',
  )
})()
