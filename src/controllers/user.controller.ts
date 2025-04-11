import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/error.class';
import { CreateUserRequest, UpdateUserRequest, UserResponse } from '../interfaces/user.interface';
import { getUserIdFromResponse } from '../utils/auth.utils';


// Get all users
export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
    ): Promise<void> => {
    try {

        // Use the utility function instead of direct access
        const userId = getUserIdFromResponse(res);

        const users = await User.find().select('-password');

        // Get all users from the database
        res.status(200).json({
        status: 'success',
        data: {
            users: users
        }
        });
    } catch (error) {
        next(error);
    }
    };

// Get a specific user
export const getUser = async (
    req: Request,
    res: Response,
    next: NextFunction
    ): Promise<void> => {
    try {

         // Use the utility function instead of direct access
        const userId = getUserIdFromResponse(res);
        const user = await User.findById(userId).select('-password');  

        if (!user) {
            return next(new NotFoundError(`User with ID ${req.params.id} not found`));
        }

        // Get the user with the specified ID
        res.status(200).json({
        status: 'success',
        data: {
            user: user
        }
        });
    } catch (error) {
        next(error);
    }
    }



// Update a user
export const updateUser = async (
    req: Request<{id:string}, {}, UpdateUserRequest>,
    res: Response,
    next: NextFunction
    ): Promise<void> => {
    try {
        
                // Use the utility function instead of direct access
        const userId = getUserIdFromResponse(res);
        const { username, email } = req.body;

        const user = await User.findById(userId)
        if (!user || user.id.toString() != userId){
            return next (new ForbiddenError("You don't have access to this information"))
        }

        // check if the user already exists using email
        const updateUser= await User.findByIdAndUpdate(
            req.params.id,
            {username, email},
            {
                new:true,
                runValidators:true
                
            }
        
        );
        if (!updateUser) {
            return next(new NotFoundError(`User with ID ${req.params.id} not found`));

        }

        // Update the user with the specified ID
        res.status(200).json({
        status: 'success',
        data: {
            user: updateUser
        }
        });
    } catch (error) {
        next(error);
    }
    };

// Delete a user
export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
    ): Promise<void> => {
    try {
        
        const userId = getUserIdFromResponse(res);

        const user = await User.findById(userId)
        if (!user || user.id.toString() != userId){
            return next (new ForbiddenError("You don't have access to this information"))
        }

        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return next(new NotFoundError(`User with ID ${req.params.id} not found`));
        }
        // Delete the user with the specified ID
        res.status(204).json({
        status: 'success',
        message: 'User deleted',
        data: null
        });

    } catch (error) {
        next(error);
    }
    };