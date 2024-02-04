#!/usr/bin/env node

import { log } from '@clack/prompts'
import { exec } from 'child_process'
import { exit } from 'process'

export const runCommand = async (cliCommand, successMessage) => {
  return new Promise((resolve, reject) => {
    exec(cliCommand, (error, stdout, stderr) => {
      const isE404 = /npm ERR! 404/.test(stderr)

      if (isE404) {
        const bc = cliCommand
          .replace('npm unpublish', '')
          .replace('--force', '')
        log.warning(
          `Package ${bc} não encontrado no Verdaccio. Pode ser necessário verificar o nome do pacote ou a configuração do registro.`,
        )
        reject(new Error('Package not found in the registry'))

        return
      }

      const isPublishError =
        /export YARN_RC_FILENAME=local.yarnrc.yml && yarn workspace .* publish/.test(
          cliCommand,
        ) && stderr

      if (isPublishError) {
        log.warning(
          'Erro durante o comando de publicação. Talvez seja necessário verificar o nome do pacote ou se pacote ja existe no Verdaccio',
        )
        reject(new Error('Erro durante o comando de publicação'))
        return
      }

      if (error) {
        console.log(error)
        log.error(stderr || error.message)
        reject(error)
        exit()
      }

      log.success(successMessage)
      resolve(successMessage)
    })
  })
}
