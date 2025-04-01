import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { auth } from '@/http/middlewares/auth';
import { BadRequestError } from '../_errors/bad-request-error';
import { TransactionType } from '@prisma/client';

export async function getTransactions(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/transaction',
            {
                schema: {
                    tags: ['transaction'],
                    summary: 'List transaction',
                    security: [{ bearerAuth: [] }],
                    querystring: z.object({
                        id: z.string().uuid().optional(),
                    }),
                    response: {
                        200: z.array(
                            z.object({
                                id: z.string().uuid(),
                                name: z.string(),
                                amount: z.number(),
                                description: z.string().nullable(),
                                type: z.nativeEnum(TransactionType),
                                categoryId: z.string().uuid(),
                                subCategoryId: z.string().uuid().nullable(),
                                isPaid: z.boolean(),
                                dueDate: z.string().datetime(),
                            })
                        ),
                    },
                },
            },
            async (request, reply) => {
                const { id } = request.query;

                if (id) {
                    const transaction = await prisma.transaction.findUnique({
                        where: { id },
                        select: {
                            id: true,
                            name: true,
                            amount: true,
                            description: true,
                            type: true,
                            categoryId: true,
                            subCategoryId: true,
                            isPaid: true,
                            dueDate: true,
                        },
                    });

                    if (!transaction) {
                        throw new BadRequestError('Transaction not found');
                    }

                    return reply.status(200).send([
                        {
                            ...transaction,
                            amount: transaction.amount.toNumber(),
                            dueDate: transaction.dueDate.toISOString(),
                        },
                    ]);
                }

                const transactions = await prisma.transaction.findMany({
                    select: {
                        id: true,
                        name: true,
                        amount: true,
                        description: true,
                        type: true,
                        categoryId: true,
                        subCategoryId: true,
                        isPaid: true,
                        dueDate: true,
                    },
                });

                return reply.status(200).send(
                    transactions.map((transaction) => ({
                        ...transaction,
                        amount: transaction.amount.toNumber(),
                        dueDate: transaction.dueDate.toISOString(),
                    }))
                );
            }
        );
}
