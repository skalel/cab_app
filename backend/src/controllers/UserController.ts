import { Request, Response } from "express";
import { prisma } from "../services/Prisma";

interface User {
	id: number
}
export default class UserController {
	public async all(req: Request, res: Response) {
		try {
			const users = await prisma.user.findMany({
				omit: {
					role: true,
					password: true,
					created_at: true,
					updated_at: true,
				},
			});
			res.status(200).json({ users });
		} catch (error) {
			res.status(400).json(error);
		} finally {
			await prisma.$disconnect();
		}
	}

	public async findById(req: Request<User>, res: Response) {
		try {
			const user = await prisma.user.findFirstOrThrow({
				where: {
					id: req.params.id,
				},
				omit: {
					role: true,
					password: true,
					created_at: true,
					updated_at: true,
				}
			});
			res.status(200).json({ user });
		} catch (error) {
			res.status(404).json("User not found.");
		} finally {
			await prisma.$disconnect();
		}
	}

	public async update(req: Request<User>, res: Response) {
		try {
			const user = await prisma.user.update({
				where: {
					id: req.params.id,
				},
				omit: {
					role: true,
					password: true,
					created_at: true,
					updated_at: true,
				},
				data: {
					name: req.body.name,
					email: req.body.email,
					telephone: req.body.telephone,
					role: req.body.role,
				},
			});
			res.status(202).json({
				user,
			});
		} catch (error) {
			res.status(401).json(error);
		} finally {
			await prisma.$disconnect();
		}
	}

	public async delete(req: Request<User>, res: Response) {
		try {
			const user = await prisma.user.delete({
				where: {
					id: req.params.id,
				},
			});
			res.status(200).json({
				message: "User deleted."
			});
		} catch (error) {
			res.status(404).json(error);
		} finally {
			await prisma.$disconnect();
		}
	}
}
