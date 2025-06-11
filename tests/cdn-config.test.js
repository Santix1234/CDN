import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import CdnConfig from '../src/cdn-config.js';

describe('CdnConfig', () => {
  const testCdnDir = path.resolve('./test-cdn');

  // Setup test directory before tests
  beforeAll(() => {
    if (!fs.existsSync(testCdnDir)) {
      fs.mkdirSync(testCdnDir);
    }
    fs.writeFileSync(path.join(testCdnDir, 'test-file.txt'), 'Test content');
  });

  // Cleanup after tests
  afterAll(() => {
    fs.unlinkSync(path.join(testCdnDir, 'test-file.txt'));
    fs.rmdirSync(testCdnDir);
  });

  it('should initialize with a valid directory', () => {
    const cdnConfig = new CdnConfig(testCdnDir);
    expect(cdnConfig.getBasePath()).toBe(testCdnDir);
  });

  it('should throw error if directory does not exist', () => {
    expect(() => new CdnConfig('/non-existent-directory')).toThrow('CDN directory does not exist');
  });

  it('should resolve file path within CDN directory', () => {
    const cdnConfig = new CdnConfig(testCdnDir);
    const resolvedPath = cdnConfig.resolveFilePath('test-file.txt');
    expect(resolvedPath).toBe(path.join(testCdnDir, 'test-file.txt'));
  });

  it('should throw error for file outside CDN directory', () => {
    const cdnConfig = new CdnConfig(testCdnDir);
    expect(() => cdnConfig.resolveFilePath('../outside-file.txt')).toThrow('Access denied');
  });

  it('should throw error for non-existent files', () => {
    const cdnConfig = new CdnConfig(testCdnDir);
    expect(() => cdnConfig.resolveFilePath('non-existent.txt')).toThrow('File not found');
  });
});