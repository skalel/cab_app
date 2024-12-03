import { Request, Response } from "express";
import { prisma } from "../services/Prisma";
import axios from "axios";

interface Ride {
	customer_id: string;
	origin: string;
	destination: string;
}

const GOOGLE_API_URL =
	"https://routes.googleapis.com/directions/v2:computeRoutes?key=";

export default class RideController {
	public async all(req: Request, res: Response) {
		try {
			const drivers = await prisma.driver.findMany();
			res.status(200).json({ drivers });
		} catch (error) {
			res.status(400).json(error);
		} finally {
			await prisma.$disconnect();
		}
	}

	public async estimate(req: Request<Ride>, res: Response) {
		const { customer_id, origin, destination } = req.body;

		if (!customer_id && !origin && !destination) {
			res.status(400).json({
				error_code: "INVALID_DATA",
				error_description: "The fields must be provided to estimate a ride.",
			});
			return;
		}

		const user_id = Number(customer_id);

		const customer = await prisma.user.findMany({
			where: {
				id: user_id,
			},
		});

		if (!customer_id || !customer.length) {
			res.status(400).json({
				error_code: "INVALID_DATA",
				error_description: "A valid Customer ID must be provided.",
			});
			return;
		}

		if (!origin || !destination) {
			res.status(400).json({
				error_code: "INVALID_DATA",
				error_description: "Origin/Destination can't be empty.",
			});
			return;
		}

		if (origin === destination) {
			res.status(400).json({
				error_code: "INVALID_DATA",
				error_description: "Origin/Destination can't be the same.",
			});
			return;
		}

		try {
			const response = await axios.post(
				GOOGLE_API_URL + process.env.GOOGLE_API_KEY,
				{
					origin: { address: origin },
					destination: { address: destination },
					travelMode: "DRIVE",
					routingPreference: "TRAFFIC_AWARE",
				},
				{
					headers: {
						"X-Goog-FieldMask":
							"routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline,routes.legs.startLocation.latLng,routes.legs.endLocation.latLng",
					},
				}
			);

			const route = response.data.routes[0];

			if (!route) {
				res
					.status(400)
					.json({ message: "No route found between origin and destination." });
				return;
			}

			const distanceInMeters = route.distanceMeters;

			const drivers = await prisma.driver.findMany({
				where: {
					min_distance: { lte: distanceInMeters },
				},
			});

			if (!drivers.length) {
				res
					.status(404)
					.json({ message: "No drivers available for this trip." });
				return;
			}

			const estimatedValues = drivers.map((driver) => {
				const value = calculateRideValue(distanceInMeters, driver.tax);
				const roundedValue = (value / 1000).toFixed(2);
				return {
					id: driver.id,
					name: driver.name,
					description: driver.description,
					vehicle: driver.car,
					review: driver.rating,
					value: parseFloat(roundedValue),
				};
			});

			res.status(200).json({
				origin: {
					latitude: route.legs[0].startLocation.latLng.latitude,
					longitude: route.legs[0].startLocation.latLng.longitude,
				},
				destination: {
					latitude: route.legs[0].endLocation.latLng.latitude,
					longitude: route.legs[0].endLocation.latLng.longitude,
				},
				distance: route.distanceMeters,
				duration: route.duration,
				options: [estimatedValues],
				routeResponse: response.data,
			});
		} catch (error) {
			console.error("Error in /ride/estimate:", error);
			res.status(500).json({
				error_code: "INTERNAL_ERROR",
				error_description: "An unexpected error occurred."
			});
			return;
		}

		function calculateRideValue(distance: number, perKmRate: number): number {
			let valor = distance * perKmRate;
			return parseFloat(valor.toFixed(2));
		}
	}

	public async confirm(req: Request, res: Response): Promise<void> {
		const { customer_id, origin, destination, distance, duration, driver, value } = req.body;

		if (!customer_id || !origin || !destination || !driver || !distance || !value || !duration) {
			res.status(400).json({
				error_code: "INVALID_DATA",
				error_description: "All required fields must be provided.",
			});
			return;
		};

		if (origin.trim() === "" || destination.trim() === "") {
			res.status(400).json({
				error_code: "INVALID_DATA",
				error_description: "Origin and destination cannot be empty.",
			});
			return;
		}

		const customerId = Number(customer_id);

		const customer = await prisma.user.findMany({
			where: {
				id: customerId,
			},
		});

		if (!customer_id || !customer.length) {
			res.status(400).json({
				error_code: "INVALID_DATA",
				error_description: "A valid Customer ID must be provided.",
			});
			return;
		}

		if (origin === destination) {
			res.status(400).json({
				error_code: "INVALID_DATA",
				error_description: "Origin and destination cannot be the same address.",
			});
			return;
		}

		try {
			const driver = await prisma.driver.findUnique({
				where: { id: req.body.driver.id },
			});

			if (!driver) {
				res.status(404).json({
					error_code: "DRIVER_NOT_FOUND",
					error_description: `Driver identified as ${req.body.driver.id} not found.`,
				});
				return;
			}

			if (distance < driver.min_distance) {
				res.status(406).json({
					error_code: "INVALID_DISTANCE",
					error_description: `The distance ${distance}km exceeds the limit for the selected driver.`,
				});
				return;
			}

			const ride = await prisma.travel.create({
				data: {
					user_id: Number(customer_id),
					driver_id: Number(driver.id),
					origin,
					destiny: destination,
					distance,
					duration: duration,
					cost: value,
					status: "FINISHED"
				},
			});

			res.status(200).json({
				success: true,
			});
			return;
		} catch (error) {
			console.error("Error confirming ride:", error);
			res.status(500).json({
				error_code: "INTERNAL_ERROR",
				error_description: "Your ride could not be confirmed.",
			});
			return;
		}
	}

	public async get(req: Request, res: Response): Promise<void> {
		res.status(400).json({
			error_code: "INVALID_DATA",
			error_description: "A customer ID must be provided.",
		});
		return;
	}

	public async getRides(req: Request, res: Response): Promise<void> {
		const { customer_id } = req.params;
		const { driver_id } = req.query;

		if (customer_id && isNaN(Number(customer_id))) {
			res.status(400).json({
				error_code: "INVALID_DATA",
				error_description: "A customer ID must be provided.",
			});
			return;
		}

		if (driver_id && isNaN(Number(driver_id))) {
			res.status(400).json({
				error_code: "INVALID_DRIVER",
				error_description: "Driver ID must be a valid number.",
			});
			return;
		}

		try {
			const rides = await prisma.travel.findMany({
				where: {
					user_id: Number(customer_id),
					...(driver_id ? { driver_id: Number(driver_id) } : {}),
				},
				orderBy: {
					created_at: "desc",
				},
				select: {
					id: true,
					created_at: true,
					origin: true,
					destiny: true,
					distance: true,
					duration: true,
					cost: true,
					driver: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			});

			if (rides.length === 0) {
				res.status(404).json({
					error_code: "NO_RIDES_FOUND",
					error_description: "No rides found for the specified customer.",
				});
				return;
			}

			res.status(200).json({
				customer_id,
				rides: rides.map((ride) => ({
					id: ride.id,
					date: ride.created_at,
					origin: ride.origin,
					destination: ride.destiny,
					distance: ride.distance,
					duration: ride.duration,
					driver: ride.driver,
					value: ride.cost,
				})),
			});
		} catch (error) {
			console.error("Error fetching rides:", error);
			res.status(500).json({
				error_code: "INTERNAL_ERROR",
				error_description: "An error occurred while fetching the rides.",
			});
		}
	}
}
