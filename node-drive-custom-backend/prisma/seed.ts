import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const defaultStorage = await prisma.storageTypes.upsert({
        where: { id: 1 },
        update: {},
        create: {
            max_data: 10,
            price: 0
        }
    });

    const usrTeste = await prisma.user.upsert({
        where: { email: "teste@gmail.com" },
        update: {},
        create: {
            email: "teste@gmail.com",
            name: "Usuario de testes",
            storageTypeId: 1
        }
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
    })