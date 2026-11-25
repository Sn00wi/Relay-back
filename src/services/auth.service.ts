import type { UserService } from "../services/user.service";
import type { PasswordHasher } from "../security/password-hasher";
import type { SessionService } from "./session.service";
import { AppError } from "../errors/AppError";

export class AuthService {
  //позволяет использовать методы объектов UserRepository и PasswordHasher
  constructor(private readonly userService: UserService, private readonly passwordHasher: PasswordHasher, private readonly sessionService: SessionService) { }

  async login(login: string, password: string) {
    const isEmail = login.includes('@');

    let user;
    
    if (isEmail) {
        user = await this.userService.getUserByEmail(login);
    } else {
        user = await this.userService.getUserByUserName(login);
    }
    
    if (!user) { throw new AppError(401, `Incorrect email or password`) }

    const checkPassword = await this.passwordHasher.verifyPassword(user.passwordHash, password)
    if (!checkPassword) {throw new AppError(401, `Incorrect email or password`)}

    const { token } = await this.sessionService.createSession(user.id)
    
    return {token, user: {id: user.id , email: user.email, nickName: user.nickName, userName: user.userName}}
  }

  async registration(createData: { email: string, password: string, nickName: string, userName: string, }): Promise<void> { 
    const forbiddenCharsRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    const validUserName = forbiddenCharsRegex.test(createData.userName)
    
    if (!validUserName) {
      throw new AppError(422, 'Invalid username format')
    }

    const checkEmail = await this.userService.getUserByEmail(createData.email)
    const checkUserName = await this.userService.getUserByUserName(createData.userName)
    if (checkEmail) {
      throw new AppError(409, 'This email is already registered')
    }
    if (checkUserName) {
      throw new AppError(409, 'This username is already taken')
    }
    
      const passwordHash = await this.passwordHasher.hashPassword(createData.password)
      const data = {
          email: createData.email,
          passwordHash: passwordHash,
          nickName: createData.nickName,
          userName: createData.userName,
        };
      await this.userService.createUser(data)
    
  }
}