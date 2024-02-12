"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const prompts_1 = require("@clack/prompts");
const process_1 = require("process");
const packages_1 = require("./lib/packages");
const retrievAllBcOptions_1 = require("./lib/retrievAllBcOptions");
const enviorement_1 = require("./lib/enviorement");
const verdaccio_1 = require("./lib/verdaccio");
const checkbox_1 = __importDefault(require("@inquirer/checkbox"));
async function main({ command, args }) {
    let option;
    (0, prompts_1.intro)(`RD - Verdaccio CLI`);
    if (!command) {
        option = (await (0, prompts_1.select)({
            message: 'O que deseja fazer?',
            options: [
                { value: 'update', label: "Update de BC's" },
                { value: 'create', label: "Criar BC's" },
                { value: 'delete', label: "Deletar BC's" },
            ],
        }));
    }
    const filter = args.f || args.filter;
    let bcs = args.Bc || args.Bcs;
    option = command;
    const options = await (0, retrievAllBcOptions_1.retrieveAllBcOptions)(filter);
    if (!options)
        throw Error('Nao esta no ambiente com workspaces ');
    if (!bcs) {
        bcs = await (0, checkbox_1.default)({
            message: 'Selecione as packages',
            choices: options,
            required: true,
        });
    }
    try {
        (0, enviorement_1.checkAndInstallPackages)();
        (0, enviorement_1.checkNodeVersion)();
        await (0, verdaccio_1.installVerdaccio)();
        await (0, verdaccio_1.openVerdaccio)();
        switch (option) {
            case 'create':
                await (0, packages_1.createAndPublishPackages)(bcs);
                break;
            case 'delete':
                await (0, packages_1.deletePackages)(bcs);
                break;
            default:
                await (0, packages_1.updatePackages)(bcs);
                break;
        }
        (0, verdaccio_1.disconnectFromVerdaccio)();
        (0, process_1.exit)();
    }
    catch (error) {
        prompts_1.log.error(error);
        prompts_1.log.error(`Erro ao atualizar pacotes`);
        (0, verdaccio_1.disconnectFromVerdaccio)();
        (0, process_1.exit)(1);
    }
}
exports.main = main;
//# sourceMappingURL=main.js.map