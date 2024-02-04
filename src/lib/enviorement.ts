import { execSync } from 'child_process'
import { log } from '@clack/prompts'
import { accessSync, constants } from 'fs'
import { NODE_VERSION_REQUIRED } from './constants'
import semver from 'semver'

export const checkNodeVersion = () => {
  const nodeVersion = process.version.slice(1)

  if (!semver.satisfies(nodeVersion, NODE_VERSION_REQUIRED)) {
    log.error(
      `Verão do Node ${NODE_VERSION_REQUIRED} é requerida. Versão atual é ${nodeVersion}`,
    )
    try {
      execSync('nvm --version', { stdio: 'ignore' })

      log.info(
        'NVM encontrado. Tentando trocar pra versão de node requerida...',
      )

      try {
        execSync(
          `nvm install ${NODE_VERSION_REQUIRED} && nvm use ${NODE_VERSION_REQUIRED}`,
        )
        log.success(
          `Trocado para versão ${NODE_VERSION_REQUIRED} do Node com sucesso!`,
        )
      } catch (nvmError) {
        log.error(`Erro ao trocar versão do Node.js: ${nvmError.message}`)
        process.exit(1)
      }
    } catch (nvmNotFound) {
      log.error(
        `Nvm não enconstrado. Por favor instale nvm e use a versão do node ${NODE_VERSION_REQUIRED}`,
      )
      process.exit(1)
    }
  }
}

export const checkAndInstallPackages = async () => {
  try {
    accessSync('node_modules', constants.R_OK)

    log.success('node_modules existe')
  } catch (error) {
    log.info('node_modules não encontrado. Instalando...')

    try {
      execSync('yarn')

      log.success('node_modules instalado com sucesso.')
    } catch (installError) {
      log.error(`Erro instalando node_modules: ${installError.message}`)
    }
  }
}
