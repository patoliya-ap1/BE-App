import express from "express";
import {
  addPostsController,
  deletePostsController,
  getPostsController,
  likePostsController,
  updatePostsController,
} from "../../controller/postsController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { roleBaseMiddleware } from "../../middleware/roleBaseMiddleware.js";
import { postCacheMiddleware } from "../../middleware/postsCacheMiddleware.js";
export const postsRouter = express.Router();
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @openapi
 * /posts:
 *   get:
 *     summary: Retrieve a list of posts with optional filtering, sorting, and pagination.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Full-text search query string.
 *         required: false
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter posts by one or more tags (e.g., ?tags=fiction,magical).
 *         required: false
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order for the posts.
 *         required: false
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination.
 *         required: false
 *     responses:
 *       '200':
 *         description: A list of posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "Sample Post Title"
 *                   content:
 *                     type: string
 *                     example: "This is the content of the post."
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["tech", "news"]
 *       '500':
 *         description: Internal server error.
 */

postsRouter.get("/", postCacheMiddleware, getPostsController);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     description: Creates a new post with the provided title, body, and optional tags.
 *     tags:
 *       - Posts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post (required).
 *                 example: My First Post
 *               body:
 *                 type: string
 *                 description: The content of the post (required).
 *                 example: This is the body of my first post.
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of tags associated with the post.
 *                 example: [ "mystery",  "english",  "american"]
 *               userId:
 *                 type: string
 *                 description: The ID of the user creating the post (required, references users collection).
 *                 example: 60d0fe4f3a7e5c4a6a6a1a1a
 *     responses:
 *       '201':
 *         description: Successfully created a new post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: new post created successfully.
 *                 updatedPost:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d0fe4f3a7e5c4a6a6a1a1b
 *                     title:
 *                       type: string
 *                       example: My First Post
 *                     body:
 *                       type: string
 *                       example: This is the body of my first post.
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [ "mystery",  "english",  "american"]
 *                     likeCount:
 *                       type: number
 *                       example: 0
 *                     userId:
 *                       type: string
 *                       example: 60d0fe4f3a7e5c4a6a6a1a1a
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2021-06-25T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2021-06-25T12:00:00.000Z
 *       '400':
 *         description: Bad request due to validation error (e.g., missing title, body, or userId)
 *       '500':
 *         description: Server error
 */

postsRouter.post("/", upload.single("thumbnail"), addPostsController);

/**
 * @swagger
 * /posts/like/{id}:
 *   post:
 *     summary: Like a post
 *     description: Adds a like to a post from a specific user.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to like
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user liking the post
 *                 example: "60d5ec49f1b2c01234567890"
 *     responses:
 *       201:
 *         description: Successfully liked the post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "you liked this post 60d5ec49f1b2c01234567890"
 *       409:
 *         description: Conflict - User already liked this post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "you already like this post 60d5ec49f1b2c01234567890"
 *       400:
 *         description: Bad request (e.g., missing userId)
 *       500:
 *         description: Internal server error
 */

postsRouter.post("/like/:id", likePostsController);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post.
 *                 example: Updated Title
 *               body:
 *                 type: string
 *                 description: The body of the post.
 *                 example: This is the updated body of the post.
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of tags associated with the post.
 *                 example: [ "crime", "mystery", "love" ]
 *               likeCount:
 *                 type: number
 *                 description: The number of likes for the post.
 *                 example: 10
 *     responses:
 *       '201':
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Post updated successfully.
 *                 updatedPost:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60a4e7e6f1a4f0001f0e4b9e
 *                     title:
 *                       type: string
 *                       example: Updated Title
 *                     body:
 *                       type: string
 *                       example: This is the updated body of the post.
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [ "crime", "mystery", "love" ]
 *                     likeCount:
 *                       type: number
 *                       example: 10
 *                     userId:
 *                       type: string
 *                       example: 60a4e7e6f1a4f0001f0e4b9d
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2021-05-19T17:30:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2021-05-19T18:00:00.000Z
 *       '400':
 *         description: Bad request, e.g., missing required fields
 *       '404':
 *         description: Post not found
 */

postsRouter.put("/:id", upload.single("thumbnail"), updatePostsController);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     description: Deletes an existing post by ID. Restricted to users with admin role.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: post deleted successfully.
 *                 deletedPost:
 *                   type: object
 *                   properties:
 *                     title: { type: string }
 *                     body: { type: string }
 *                     tags: { type: array, items: { type: string } }
 *                     likeCount: { type: number }
 *                     userId: { type: string }
 *                     createdAt: { type: string, format: date-time }
 *                     updatedAt: { type: string, format: date-time }
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Post not found
 */
postsRouter.delete(
  "/:id",
  authMiddleware,
  roleBaseMiddleware("admin"),
  deletePostsController,
);
