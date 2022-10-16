import { compareSync, hashSync } from "bcrypt";

const saltOrRounds = 13;

export const hash = (password: string) => {
  return hashSync(password, saltOrRounds);
};

export const compare = (password: string, hashPassword: string) => {
  return compareSync(password, hashPassword);
};
