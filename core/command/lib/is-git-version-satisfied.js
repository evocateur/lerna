"use strict";

const execa = require("execa");
const findVersions = require("find-versions");
const semver = require("semver");

module.exports.isGitVersionSatisfied = isGitVersionSatisfied;

/**
 * @param {string} cwd Current working directory
 * @param {string} min Minimum version
 */
function isGitVersionSatisfied(cwd, min) {
  const result = execa.sync("git", ["--version"], { cwd });
  const gitVersion = findVersions(result.stdout)[0];

  return semver.gte(gitVersion, min);
}
