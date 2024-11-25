import { Request, Response } from "express";
import { prisma } from "../services/Prisma";

import bcrypt from "bcrypt";

export default class UserController {
	public async all(req: Request, res: Response) {
		try {
			const users = await prisma.user.findMany();
			res.status(200).send({ users })
		} catch (error) {
			res.status(400).send(error);
		} finally {
			await prisma.$disconnect();
		}
	}

	public async findById(req: Request, res: Response) {
		try {
			const user = await prisma.user.findFirstOrThrow({
				where: {
					id: req.params.id
				}
			})
			res.status(200).send({ data: user })
		} catch (error) {
			res.status(404).send("User not found.")
		} finally {
			await prisma.$disconnect();
		}
	}

	public async update(req: Request, res: Response) {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);

		try {
			const user = await prisma.user.update({
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
		} catch (error) {
			res.status(401).send(error);
		} finally {
			await prisma.$disconnect();
		}
	}

	public async delete(req: Request, res: Response) {
		try {
			const user = await prisma.user.delete({
				where: {
					id: req.params.id
				}
			})
			res.status(200).send({
				data: user
			})
		} catch (error) {
			res.status(404).send(error);
		} finally {
			await prisma.$disconnect();
		}
	}
}
