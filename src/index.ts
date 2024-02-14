#!/usr/bin/env node

import { Command } from 'commander'
import { main } from './main'

const program = new Command()

const args = program.opts()

program
  .name('verdaccio-cli')
  .description('CLI para ajudar na integração do monorepo com o App legado')
  .version('0.0.1')
  .action(() => main({ args }))

program
  .option('-f,--filter <search>', 'filtra as BCs existentes')
  .option('-bc <bcs...>', 'Nome do pacote que queira fazer o update')
  .option('-bcs <bcs...>', 'Nome do pacote que queira fazer o update')

program
  .command('update')
  .description('Faça o update do pacote e faça o upload no Verdaccio')
  .action(() => main({ command: 'update', args }))

program
  .command('create')
  .description('Cria BCs e faz o upload no verdaccio')
  .action(() => main({ command: 'create', args }))

program
  .command('delete')
  .description('Deleta BCs da Verdaccio')
  .action(() => main({ command: 'delete', args }))
program
  .command('legacyAdd')
  .description('Adicione BCs no legado')
  .action(() => main({ command: 'addLegacy', args }))

program.parse()
