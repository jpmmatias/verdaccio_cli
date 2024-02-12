import { intro, log, select } from '@clack/prompts'
import { exit } from 'process'
import {
  createAndPublishPackages,
  deletePackages,
  updatePackages,
} from './lib/packages'
import { retrieveAllBcOptions } from './lib/retrievAllBcOptions'
import { checkAndInstallPackages, checkNodeVersion } from './lib/enviorement'
import {
  disconnectFromVerdaccio,
  installVerdaccio,
  openVerdaccio,
} from './lib/verdaccio'
import checkbox from '@inquirer/checkbox'

interface CommandOption {
  command?: 'create' | 'update' | 'delete'
  args: {
    Bc?: string[]
    Bcs?: string[]
    f?: string
    filter?: string
  }
}

export async function main({ command, args }: CommandOption) {
  let option: 'create' | 'update' | 'delete'

  intro(`RD - Verdaccio CLI`)

  if (!command) {
    option = (await select({
      message: 'O que deseja fazer?',
      options: [
        { value: 'update', label: "Update de BC's" },
        { value: 'create', label: "Criar BC's" },
        { value: 'delete', label: "Deletar BC's" },
      ],
    })) as 'delete' | 'update' | 'create'
  }

  const filter = args.f || args.filter

  let bcs = args.Bc || args.Bcs

  option = command

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
