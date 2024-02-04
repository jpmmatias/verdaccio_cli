import {
  checkNodeVersion,
  checkAndInstallPackages,
} from '../src/lib/enviorement'
import { execSync } from 'child_process'
import { constants } from 'fs'
import fs from 'fs'

jest.mock('child_process', () => ({
  execSync: jest.fn(),
}))

jest.mock('fs', () => ({
  constants: {
    R_OK: 'mocked R_OK',
  },
  accessSync: jest.fn(),
}))

jest.mock('../src/lib/constants', () => ({
  NODE_VERSION_REQUIRED: '^18',
}))

describe('checkNodeVersion', () => {
  it('should call execSync with correct parameters', () => {
    checkNodeVersion()
    expect(execSync).toHaveBeenCalledWith('nvm --version', { stdio: 'ignore' })
  })
})

describe('checkAndInstallPackages', () => {
  it('should call accessSync with correct parameters', async () => {
    await checkAndInstallPackages()
    expect(fs.accessSync).toHaveBeenCalledWith('node_modules', constants.R_OK)
  })
})
