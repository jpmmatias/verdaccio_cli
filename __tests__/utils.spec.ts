import { runCommand } from '../src/lib/utils'

jest.mock('child_process', () => ({
  exec: jest.fn((command, callback) =>
    callback(null, 'stdout content', 'stderr content'),
  ),
}))

jest.mock('@clack/prompts', () => ({
  log: {
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('process', () => ({
  exit: jest.fn(),
}))

describe('runCommand', () => {
  it('should resolve with success message on successful command execution', async () => {
    const result = await runCommand('mock command', 'Success message')

    expect(require('@clack/prompts').log.success).toHaveBeenCalledWith(
      'Success message',
    )

    expect(require('child_process').exec).toHaveBeenCalledWith(
      'mock command',
      expect.any(Function),
    )

    expect(require('process').exit).not.toHaveBeenCalled()

    expect(result).toBe('Success message')
  })

  it('should reject with an error on unsuccessful command execution', async () => {
    jest
      .spyOn(require('child_process'), 'exec')
      .mockImplementationOnce((command, callback: any) =>
        callback(new Error('Some error')),
      )

    await expect(runCommand('mock command', 'Success message')).rejects.toThrow(
      'Some error',
    )

    expect(require('@clack/prompts').log.error).toHaveBeenCalledWith(
      'Some error',
    )

    expect(require('process').exit).toHaveBeenCalled()
  })
})
