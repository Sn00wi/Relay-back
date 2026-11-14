import type { UserRepository } from "../repositories/user.repository";
import type { PasswordHasher } from "../security/password-hasher";

export class AuthService {
  //позволяет использовать методы объектов UserRepository и PasswordHasher
  constructor(private readonly userRepository: UserRepository, private readonly passwordHasher: PasswordHasher) { }

  async login(login: string, password: string) {
    const isEmail = login.includes('@');

    let user;
    
    if (isEmail) {
        user = await this.userRepository.findByEmail(login);
    } else {
        user = await this.userRepository.findByUserName(login);
    }
    
    if (!user) { throw new Error(`Incorrect email or password`) }

    const checkPassword = await this.passwordHasher.verifyPassword(user.passwordHash, password)
    if (!checkPassword) {throw new Error(`Incorrect email or password`)}

    return { id: user.id , email: user.email, nickName: user.nickName, userName: user.userName}
  }

  async registration(createData: { email: string, password: string, nickName: string, userName: string, }): Promise<void> { 
    const forbiddenCharsRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    const validUserName = forbiddenCharsRegex.test(createData.userName)
    
    if (!validUserName) {
      throw new Error('Invalid username format')
    }

    const checkEmail = await this.userRepository.findByEmail(createData.email)
    const checkUserName = await this.userRepository.findByUserName(createData.userName)
    if (checkEmail) {
      throw new Error('This email is already registered')
    }
    if (checkUserName) {
      throw new Error('This username is already taken')
    }
    
      const passwordHash = await this.passwordHasher.hashPassword(createData.password)
      const data = {
          email: createData.email,
          passwordHash: passwordHash,
          nickName: createData.nickName,
          userName: createData.userName,
        };
      await this.userRepository.create(data)
    
  }
}