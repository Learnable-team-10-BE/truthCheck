import { Router } from 'express';
import {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
} from '../controllers/user.controller';
import { validateRequest, validateUser, validateUserUpdate } from '../middlewares/validation.middleware';
import { requestLogger } from '../middlewares/logging.middleware';
import { requireJwtMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.route('/')
    /**
     * @swagger
     * /api/users:
     *   get:
     *     summary: Retrive the current user
     *     description: Retrieve a list of all users.
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: return current user details
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
     *                     users:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/User'
     *       500:
     *         description: Server error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    .get(requireJwtMiddleware,requestLogger, getUser)

router.route('/:id')
    /**
     * @swagger
     * /api/users/{id}:
     *   delete:
     *     summary: Delete a user by ID
     *     description: Delete a user by its ID.
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the user to delete
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: User deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: success
     *                 message:
     *                   type: string
     *                   example: User deleted successfully
     *       404:
     *         description: User not found
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
     *   put:
     *     summary: Update a user by ID
     *     description: Update a user by its ID.
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the user to update
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *                 example: john_doe_updated
     *               email:
     *                 type: string
     *                 format: email
     *                 example: johndoe_updated@gmail.com
     *               password:
     *                 type: string
     *                 format: password
     *                 example: newpassword123!
     *     responses:
     *       200:
     *         description: User updated successfully
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
     *       404:
     *         description: User not found
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
    // .get(requireJwtMiddleware,requestLogger, getUser)
    .delete(requireJwtMiddleware,requestLogger, deleteUser)
    .put(requireJwtMiddleware,requestLogger, validateRequest(validateUserUpdate), updateUser);

export default router;