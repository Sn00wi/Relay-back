import express, { type Express, type Request, type Response } from 'express';  
import { checkDatabaseConnection, prisma } from './database';
import { PrismaUserRepository } from './repositories/user.repository';
import { AuthService } from './services/auth.service';
import { ArgonHasher } from './security/password-hasher';
const app: Express = express();
const port = 3000;

//позволяет express парсить json для req.body
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({status:'ok'})
});   

app.post('/user/auth', (req: Request, res: Response) => {
  const { email, password } = req.body

  if (email == 111 && password == 11) {
    res.json({success:true, message: 'Welcome'})
  } else {
    res.status(401).json({success:false, message:'login error'})
  } 
  
})


const passwordHasher = new ArgonHasher()
const userRepository = new PrismaUserRepository(prisma)
const authService = new AuthService(userRepository, passwordHasher)


async function startServer() {

  try {
    await checkDatabaseConnection();
    console.log('Connection success');

    app.listen(port, () => {
      console.log(`Exemple app listening on port ${port}`)
    });
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }

  
}

startServer();
