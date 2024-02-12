import { retrieveAllBcOptions } from '../src/lib/retrievAllBcOptions'

jest.mock('child_process', () => ({
  exec: jest.fn((command, callback) =>
    callback(null, '➤ YN0000: modules/example/mobile/impl\n'),
  ),
}))

jest.mock('@clack/prompts', () => ({
  log: {
    error: jest.fn(),
  },
}))

describe('retrieveAllBcOptions', () => {
  it('should retrieve and transform options correctly', async () => {
    const options = await retrieveAllBcOptions('example')

    expect(options).toEqual([
      {
        value: '@rd-bc-example/mobile-screens',
        name: '@rd-bc-example/mobile-screens',
      },
    ])

    expect(require('child_process').exec).toHaveBeenCalledWith(
      'yarn workspaces list',
      expect.any(Function),
    )
  })
})
