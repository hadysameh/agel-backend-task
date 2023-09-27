import { login, register, refresh } from "./../controllers/authController.js";
import express from "express";

const authRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The auth API
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: register user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - userName
 *               - password
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: user registered successfully
 *       401:
 *         description: password and confirmPassword are not the same!
 *       500:
 *         description: Some server error
 */

authRouter.post("/register", register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: user login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: user registered successfully
 *       401:
 *         description: password and confirmPassword are not the same!
 *       400:
 *         description: Please provide email and password!
 *       500:
 *         description: Some server error
 */
authRouter.post("/login", login);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: refreshes the access token using refresh token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: token refreshed
 *       401:
 *         description: Invalid token. Please log in again!
 *
 */
authRouter.post("/refresh", refresh);

export { authRouter };
