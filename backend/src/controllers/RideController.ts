import { Request, Response } from "express";
import { prisma } from "../services/Prisma";

interface Ride {
	customer_id: string,
	origin: string,
	destination: string
}

export default class RideController {
	public async estimate(req: Request<Ride>, res: Response) {
		const { customer_id, origin, destination } = req.body;

		if (!customer_id) {
			res.status(400).send({
				success: false,
				error_message: 'Customer ID must be provided.'
			});
		}

		if (!origin || !destination){
			res.status(400).send({
				success: false,
				error_message: 'Ride parameters must be informed.'
			});
		}

		// TODO: Implementar método para diferenciar tipos de input de origin/destination


	}
}
