import { execSync } from 'child_process';
import { log } from '@clack/prompts';
import { accessSync, constants } from 'fs';
export const checkAndInstallPackages = async () => {
    try {
        // Check if the 'node_modules' directory exists
        accessSync('node_modules', constants.R_OK);
        log.success('node_modules is already installed.');
    }
    catch (error) {
        log.info('node_modules not found. Installing...');
        try {
            // Run 'yarn' to install dependencies
            execSync('yarn');
            log.success('node_modules installed successfully.');
        }
        catch (installError) {
            log.error(`Error installing node_modules: ${installError.message}`);
        }
    }
};
//# sourceMappingURL=enviorementCheck.js.map