import { ContextFunction } from 'apollo-server-core';
import { db } from './models';
import { verifyToken } from "./helpers/verifyToken";
import { Types } from 'mongoose';
import { UserInterface } from './models/user.model';

const User = db.user;
const Role = db.role;

export interface ContextInterface {
  user: UserInterface | null,
  isUser: boolean,
  isAdmin: boolean
}

export const context: ContextFunction<any, ContextInterface> = async ({ req }) => {
    const token = req.headers['x-access-token'];

    // Get userId

    let userId: string | null = null;

    if (typeof token === 'string') {
      let tempId = await verifyToken(token);

      if (typeof tempId === 'string') {
        userId = tempId;
      }
    }

    // Get user from user Id

    let user: UserInterface | null = null;

    if (typeof userId === 'string' && Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId).populate('roles', '-__v');
    }

    // Get roles

    let isAdmin: boolean = false;
    let isUser: boolean = false;

    if (user) {
      user.roles.forEach(role => {
        if (role.name === 'admin') isAdmin = true;
        if (role.name === 'user') isUser = true;
      });
    }

    return {
      user,
      isUser,
      isAdmin
    }
};
