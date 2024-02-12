import { execSync as childProcessExecSync } from 'child_process'
import { log } from '@clack/prompts'
import { accessSync, constants } from 'fs'
import { NODE_VERSION_REQUIRED } from './constants'
import semver from 'semver'

export const checkNodeVersion = (
  node_version = NODE_VERSION_REQUIRED,
  execSync = childProcessExecSync,
  logger = log,
) => {
  const nodeVersion = process.version.slice(1)

  if (semver.satisfies(nodeVersion, node_version)) return true

  logger.error(
    `Verão do Node ${node_version} é requerida. Versão atual é ${nodeVersion}`,
  )

  try {
    execSync('nvm --version', { stdio: 'ignore' })

    logger.info(
      'NVM encontrado. Tentando trocar pra versão de node requerida...',
    )

    try {
      execSync(`nvm install ${node_version} && nvm use ${node_version}`)
      logger.success(`Trocado para versão ${node_version} do Node com sucesso!`)
    } catch (nvmError) {
      logger.error(`Erro ao trocar versão do Node.js: ${nvmError.message}`)
      process.exit(1)
    }
  } catch (nvmNotFound) {
    logger.error(
      `Nvm não enconstrado. Por favor instale nvm e use a versão do node ${node_version}`,
    )
  }
}

export const checkAndInstallPackages = (
  checkAccessSync = accessSync,
  executeSync = childProcessExecSync,
  logger = log,
) => {
  try {
    checkAccessSync('node_modules', constants.R_OK)
    logger.success('node_modules existe')
  } catch (error) {
    logger.info('node_modules não encontrado. Instalando...')
    try {
      executeSync('yarn')
      logger.success('node_modules instalado com sucesso.')
    } catch (installError) {
      logger.error(`Erro instalando node_modules: ${installError.message}`)
    }
  }
}
