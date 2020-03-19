"use strict";

const figgyPudding = require("figgy-pudding");
const PackageGraph = require("@lerna/package-graph");

/**
 * @typedef {object} QueryGraphOptions
 * @property {'allDependencies' | 'dependencies'} [graphType] Defaults to "allDependencies",
 *    "dependencies" excludes devDependencies from the graph
 * @property {boolean} [forceLocal] Force local resolution of dependencies regardless of non-matching semver
 * @property {boolean} [rejectCycles] Reject when cycles encountered
 */
const QueryGraphConfig = figgyPudding({
  "force-local": {},
  forceLocal: "force-local",
  "graph-type": {},
  graphType: "graph-type",
  "reject-cycles": {},
  rejectCycles: "reject-cycles",
});

class QueryGraph {
  /**
   * A mutable PackageGraph used to query for next available packages.
   *
   * @param {Array<Package>} packages An array of Packages to build the graph out of
   * @param {QueryGraphOptions} [opts]
   * @constructor
   */
  constructor(packages, opts) {
    /** @type {QueryGraphOptions} */
    const { forceLocal, graphType, rejectCycles } = QueryGraphConfig(opts);

    // Create dependency graph
    this.graph = new PackageGraph(packages, graphType, forceLocal);

    // Evaluate cycles
    this.cycles = this.graph.collapseCycles(rejectCycles);
  }

  _getNextLeaf() {
    return Array.from(this.graph.values()).filter(node => node.localDependencies.size === 0);
  }

  _getNextCycle() {
    const cycle = Array.from(this.cycles).find(cycleNode => cycleNode.localDependencies.size === 0);

    if (!cycle) {
      return [];
    }

    this.cycles.delete(cycle);

    return cycle.flatten();
  }

  getAvailablePackages() {
    // Get the next leaf nodes
    const availablePackages = this._getNextLeaf();

    if (availablePackages.length > 0) {
      return availablePackages;
    }

    return this._getNextCycle();
  }

  markAsTaken(name) {
    this.graph.delete(name);
  }

  markAsDone(candidateNode) {
    this.graph.remove(candidateNode);

    for (const cycle of this.cycles) {
      cycle.unlink(candidateNode);
    }
  }
}

module.exports = QueryGraph;
module.exports.toposort = toposort;

/**
 * Sort the input list topologically.
 *
 * @param {!Array.<Package>} packages An array of Packages to build the list out of
 * @param {QueryGraphOptions} [opts]
 *
 * @returns {Array<Package>} a list of Package instances in topological order
 */
function toposort(packages, opts) {
  const graph = new QueryGraph(packages, opts);
  const result = [];

  let batch = graph.getAvailablePackages();

  while (batch.length) {
    for (const node of batch) {
      // no need to take() in synchronous loop
      result.push(node.pkg);
      graph.markAsDone(node);
    }

    batch = graph.getAvailablePackages();
  }

  return result;
}
