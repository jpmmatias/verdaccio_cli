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
  try {
    log.info('Conectando com Verdaccio...')

    verdaccioProcess = spawn(cliCommand)

    verdaccioProcess.on('error', error => {
      log.error(`Error: ${error.message}`)
      throw error
    })

    const data = await new Promise<boolean>((resolve, reject) => {
      verdaccioProcess.stdout.on('data', () => {
        resolve(true)
      })

      log.success('Conectado com Verdaccio com sucesso!')
      log.step('')
    })
    verdaccioProcess.on('close', (code: number) => {
      if (code !== 0 && code) {
        log.error(`Processo do Verdaccio foi terminado com codigo ${code}`)
        throw new Error(`Verdaccio process exited with code ${code}`)
      }
    })

    return data
  } catch (error) {
    log.error(`Error: ${error.message}`)
    throw error
  }
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
