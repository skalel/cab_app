import { Request, Response } from "express";
import Controller from "./Controller";

import bcrypt from "bcrypt";

interface User {
	id: number;
  name: string;
  email: string;
  telephone?: string;
  role: string;
  password: string;
}

export default class UserController extends Controller {
  public async all(req: Request, res: Response){
    try{
      const users = await this.prisma.user.findMany();
      res.status(200).send({ users })
    }catch(error){
      res.status(400).send(error);
    }
  }

  public async findByEmail(req:Request, res:Response){
    try{
      const user = await this.prisma.user.findFirstOrThrow({
        where: {
          email: req.params.email
        }
      })
      res.status(200).send({ data: user })
    }catch(error){
      res.status(404).send("User not found.")
    }
  }

  public async update(req:Request<User>,res:Response){
		const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try{
      const user = await this.prisma.user.update({
        where: {
          id: req.params.id
        },
        data: {
          name: req.body.name,
          email: req.body.email,
          telephone: req.body.telephone,
          role: req.body.role,
          password: hashedPassword
        }
      })
      res.status(202).send({
        data: user
      })
    }catch(error){
      res.status(401).send(error);
    }
  }

  public async delete(req:Request<User>,res:Response){
    try{
      const user = await this.prisma.user.delete({
        where: {
          id: req.params.id
        }
      })
      res.status(200).send({
        data: user
      })
    }catch(error){
      res.status(404).send(error);
    }
  }
}
