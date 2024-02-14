#!/usr/bin/env node
import { runCommand } from './utils'
import { log } from '@clack/prompts'
import puppeteer from 'puppeteer'

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

export const fetchPackagesFromVerdaccio = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  const registryUrl = 'http://localhost:4873'
  await page.goto(registryUrl)
  await page.setViewport({ width: 1080, height: 20024 })

  await page.waitForSelector('div.container.content')

  const packages = await page.evaluate(() => {
    const packageNodes = document.querySelectorAll('.package-title')
    const packageList = [] as { option: string; value: string }[]

    packageNodes.forEach(node => {
      packageList.push({ option: node.innerHTML, value: node.innerHTML })
    })

    return packageList
  })

  await browser.close()

  return packages
}
