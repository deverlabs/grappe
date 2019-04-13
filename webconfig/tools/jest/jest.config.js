module.exports = {
  rootDir: process.cwd(),
  testURL: 'http://localhost',
  testPathIgnorePatterns: ['<rootDir>/dist'],
  setupFilesAfterEnv: [
    '<rootDir>/tools/jest/setup.js'
  ],
  globals: {
    __DEV__: true
  },
  setupFiles: [
    'raf/polyfill'
  ],
  collectCoverageFrom: [
    'src/app/**/*.js',
    'src/pages/**/*.js',
    'src/components/**/*.js',
    '!src/actions/index.js',
    '!src/components/index.js',
    '!src/pages/index.js',
    '!src/**/__tests__'
  ],
  moduleNameMapper: {
    '.*\\.(css|scss|sass)$': '<rootDir>/tools/jest/styleMock.js',
    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/tools/jest/assetMock.js'
  }
};