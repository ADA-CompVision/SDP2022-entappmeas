import { User } from "@prisma/client";

export type UserWithoutPassword = Omit<User, "password">;
export type SignedUser = UserWithoutPassword & { iat: number; exp: number };
export type NewUser = Omit<User, "id" | "role">;
