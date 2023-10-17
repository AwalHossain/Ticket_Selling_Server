import { Request, Response } from 'express';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ILoginUserResponse, IRefreshTokenResponse } from './user.interface';
import { AuthService } from './user.service';


const registrationUser = catchAsync(async (req: Request, res: Response) => {
    const { ...loginData } = req.body;
    const result = await AuthService.registrationUser(loginData);
    const { refreshToken } = result;
    // set refresh token into cookie
    const cookieOptions = {
        secure: config.env === 'production',
        httpOnly: true,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

    sendResponse<ILoginUserResponse>(res, {
        statusCode: 200,
        success: true,
        message: 'User signed up successfully !',
        data: result,
    });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const { ...loginData } = req.body;
    const result = await AuthService.loginUser(loginData);
    const { refreshToken } = result;
    // set refresh token into cookie
    const cookieOptions = {
        secure: config.env === 'production',
        httpOnly: true,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

    sendResponse<ILoginUserResponse>(res, {
        statusCode: 200,
        success: true,
        message: 'User logged in successfully !',
        data: result,
    });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const result = await AuthService.refreshToken(refreshToken);

    // set refresh token into cookie
    const cookieOptions = {
        secure: config.env === 'production',
        httpOnly: true,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

    sendResponse<IRefreshTokenResponse>(res, {
        statusCode: 200,
        success: true,
        message: 'User logged in successfully !',
        data: result,
    });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const { ...passwordData } = req.body;

    await AuthService.changePassword(user, passwordData);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Password changed successfully !',
    });
});

export const userController = {
    loginUser,
    refreshToken,
    changePassword,
    registrationUser
};