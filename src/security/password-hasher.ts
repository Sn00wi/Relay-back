import * as argon2 from 'argon2';


export interface PasswordHasher {
  // создание хэша пароля при регистрации
  hashPassword(password: string): Promise<string>;
  // проверка пароля, сравнение хэша пароля с переданным паролем
  verifyPassword(hash: string, password: string): Promise<boolean>;
}

export class ArgonHasher implements PasswordHasher {
  async hashPassword(password: string): Promise<string> {
    try {
        return await argon2.hash(password)
    } catch (error) {
      throw new Error('error of hashing password', {cause: error})
      }
    }


  async verifyPassword(hash: string, password: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password)
    } catch (error) {
      throw new Error('error of password verify', {cause: error})
    }
  }
  
}


