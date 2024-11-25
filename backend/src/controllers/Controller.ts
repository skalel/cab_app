import { PrismaClient } from "../../node_modules/.prisma/client"

class Controller {
  prisma: PrismaClient = new PrismaClient();
}

export default Controller
