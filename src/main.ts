import { intro, log, select } from '@clack/prompts'
import { exit } from 'process'
import {
  createAndPublishPackages,
  deletePackages,
  updatePackages,
  fetchPackagesFromVerdaccio,
} from './lib/packages'
import { retrieveAllBcOptions } from './lib/retrievAllBcOptions'
import { checkAndInstallPackages, checkNodeVersion } from './lib/enviorement'
import {
  changeBcsInLegacyFiles,
  changeCode,
  readFile,
  removePackageFromYarnLock,
} from './lib/files'
import {
  disconnectFromVerdaccio,
  installVerdaccio,
  openVerdaccio,
} from './lib/verdaccio'
import checkbox from '@inquirer/checkbox'

interface CommandOption {
  command?: 'create' | 'update' | 'delete' | 'addLegacy'
  args: {
    Bc?: string[]
    Bcs?: string[]
    f?: string
    filter?: string
  }
}

const legacyAdd = async () => {
  await installVerdaccio()

  const open = await openVerdaccio()
  if (!open) return
  const options = await fetchPackagesFromVerdaccio()
  if (!options || options.length < 0)
    throw Error('Não possuie pacotes disponiveis no Verdaccio')

  if (!options) return

  const bcs = await checkbox({
    message: 'Selecione as packages',
    choices: options,
    required: true,
  })

  await changeCode({
    filePath: '.npmrc',
    modification: '\nregistry=http://localhost:4873/',
    replaceRegex: /([^#]\s*)# registry=http:\/\/localhost:4873\//,
  })
  await changeBcsInLegacyFiles(bcs)
  console.log({ bcs })
  bcs.forEach(bc => removePackageFromYarnLock(bc))

  disconnectFromVerdaccio()
}

export async function main({ command, args }: CommandOption) {
  let option: 'create' | 'update' | 'delete' | 'addLegacy'

  intro(`RD - Verdaccio CLI`)

  if (!command) {
    option = (await select({
      message: 'O que deseja fazer?',
      options: [
        { value: 'update', label: "Update de BC's" },
        { value: 'create', label: "Criar BC's" },
        { value: 'delete', label: "Deletar BC's" },
        { value: 'addLegacy', label: 'Adicionar BC no legado' },
      ],
    })) as 'delete' | 'update' | 'create' | 'addLegacy'
  }

  if (!option) {
    option = command
  }

  const filter = args.f || args.filter

  let bcs = args.Bc || args.Bcs

  if (option === 'addLegacy') {
    legacyAdd()
    return
  }

  const options = await retrieveAllBcOptions(filter)

  if (!options) throw Error('Nao esta no ambiente com workspaces ')

  if (!bcs) {
    bcs = await checkbox({
      message: 'Selecione as packages',
      choices: options,
      required: true,
    })
  }

  try {
    checkAndInstallPackages()
    checkNodeVersion()
    await installVerdaccio()
    await openVerdaccio()

    switch (option) {
      case 'create':
        await createAndPublishPackages(bcs)
        break

      case 'delete':
        await deletePackages(bcs)
        break

      default:
        await updatePackages(bcs)
        break
    }
    disconnectFromVerdaccio()
    exit()
  } catch (error) {
    log.error(error)
    log.error(`Erro ao atualizar pacotes`)
    disconnectFromVerdaccio()
    exit(1)
  }
}
