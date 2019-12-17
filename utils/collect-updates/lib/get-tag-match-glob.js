"use strict";

const figgyPudding = require("figgy-pudding");

module.exports.getTagMatchGlob = getTagMatchGlob;

/**
 * @typedef {object} TagMatchOptions
 * @property {boolean} independentVersions
 * @property {string} [tagVersionPrefix="v"]
 */

const TagMatchOptions = figgyPudding({
  independentVersions: {},
  tagVersionPrefix: { default: "v" },
});

/**
 * Retrieve glob pattern used to discriminate Lerna-generated tags from those created externally
 * @param {TagMatchOptions} [opts]
 */
function getTagMatchGlob(opts) {
  /** @type {TagMatchOptions} */
  const { independentVersions, tagVersionPrefix } = TagMatchOptions(opts);

  // used to discriminate Lerna-generated tags from those created externally
  return independentVersions ? "*@*.*.*" : `${tagVersionPrefix}*.*.*`;
}
