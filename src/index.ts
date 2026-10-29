import express, { type Express, type Request, type Response } from 'express';  
const app: Express = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`Exemple app listening on port ${port}`)
});