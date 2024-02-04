#!/usr/bin/env node
import { runCommand } from './utils'
import { log } from '@clack/prompts'

export const createPackages = async bcs => {
  try {
    log.message('Gerando pacotes...')
    const createdBcsPromises = bcs.map(bc => {
      const cliCommand = `yarn workspace ${bc} rollup`
      return runCommand(cliCommand, `Criado pacote ${bc} com sucesso`)
    })

    await Promise.allSettled(createdBcsPromises)
    log.success('Criado packages das bcs com sucesso')
    return true
  } catch (error) {
    return false
  }
}

export const publishPackages = async bcs => {
  try {
    log.message('Publicando packages no Verdaccio...')
    const publishingBcsPromises = bcs.map(bc => {
      const cliCommand = `export YARN_RC_FILENAME=local.yarnrc.yml && yarn workspace ${bc} publish`
      return runCommand(cliCommand, `Publicado BC ${bc} com sucesso`)
    })

    await Promise.allSettled(publishingBcsPromises)
    return true
  } catch (error) {
    return false
  }
}

export const deletePackages = async bcs => {
  try {
    log.message('Deletando BCs...')
    const deletePromises = bcs.map(bc => {
      const cliCommand = `npm unpublish ${bc} --force`
      return runCommand(cliCommand, `Deletado ${bc} com sucesso`)
    })

    await Promise.allSettled(deletePromises)
    return true
  } catch (error) {
    return false
  }
}

export const createAndPublishPackages = async bcs => {
  try {
    await createPackages(bcs)
    await publishPackages(bcs)
    return true
  } catch (error) {
    log.error(error)
    return false
  }
}

export const updatePackages = async bcs => {
  try {
    await deletePackages(bcs)
    await createAndPublishPackages(bcs)
    return true
  } catch (error) {
    log.error(error)
    return false
  }
}
