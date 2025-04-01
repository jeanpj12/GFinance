import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { auth } from '@/http/middlewares/auth';
import { BadRequestError } from '../_errors/bad-request-error';
import { TransactionType } from '@prisma/client';

export async function getEmergencyFunds(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/transaction/emergency-funds',
            {
                schema: {
                    tags: ['emergency-funds'],
                    summary: 'List emergency funds',
                    security: [{ bearerAuth: [] }],
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
                const emegencyFunds = await prisma.transaction.findMany({
                    where: { toEmergencyFund: true },
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

                if (!emegencyFunds) {
                    throw new BadRequestError('Transaction not found');
                }

                return reply.status(200).send(
                    emegencyFunds.map((transaction) => ({
                        ...transaction,
                        amount: transaction.amount.toNumber(),
                        dueDate: transaction.dueDate.toISOString(),
                    }))
                );
            }
        );
}
