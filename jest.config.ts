import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    verbose: true,
    collectCoverage: true,
    testMatch: ['**/?(*.)+(spec).ts?(x)'],
    collectCoverageFrom: ['**/*.ts', '!**/*.spec.ts'],
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    roots: ['<rootDir>/src'],
    setupFilesAfterEnv: ['<rootDir>/setup.ts'],
  };
};
