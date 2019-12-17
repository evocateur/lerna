"use strict";

const childProcess = require("@lerna/child-process");
const figgyPudding = require("figgy-pudding");
const log = require("npmlog");
const { getTagMatchGlob } = require("./get-tag-match-glob");

module.exports = hasTags;

const TagOptions = figgyPudding({
  cwd: {},
});

function hasTags(opts) {
  const { cwd } = TagOptions(opts);
  const pattern = getTagMatchGlob(opts);

  log.silly("hasTags", pattern);
  let result = false;

  try {
    result = !!childProcess.execSync("git", ["tag", "--list", pattern], { cwd });
  } catch (err) {
    log.warn("ENOTAGS", "No git tags were reachable from this branch!");
    log.verbose("hasTags error", err);
  }

  log.verbose("hasTags", result);

  return result;
}
