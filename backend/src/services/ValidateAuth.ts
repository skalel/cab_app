import { Request, Response, NextFunction } from "express";
import Auth from "../middleware/auth";

function ValidateAuth(req: Request, res: Response, next: NextFunction): void {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		res.status(401).json({ message: "Auth Token has not been provided." });
		return;
	}

	const decodedToken = Auth.verifyToken(token);

	if (!decodedToken) {
		res.status(401).json({ message: "Invalid Token." });
		return;
	}

	console.log(decodedToken);

	next();
}

export default ValidateAuth;
