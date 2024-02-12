#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const main_1 = require("./main");
const program = new commander_1.Command();
const args = program.opts();
program
    .name('verdaccio-cli')
    .description('CLI para ajudar na integração do monorepo com o App legado')
    .version('0.0.1')
    .action(() => (0, main_1.main)({ args }));
program
    .option('-f,--filter <search>', 'filtra as BCs existentes')
    .option('-bc <bcs...>', 'Nome do pacote que queira fazer o update')
    .option('-bcs <bcs...>', 'Nome do pacote que queira fazer o update');
program
    .command('update')
    .description('Faça o update do pacote e faça o upload no Verdaccio')
    .action(() => (0, main_1.main)({ command: 'update', args }));
program
    .command('create')
    .description('Cria BCs e faz o upload no verdaccio')
    .action(() => (0, main_1.main)({ command: 'create', args }));
program
    .command('delete')
    .description('Deleta BCs da Verdaccio')
    .action(() => (0, main_1.main)({ command: 'delete', args }));
program.parse();
//# sourceMappingURL=index.js.map