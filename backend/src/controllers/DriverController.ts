import { Request, Response } from "express";
import { prisma } from "../services/Prisma";

import bcrypt from "bcrypt";

interface Driver {
	id: number;
}

export default class DriverController {
	public async all(req: Request, res: Response) {
		try {
			const drivers = await prisma.driver.findMany();
			res.status(200).send({ drivers });
		} catch (error) {
			res.status(400).send(error);
		} finally {
			await prisma.$disconnect();
		}
	}

	public async create(req: Request, res: Response) {
		try {
			const email = req.body.email;
			const checkIfEmailExists = await prisma.driver.findFirst({
				where: {
					email,
				},
			});
			if (!checkIfEmailExists) {
				const driver = await prisma.driver.create({
					data: {
						name: req.body.name,
						email: req.body.email,
						description: req.body.description,
						car: req.body.car,
						tax: req.body.tax,
						min_distance: req.body.min_distance,
					},
				});
				res.status(201).send({
					data: driver,
				});
			} else res.status(400).send("Driver already exists.");
		} catch (error) {
			res.status(500).send(error);
		}
	}

	public async findById(req: Request<Driver>, res: Response) {
		try {
			const driver = await prisma.driver.findFirstOrThrow({
				where: {
					id: Number(req.params.id),
				},
			});
			res.status(200).send({ data: driver });
		} catch (error) {
			res.status(404).send("Driver not found.");
		} finally {
			await prisma.$disconnect();
		}
	}

	public async update(req: Request<Driver>, res: Response) {
		try {
			const driver = await prisma.driver.update({
				where: {
					id: Number(req.params.id),
				},
				data: {
					name: req.body.name,
					email: req.body.email,
					description: req.body.description,
					car: req.body.car,
					tax: req.body.tax,
					min_distance: req.body.min_distance,
				},
			});
			res.status(202).send({
				data: driver,
			});
		} catch (error) {
			res.status(401).send(error);
		} finally {
			await prisma.$disconnect();
		}
	}

	public async delete(req: Request<Driver>, res: Response) {
		try {
			const driver = await prisma.driver.delete({
				where: {
					id: Number(req.params.id),
				},
			});
			res.status(200).send({
				data: driver,
			});
		} catch (error) {
			res.status(404).send(error);
		} finally {
			await prisma.$disconnect();
		}
	}
}