#!/usr/bin/env node

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
import checkbox, { Separator } from '@inquirer/checkbox'

export async function main() {
  intro(`RD - Verdaccio CLI`)

  const option = await select({
    message: 'O que deseja fazer?',
    options: [
      { value: 'update', label: "Update de BC's" },
      { value: 'create', label: "Criar BC's" },
      { value: 'delete', label: "Deletar BC's" },
    ],
  })

  const options = await retrieveAllBcOptions()

  if (!options) throw Error('Nao esta no ambiente com workspaces ')

  const bcs = await checkbox({
    message: 'Selecione as packages',
    choices: options,
    required: true,
  })

  try {
    checkNodeVersion()
    await checkAndInstallPackages()
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
    exit()
  } catch (error) {
    console.log(error)
    log.error(`Erro ao atualizar pacotes`)
    exit(1)
  } finally {
    disconnectFromVerdaccio()
  }
}

main()
