import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) =>
  bcrypt.hashSync(password, 10);

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => bcrypt.compareSync(password, hashedPassword);
