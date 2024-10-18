import { Role } from "../enums";

export const hasPermission = (userRoles: Role[], accessRoles: Role[]) =>
  [...userRoles].some((role) => accessRoles.includes(role));
