#!/usr/bin/env node

import { log } from '@clack/prompts'
import { exec } from 'child_process'
import { exit } from 'process'

const cliCommand = 'pnpm install -g verdaccio && verdaccio'

export const openVerdaccio = async () => {
  log.info('Conectando com Verdaccio..')

  exec(cliCommand, (error, stdout, stderr) => {
    if (error) {
      log.error(`Error: ${error.message}`)
      exit()
    }

    if (stderr) {
      log.error(`Error: ${stderr}`)
      exit()
    }

    log.success('Conectado!')

    return true
  })
  log.info('Conectando com Verdaccio!')
}

export const disconnectFromVerdaccio = async () => {
  exec('sudo kill $(sudo lsof -t -i:4873')
  log.info('Conectando com Verdaccio!')
}
