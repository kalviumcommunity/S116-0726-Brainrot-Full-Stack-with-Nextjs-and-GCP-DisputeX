"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicUser = void 0;
/** Helper: strips password from a user object before returning it */
const toPublicUser = (user) => {
    const { password, ...publicUser } = user;
    return publicUser;
};
exports.toPublicUser = toPublicUser;
