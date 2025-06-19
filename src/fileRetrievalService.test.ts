import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { FileRetrievalService, FileRetrievalError } from './fileRetrievalService';

describe('FileRetrievalService', () => {
  let fileRetrievalService: FileRetrievalService;
  const tempUploadDir = path.join(process.cwd(), 'uploads');

  beforeEach(() => {
    fileRetrievalService = new FileRetrievalService(tempUploadDir);
  });

  it('should successfully retrieve an existing file', async () => {
    // Mock file system interaction
    vi.spyOn(fs, 'stat').mockResolvedValue({ isFile: () => true } as any);
    vi.spyOn(fs, 'readFile').mockResolvedValue(Buffer.from('test content'));

    const result = await fileRetrievalService.retrieveFile('test.txt');
    expect(result).toEqual(Buffer.from('test content'));
  });

  it('should throw error for invalid filename', async () => {
    await expect(fileRetrievalService.retrieveFile('../secret.txt')).rejects.toThrow(FileRetrievalError);
    await expect(fileRetrievalService.retrieveFile('/etc/passwd')).rejects.toThrow(FileRetrievalError);
  });

  it('should throw error for non-existent file', async () => {
    vi.spyOn(fs, 'stat').mockRejectedValue(Object.assign(new Error(), { code: 'ENOENT' }));

    await expect(fileRetrievalService.retrieveFile('nonexistent.txt'))
      .rejects.toThrow(FileRetrievalError);
  });

  it('should throw error for directory', async () => {
    vi.spyOn(fs, 'stat').mockResolvedValue({ isFile: () => false } as any);

    await expect(fileRetrievalService.retrieveFile('test.txt'))
      .rejects.toThrow(FileRetrievalError);
  });

  it('should throw error for permission issues', async () => {
    vi.spyOn(fs, 'stat').mockRejectedValue(Object.assign(new Error(), { code: 'EACCES' }));

    await expect(fileRetrievalService.retrieveFile('protected.txt'))
      .rejects.toThrow(FileRetrievalError);
  });
});