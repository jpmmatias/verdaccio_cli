#!/usr/bin/env node

import { intro, log, select, multiselect, spinner, outro } from '@clack/prompts'
import { exit } from 'process'
import { createBcs, publishingBcs } from './lib/createBcs.js'
import { deleteBcs } from './lib/deleteBcs.js'
import { retrieveAllBcOptions } from './lib/retrievAllBcOptions.js'
import { disconnectFromVerdaccio, openVerdaccio } from './lib/verdaccio.js'

intro(`RD - Verdaccio CLI`)

type Option = {
  value: unknown
  label: string
  hint?: string | undefined
}

const option = await select({
  message: 'O que deseja fazer?',
  options: [
    { value: 'update', label: "Update de BC's" },
    { value: 'create', label: "Criar BC's" },
    { value: 'delete', label: "Deletar BC's" },
  ],
})

const options: Option[] = await retrieveAllBcOptions()

if (!options) throw Error('Nao esta no ambiente com workspaces ')

const bcs = await multiselect({
  message: 'Selecione os modulos (selecione com espaco)',
  options,
  required: true,
})

try {
  await disconnectFromVerdaccio()
  await openVerdaccio()
  switch (option) {
    case 'create':
      await createBcs(bcs as string[])
      await publishingBcs(bcs as string[])
      break
    case 'delete':
      await deleteBcs(bcs as string[])
      break

    default:
      await deleteBcs(bcs as string[])
      await createBcs(bcs as string[])
      await publishingBcs(bcs as string[])
      break
  }
  exit()
} catch (error) {
  console.log(error)
  log.error(`Erro ao atualizar pacotes`)
  exit(1)
} finally {
  await disconnectFromVerdaccio()
}
