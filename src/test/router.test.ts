import { getPostsController } from "../controller/postsController.js";

const getSpy = jest.fn();

jest.doMock("express", () => {
  return {
    Router() {
      return {
        get: getSpy,
      };
    },
  };
});

describe("should test router", () => {
  test("should test get posts", async () => {
    await import("../routes/posts/postsRoutes.js");
    expect(getSpy).toHaveBeenCalledWith("/posts", getPostsController);
  });
});
