import { NextFunction, Request, Response, Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller';
import { requestLogger } from '../middlewares/logging.middleware';


const router = Router();

router.route('/login')
    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     summary: Logs in a user
     *     tags: 
     *       - Auth
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Successful login
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: success
     *                 data:
     *                   type: object
     *                   properties:
     *                     token:
     *                       type: string
     *                     expiresIn:
     *                       type: number
     *       400:
     *         description: Bad request - Invalid input data
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       500:
     *         description: Server error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    .post(requestLogger, loginUser);

router.route('/register')
    /**
     * @swagger
     * /api/auth/register:
     *   post:
     *     summary: register a new user
     *     description: Create a new user with username, email, and password.
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - username
     *               - email
     *               - password
     *             properties:
     *               username:
     *                 type: string
     *                 example: john_doe
     *               email:
     *                 type: string
     *                 format: email
     *                 example: johndoe@gmail.com
     *               password:
     *                 type: string
     *                 format: password
     *                 example: password123!
     *     responses:
     *       201:
     *         description: User created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: success
     *                 data:
     *                   type: object
     *                   properties:
     *                     user:
     *                       $ref: '#/components/schemas/User'
     *       400:
     *         description: Bad request - Invalid input data
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       500:
     *         description: Server error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */

    .post(requestLogger,registerUser)

export default router;