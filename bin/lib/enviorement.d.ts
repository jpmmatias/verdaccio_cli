/// <reference types="node" />
/// <reference types="node" />
import { execSync as childProcessExecSync } from 'child_process';
import { accessSync } from 'fs';
export declare const checkNodeVersion: (node_version?: string, execSync?: typeof childProcessExecSync, logger?: {
    message: (message?: string, { symbol }?: import("@clack/prompts").LogMessageOptions) => void;
    info: (message: string) => void;
    success: (message: string) => void;
    step: (message: string) => void;
    warn: (message: string) => void;
    warning: (message: string) => void;
    error: (message: string) => void;
}) => boolean;
export declare const checkAndInstallPackages: (checkAccessSync?: typeof accessSync, executeSync?: typeof childProcessExecSync, logger?: {
    message: (message?: string, { symbol }?: import("@clack/prompts").LogMessageOptions) => void;
    info: (message: string) => void;
    success: (message: string) => void;
    step: (message: string) => void;
    warn: (message: string) => void;
    warning: (message: string) => void;
    error: (message: string) => void;
}) => void;
