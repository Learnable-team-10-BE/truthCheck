
import { Request, Response, NextFunction } from 'express';
import { NotFoundError, BadRequestError } from '../utils/error.class';
import { Session, PartialSession, EncodeResult, DecodeResult, ExpirationStatus } from '../interfaces/auth.interface';
import { decodeSession, checkExpirationStatus, encodeSession } from '../configs/jwt';
import config from "../configs/config";
import User from '../models/user.model';
import { CreateUserRequest, UpdateUserRequest, UserResponse } from '../interfaces/user.interface';



export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            throw new BadRequestError('Email and password are required');
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Check if the password is correct
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new BadRequestError('Invalid email or password');
        }

        // Create a session
        const session: PartialSession = {
            id: user.id,
            username:user.username,
            email: user.email,
            dateCreated: Date.now(),
        };

        // Encode the session
        const encodedSession: EncodeResult = encodeSession(config.jwt.access_token, session);

        // Send the token to the client
        res.status(200).json({
            status: 'success',
            message:"user login successful",
            data: {
                token: encodedSession.token,
                expiresIn: encodedSession.expires,
            }
        });
    } catch (error) {
        next(error);
    }
};


export const registerUser = async (
    req: Request<{}, {}, CreateUserRequest>,
    res: Response,
    next: NextFunction
    ): Promise<void> => {
    try {

        const { username, email, password } = req.body;

        // check if the user already exists using email
        const userExists = await User.exists({email:email});
        if(userExists){
            return next(new BadRequestError('User already exists'));
        }

        const newUser = await User.create({
            username,
            email,
            password
        });

        
        // Create a new user in the database
        res.status(201).json({
        status: 'success',
        message: "user created successfully",
        data: { }
        });
    } catch (error) {
        next(error);
    }
    };
