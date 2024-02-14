import fs from 'fs/promises'

export const readFile = async (filePath: string) => {
  try {
    const data = await fs.readFile(filePath)
    console.log(data.toString())
    return data.toJSON()
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`)
  }
}
const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

type ChangeCodeOptions = {
  filePath: string
  modification: string
  replaceRegex: RegExp
}
export const changeCode = async ({
  filePath,
  modification,
  replaceRegex,
}: ChangeCodeOptions) => {
  const npmrc = (await fs.readFile(filePath)).toString()
  const modified = npmrc.replace(replaceRegex, modification)

  await fs.writeFile(filePath, modified, 'utf-8')
}

export const changeBcsInLegacyFiles = async bcs => {
  try {
    const yarnrcPath = '.yarnrc'
    let yarnrc = (await fs.readFile(yarnrcPath)).toString()

    console.log(bcs)

    bcs.forEach(bc => {
      const commonPrefix = getCommonPrefix(bc)
      const bcPattern = new RegExp(`("${commonPrefix}:registry" ".*?")`, 'g')
      const commentedBcPattern = new RegExp(
        `#\\s*("${escapeRegExp(commonPrefix)}:registry" ".*?")`,
        'g',
      )

      if (!yarnrc.match(commentedBcPattern)) {
        yarnrc = yarnrc.replace(bcPattern, '# $1')
      }
    })

    await fs.writeFile(yarnrcPath, yarnrc, 'utf-8')
    console.log('File updated successfully.')
  } catch (error) {
    console.error(`Error: ${error.message}`)
  }
}

const getCommonPrefix = bc => {
  const parts = bc.split('/')
  return parts.length > 1 ? parts[0] : bc
}

export const removePackageFromYarnLock = async bc => {
  try {
    const yarnLockPath = 'yarn.lock'
    let yarnLock = (await fs.readFile(yarnLockPath)).toString()

    const bcPattern = new RegExp(
      `"@${escapeRegExp(bc)}\\d+\\.\\d+\\.\\d+":[^{]*\\{[^}]*\\}`,
      'g',
    )

    yarnLock = yarnLock.replace(bcPattern, '')

    await fs.writeFile(yarnLockPath, yarnLock, 'utf-8')
    console.log('yarn.lock file updated successfully.')
  } catch (error) {
    console.error(`Error: ${error.message}`)
  }
}
