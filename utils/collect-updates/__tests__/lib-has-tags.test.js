"use strict";

jest.mock("@lerna/child-process");

// mocked modules
const childProcess = require("@lerna/child-process");

// file under test
const hasTags = require("../lib/has-tags");

describe("hasTags()", () => {
  childProcess.execSync.mockImplementation(() => "v1.0.0\nv1.0.1");

  it("calls `git tag` with options passed in", () => {
    hasTags({ cwd: "test" });

    expect(childProcess.execSync).toHaveBeenLastCalledWith(
      "git",
      // defaults to fixed version pattern
      ["tag", "--list", "v*.*.*"],
      { cwd: "test" }
    );
  });

  it("calls `git tag` with independent version pattern", () => {
    hasTags({ cwd: "test", independentVersions: true });

    expect(childProcess.execSync).toHaveBeenLastCalledWith(
      "git",
      // switches to independent version pattern
      ["tag", "--list", "*@*.*.*"],
      { cwd: "test" }
    );
  });

  it("returns true when tags exist", () => {
    expect(hasTags()).toBe(true);
  });

  it("returns false when tags do not exist", () => {
    childProcess.execSync.mockImplementation(() => "");

    expect(hasTags()).toBe(false);
  });

  it("returns false when git command errors", () => {
    childProcess.execSync.mockImplementation(() => {
      throw new Error("boom");
    });

    expect(hasTags()).toBe(false);
  });
});
