import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";
import Auth from "../middleware/auth";

const prisma = new PrismaClient();

async function login(req: Request, res: Response): Promise<void> {
	const { email, password } = req.body;

	try {
		const user = await prisma.user.findUniqueOrThrow({
			where: {
				email,
			},
		});

		if (!user || !bcrypt.compareSync(password, user.password)) {
			res.status(401).json({ message: "Invalid email or password" });
		}

		const token = Auth.generateToken({ id: user.id, email: user.email });

		res.json({ token });
	} catch (error) {
		console.error("Error during login:", error);
		res.status(500).json({ message: "Internal Server Error" });
	} finally {
		await prisma.$disconnect();
	}
}

async function create(req: Request, res: Response) {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		const email = req.body.email;
		const checkEmailExists = await prisma.user.findFirst({
			where: {
				email,
			},
		});
		if (!checkEmailExists) {
			const user = await prisma.user.create({
				data: {
					name: req.body.name,
					email: req.body.email,
					telephone: req.body.telephone,
					role: req.body.role,
					password: hashedPassword,
				},
			});
			res.status(201).send({
				data: user,
			});
		} else res.status(400).send("E-mail is already taken.");
	} catch (error) {
		res.status(500).send(error);
	} finally {
		await prisma.$disconnect();
	}
}

export { login, create };
