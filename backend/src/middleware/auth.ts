import { jwt } from "jsonwebtoken";

class Auth {
	private static readonly JWT_SECRET: string = process.env.JWT_SECRET || "";

	static generateToken(payload: object): string {
		return jwt.sign(payload, this.JWT_SECRET, { expiresIn: "1h" });
	}

	static verifyToken(token: string): any {
		try {
			return jwt.verify(token, this.JWT_SECRET);
		} catch (error) {
			return null;
		}
	}
}

export default Auth;
