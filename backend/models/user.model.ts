import { UserModel, PublicUser } from '../types/model.types';

/** Re-export model types for convenience */
export type { UserModel, PublicUser };

/** Helper: strips password from a user object before returning it */
export const toPublicUser = (user: UserModel): PublicUser => {
  const { password, ...publicUser } = user;
  return publicUser;
};
