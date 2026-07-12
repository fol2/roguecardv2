import registration0 from "../core/registration.js";
import registration1 from "../_sample/registration.js";

export const CONTENT_REGISTRATION_MANIFEST = Object.freeze({
  version: 1,
  target: "development",
  registrations: Object.freeze([registration0, registration1]),
  provenance: Object.freeze([
    Object.freeze({ id: "core", sourcePath: "src/packs/core/registration.js", targets: Object.freeze({"production":0,"development":0}) }),
    Object.freeze({ id: "sample", sourcePath: "src/packs/_sample/registration.js", targets: Object.freeze({"development":9000,"fixture":9000}) }),
  ]),
});
