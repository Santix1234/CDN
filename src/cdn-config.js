const path = require('path');
const fs = require('fs');

/**
 * CDN Configuration Module
 * Manages CDN directory restrictions and file access validation
 */
class CdnConfig {
  /**
   * Initialize CDN configuration
   * @param {string} cdnDirectoryPath - Base directory for serving files
   */
  constructor(cdnDirectoryPath) {
    if (!cdnDirectoryPath) {
      throw new Error('CDN directory path must be specified');
    }

    // Resolve absolute path and validate directory exists
    this.cdnBasePath = path.resolve(cdnDirectoryPath);
    
    if (!fs.existsSync(this.cdnBasePath)) {
      throw new Error(`CDN directory does not exist: ${this.cdnBasePath}`);
    }

    if (!fs.lstatSync(this.cdnBasePath).isDirectory()) {
      throw new Error(`Specified CDN path is not a directory: ${this.cdnBasePath}`);
    }
  }

  /**
   * Validate and resolve file path within CDN directory
   * @param {string} requestedPath - Requested file path
   * @returns {string} Resolved absolute file path
   * @throws {Error} If file path is outside CDN directory
   */
  resolveFilePath(requestedPath) {
    // Normalize and resolve the full path
    const resolvedPath = path.resolve(this.cdnBasePath, requestedPath);

    // Ensure resolved path is within base CDN directory
    const isWithinBaseDirectory = resolvedPath.startsWith(this.cdnBasePath);
    
    if (!isWithinBaseDirectory) {
      throw new Error('Access denied: File outside CDN directory');
    }

    // Check if file exists
    if (!fs.existsSync(resolvedPath)) {
      throw new Error('File not found');
    }

    // Ensure it's a file, not a directory
    if (!fs.lstatSync(resolvedPath).isFile()) {
      throw new Error('Invalid file type');
    }

    return resolvedPath;
  }

  /**
   * Get the base CDN directory path
   * @returns {string} Base CDN directory path
   */
  getBasePath() {
    return this.cdnBasePath;
  }
}

module.exports = CdnConfig;