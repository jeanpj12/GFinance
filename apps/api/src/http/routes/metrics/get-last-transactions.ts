import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { auth } from '@/http/middlewares/auth';
import { BadRequestError } from '../_errors/bad-request-error';
import { TransactionType } from '@prisma/client';

export async function getLastTransactions(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/metrics/last-transactions',
            {
                schema: {
                    tags: ['metrics'],
                    summary: 'List transaction',
                    security: [{ bearerAuth: [] }],
                    response: {
                        200: z.array(
                            z.object({
                                id: z.string(),
                                name: z.string(),
                                amount: z.number(),
                                dueDate: z.string().datetime(),
                                type: z.nativeEnum(TransactionType),
                            })
                        ),
                    },
                },
            },
            async (request, reply) => {
                const transactions = await prisma.transaction.findMany({
                    select: {
                        id: true,
                        name: true,
                        amount: true,
                        dueDate: true,
                        type: true,
                    },
                    orderBy: { createdAt: 'desc' },
                });

                const data = transactions.map((transaction) => ({
                    ...transaction,
                    amount: transaction.amount.toNumber(),
                    dueDate: transaction.dueDate.toISOString()
                }));

                return reply.status(200).send(data);
            }
        );
}
