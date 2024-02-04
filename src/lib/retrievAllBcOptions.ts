#!/usr/bin/env node
import { log } from '@clack/prompts'

import { exec } from 'child_process'

const cliCommand = 'yarn workspaces list'

const transformString = (inputString: string): string => {
  const regexMobile = /modules\/([^\/]+)\/mobile\/impl/
  const regexBusinessImpl = /modules\/([^\/]+)\/business\/impl/
  const regexBusinessApi = /modules\/([^\/]+)\/business\/api/

  switch (true) {
    case regexBusinessImpl.test(inputString):
      return inputString.replace(regexBusinessImpl, '@rd-bc-$1/business-impl')
    case regexBusinessApi.test(inputString):
      return inputString.replace(regexBusinessApi, '@rd-bc-$1/api')
    case regexMobile.test(inputString):
      return inputString.replace(regexMobile, '@rd-bc-$1/mobile-screens')
    default:
      return inputString
  }
}

export const retrieveAllBcOptions = (
  search: string | null,
): Promise<{ value: string; name: string }[]> => {
  return new Promise((resolve, reject) => {
    exec(cliCommand, (error, stdout, stderr) => {
      if (error) {
        log.error(`Error: ${error.message}`)
        log.error(
          'Erro: Possibilidade de workspaces do yarn nao estar configurado no caminho que esta chamando o verdaccio-cli, porfavor checar se esta no monorepo',
        )
        return
      }

      if (stderr) {
        console.error(`Error: ${stderr}`)
        reject(stderr)
        return
      }

      const isValidOption = (option: string) => option.startsWith('@rd-bc')

      let optionsArr = stdout
        .split('\n')
        .map(option => option.replace('➤ YN0000:', ''))
        .map(option => transformString(option.trim()))
        .filter(option => isValidOption(option))

      if (search) {
        optionsArr = optionsArr.filter(item => item.includes(search))
      }

      const mappedOptions = optionsArr.map(option => ({
        value: option,
        name: option,
      }))

      resolve(mappedOptions)
    })
  })
}
