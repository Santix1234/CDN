import fs from 'fs/promises';
import path from 'path';

export class FileRetrievalError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'FileRetrievalError';
  }
}

export class FileRetrievalService {
  private baseStoragePath: string;

  constructor(baseStoragePath: string = path.join(process.cwd(), 'uploads')) {
    this.baseStoragePath = baseStoragePath;
  }

  /**
   * Retrieves a file from the storage directory
   * @param filename Name of the file to retrieve
   * @returns Buffer containing file contents
   * @throws {FileRetrievalError} When file cannot be accessed
   */
  async retrieveFile(filename: string): Promise<Buffer> {
    // Validate filename
    if (!filename || filename.includes('..') || filename.startsWith('/')) {
      throw new FileRetrievalError('Invalid filename', 'INVALID_FILENAME');
    }

    const filePath = path.join(this.baseStoragePath, filename);

    try {
      // Check if file exists
      const stats = await fs.stat(filePath);

      // Ensure it's a file, not a directory
      if (!stats.isFile()) {
        throw new FileRetrievalError('Not a file', 'NOT_A_FILE');
      }

      // Attempt to read file
      const fileBuffer = await fs.readFile(filePath);
      return fileBuffer;

    } catch (error) {
      // Handle specific file system errors
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new FileRetrievalError('File not found', 'FILE_NOT_FOUND');
      }

      if ((error as NodeJS.ErrnoException).code === 'EACCES') {
        throw new FileRetrievalError('Permission denied', 'FILE_ACCESS_DENIED');
      }

      // Rethrow any other unexpected errors
      throw new FileRetrievalError('Unexpected file retrieval error', 'RETRIEVAL_ERROR');
    }
  }
}