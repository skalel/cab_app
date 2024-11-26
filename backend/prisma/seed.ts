import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	await prisma.user.createMany({
		data: [
			{
				name: "Admin",
				email: "admin@admin.com",
				password: "admin@123",
				telephone: "551122334455",
			},
			{ name: "Alice", email: "alice@example.com", telephone: "551122334455" },
			{ name: "Bob", email: "bob@example.com" },
		],
	});

	await prisma.driver.createMany({
		data: [
			{
				name:"Homer Simpson",
				description:"Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).",
				car:"Plymouth Valiant 1973 rosa e enferrujado",
				tax:2.5,
				min_distance:1000,
				rating: {
					"rating": 2,
					"description": "Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts."
				}
			},
			{
				name:"Dominic Toretto",
				description:"Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.",
				car:"Dodge Charger R/T 1970 modificado",
				tax:5,
				min_distance:5000,
				rating: {
					"rating": 4,
					"description": "Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!"
				}
			},
			{
				name:"James Bond",
				description:"Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.",
				car:"Aston Martin DB5 clássico",
				tax:10,
				min_distance:10000,
				rating: {
					"rating": 5,
					"description": "Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto."
				}
			}
		],
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
