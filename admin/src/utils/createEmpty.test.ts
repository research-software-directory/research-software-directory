import { createEmptyResource } from "./createEmpty";

const schema = require("../fixtures/schema.json");

describe("createEmptyResource", () => {
  test("software", () => {
    const id = "random id";
    const now = "2018-05-07T14:54:42Z";
    const resource = createEmptyResource(schema.software, "someuser", id, now);

    const expected = {
      primaryKey: {
        collection: "software",
        id
      },
      brandName: "",
      bullets: "",
      conceptDOI: "",
      contributors: [],
      createdBy: "someuser",
      getStartedURL: "",
      isFeatured: false,
      isPublished: false,
      license: [],
      programmingLanguage: [],
      readMore: "",
      related: { mentions: [], organizations: [], projects: [], software: [] },
      repositoryURLs: { github: [] },
      shortStatement: "",
      slug: "",
      tags: [],
      testimonials: [],
      updatedBy: "someuser",
      updatedAt: now,
      createdAt: now
    };
    expect(resource).toEqual(expected);
  });
});
