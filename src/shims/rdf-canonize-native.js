/**
 * This shim satisfies optional requires for `rdf-canonize-native`, which is
 * not available in the browser/Next.js build environment. The real native
 * module is only needed when `useNative` is set to true, which we never do,
 * so these functions intentionally throw if invoked.
 */
module.exports = {
  canonize() {
    throw new Error("rdf-canonize-native is not available in this build");
  },
  canonizeSync() {
    throw new Error("rdf-canonize-native is not available in this build");
  },
};
