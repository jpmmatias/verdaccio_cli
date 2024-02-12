#!/usr/bin/env node

import { log } from '@clack/prompts'
import { spawn, execSync } from 'child_process'
import { exit } from 'process'

const cliCommand = 'verdaccio'

let verdaccioProcess

export const installVerdaccio = async () => {
  try {
    execSync('which verdaccio')

    log.success('Verdaccio instalado!')
  } catch (error) {
    log.info('Verdaccio não encontrado. Instalando...')

    try {
      execSync('pnpm install -g verdaccio')

      log.success('Verdaccio instalado com sucesso.')
    } catch (installError) {
      log.error(`Erro ao instalar Verdaccio: ${installError.message}`)
    }
  }
}

export const openVerdaccio = async () => {
  log.info('Conectando com  Verdaccio...')

  verdaccioProcess = spawn(cliCommand)

  verdaccioProcess.on('error', error => {
    log.error(`Error: ${error.message}`)
    exit()
  })

  verdaccioProcess.on('close', code => {
    if (code !== 0) {
      log.error(`Processo do Verdaccio foi terminado com codigo ${code}`)
      exit()
    }
    log.success('Conectado!')
  })
}

export const disconnectFromVerdaccio = () => {
  if (verdaccioProcess) {
    log.info('Disconectando do Verdaccio...')
    verdaccioProcess.kill()
    verdaccioProcess = null
    log.success('Disconectado!')
  } else {
    log.warn('Verdaccio não foi achado')
  }
}
