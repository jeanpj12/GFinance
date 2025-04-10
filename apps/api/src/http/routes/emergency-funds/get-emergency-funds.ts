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
                                amount: z.number(),
                                transactionId: z.string().uuid(),
                                isPaid: z.boolean(),
                                dueDate: z.string().datetime(),
                            })
                        ),
                    },
                },
            },
            async (request, reply) => {
                const emegencyFunds = await prisma.emergencyFund.findMany({
                    select: {
                        id: true,
                        amount: true,
                        isPaid: true,
                        transactionId: true,
                        dueDate: true,
                    },
                });

                if (!emegencyFunds) {
                    throw new BadRequestError('Emergency Funds not found');
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
