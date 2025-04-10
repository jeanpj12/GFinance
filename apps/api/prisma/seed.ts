import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    await prisma.transaction.deleteMany();

    const user = await prisma.user.findFirst({
        where: {
            id: '01b920c2-dd18-4059-b421-73541d3e0db4',
        },
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Criar categorias e subcategorias
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Moradia',
                userId: user.id,
                SubCategories: {
                    create: [
                        { name: 'Aluguel' },
                        { name: 'Condomínio' },
                        { name: 'Contas de Luz/Água' },
                    ],
                },
            },
        }),
        prisma.category.create({
            data: {
                name: 'Transporte',
                userId: user.id,
                SubCategories: {
                    create: [
                        { name: 'Combustível' },
                        { name: 'Transporte Público' },
                    ],
                },
            },
        }),
        prisma.category.create({
            data: {
                name: 'Renda',
                userId: user.id,
                SubCategories: {
                    create: [{ name: 'Salário' }, { name: 'Freelance' }],
                },
            },
        }),
    ]);

    const subCategories = await prisma.subCategory.findMany({
        where: {
            categoryId: { in: categories.map((c) => c.id) },
        },
    });

    const findSub = (name: string) =>
        subCategories.find((sub) => sub.name === name)!;

    // Criar transações realistas
    await prisma.transaction.createMany({
        data: [
            // Receita semanal
            {
                userId: user.id,
                name: 'Salário Abril',
                amount: 7500,
                description: 'Pagamento mensal do salário',
                type: 'INCOME',
                categoryId: categories.find((c) => c.name === 'Renda')!.id,
                subCategoryId: findSub('Salário').id,
                isPaid: true,
                dueDate: new Date('2025-04-01T10:00:00.000Z'),
                datePost: new Date('2025-04-01T10:00:00.000Z'),
                toEmergencyFund: true,
            },

            // 31/03
            {
                userId: user.id,
                name: 'Mercado',
                amount: 220,
                description: 'Compras do mês',
                type: 'EXPENSE',
                categoryId: categories.find((c) => c.name === 'Moradia')!.id,
                subCategoryId: findSub('Contas de Luz/Água').id,
                isPaid: true,
                dueDate: new Date('2025-03-31T18:00:00.000Z'),
                datePost: new Date('2025-03-31T18:00:00.000Z'),
                toEmergencyFund: false,
            },

            // 01/04 - já tem receita, vamos adicionar mais uma despesa
            {
                userId: user.id,
                name: 'Almoço fora',
                amount: 45,
                description: 'Restaurante com colegas',
                type: 'EXPENSE',
                categoryId: categories.find((c) => c.name === 'Transporte')!.id,
                subCategoryId: findSub('Transporte Público').id,
                isPaid: true,
                dueDate: new Date('2025-04-01T13:00:00.000Z'),
                datePost: new Date('2025-04-01T13:00:00.000Z'),
                toEmergencyFund: false,
            },

            // 02/04
            {
                userId: user.id,
                name: 'Farmácia',
                amount: 80,
                description: 'Remédio para dor',
                type: 'EXPENSE',
                categoryId: categories.find((c) => c.name === 'Moradia')!.id,
                subCategoryId: findSub('Condomínio').id,
                isPaid: true,
                dueDate: new Date('2025-04-02T11:00:00.000Z'),
                datePost: new Date('2025-04-02T11:00:00.000Z'),
                toEmergencyFund: false,
            },

            // 03/04
            {
                userId: user.id,
                name: 'Gasolina',
                amount: 150,
                description: 'Abastecimento semanal',
                type: 'EXPENSE',
                categoryId: categories.find((c) => c.name === 'Transporte')!.id,
                subCategoryId: findSub('Combustível').id,
                isPaid: true,
                dueDate: new Date('2025-04-03T09:00:00.000Z'),
                datePost: new Date('2025-04-03T09:00:00.000Z'),
                toEmergencyFund: false,
            },

            // 04/04
            {
                userId: user.id,
                name: 'Delivery jantar',
                amount: 60,
                description: 'Pizza com a família',
                type: 'EXPENSE',
                categoryId: categories.find((c) => c.name === 'Moradia')!.id,
                subCategoryId: findSub('Aluguel').id,
                isPaid: true,
                dueDate: new Date('2025-04-04T20:00:00.000Z'),
                datePost: new Date('2025-04-04T20:00:00.000Z'),
                toEmergencyFund: false,
            },

            // 05/04
            {
                userId: user.id,
                name: 'Uber',
                amount: 35,
                description: 'Deslocamento à noite',
                type: 'EXPENSE',
                categoryId: categories.find((c) => c.name === 'Transporte')!.id,
                subCategoryId: findSub('Transporte Público').id,
                isPaid: true,
                dueDate: new Date('2025-04-05T22:00:00.000Z'),
                datePost: new Date('2025-04-05T22:00:00.000Z'),
                toEmergencyFund: false,
            },

            // 06/04
            {
                userId: user.id,
                name: 'Feira',
                amount: 70,
                description: 'Frutas e verduras',
                type: 'EXPENSE',
                categoryId: categories.find((c) => c.name === 'Moradia')!.id,
                subCategoryId: findSub('Contas de Luz/Água').id,
                isPaid: true,
                dueDate: new Date('2025-04-06T08:30:00.000Z'),
                datePost: new Date('2025-04-06T08:30:00.000Z'),
                toEmergencyFund: false,
            },

            // 07/04
            {
                userId: user.id,
                name: 'Padaria',
                amount: 25,
                description: 'Pão e café',
                type: 'EXPENSE',
                categoryId: categories.find((c) => c.name === 'Moradia')!.id,
                subCategoryId: findSub('Condomínio').id,
                isPaid: true,
                dueDate: new Date('2025-04-07T07:45:00.000Z'),
                datePost: new Date('2025-04-07T07:45:00.000Z'),
                toEmergencyFund: false,
            },
        ],
    });

}

seed()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
