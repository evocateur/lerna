"use strict";

const execa = require("execa");

module.exports.isGitInitialized = isGitInitialized;

/**
 * @param {string} cwd Current working directory
 */
function isGitInitialized(cwd) {
  const result = execa.sync("git", ["rev-parse"], {
    cwd,
    // don't throw, just need exit code
    reject: false,
    // only return code, no stdio needed
    stdio: "ignore",
  });

  return result.code === 0;
}
