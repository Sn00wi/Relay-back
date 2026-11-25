import express, { type Express, type Request, type Response } from 'express';  
import { checkDatabaseConnection, prisma } from './database';
import { AuthService, UserService, SessionService } from './services';
import { PrismaUserRepository, PrismaSessionRepository } from './repositories'; 
import { ArgonHasher } from './security'; 
import mainRoute from './routes/mainRoute';
import { errorMiddleware } from './middlewares/error.middleware';


const app: Express = express();
//позволяет express парсить json для req.body
app.use(express.json());
app.use('/relay', mainRoute);


// создание зависимостей 
const passwordHasher = new ArgonHasher()
const userRepository = new PrismaUserRepository(prisma)
const prismaSessionRepository = new PrismaSessionRepository(prisma)
const sessionService = new SessionService(prismaSessionRepository)
const userService = new UserService(userRepository)
const authService = new AuthService(userService, passwordHasher, sessionService)

app.use(errorMiddleware);