"use strict";

const childProcess = require("@lerna/child-process");
const figgyPudding = require("figgy-pudding");
const log = require("npmlog");

module.exports = hasTags;

const TagOptions = figgyPudding({
  cwd: {},
});

function hasTags(opts) {
  const { cwd } = TagOptions(opts);

  log.silly("hasTags");
  let result = false;

  try {
    result = !!childProcess.execSync("git", ["tag"], { cwd });
  } catch (err) {
    log.warn("ENOTAGS", "No git tags were reachable from this branch!");
    log.verbose("hasTags error", err);
  }

  log.verbose("hasTags", result);

  return result;
}
