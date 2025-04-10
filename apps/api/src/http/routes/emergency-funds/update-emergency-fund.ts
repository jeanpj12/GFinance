import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { auth } from '@/http/middlewares/auth';
import { BadRequestError } from '../_errors/bad-request-error';

export async function updateEmergencyFund(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .patch(
            '/transaction/emergency-funds/:id',
            {
                schema: {
                    tags: ['emergency-funds'],
                    summary: 'Update emergency funds',
                    security: [{ bearerAuth: [] }],
                    params: z.object({ id: z.string().uuid() }),
                    body: z.object({
                        amount: z.number().optional(),
                        isPaid: z.boolean().optional(),
                        dueDate: z.coerce.date().optional(),
                        datePost: z.coerce.date().optional(),
                    }),
                    response: {
                        201: z.null(),
                    },
                },
            },
            async (request, reply) => {
                const { amount, dueDate, isPaid, datePost } = request.body;
                const emergencyFundId = request.params.id;
                const userId = await request.getCurrentUserId();

                const emergencyFund = await prisma.emergencyFund.findUnique({
                    where: { id: emergencyFundId },
                });

                if (!emergencyFund) {
                    throw new BadRequestError('Emergency Fund not found');
                }

                await prisma.transaction.update({
                    where: {
                        id: emergencyFund.transactionId,
                    },
                    data: {
                        amount,
                        dueDate,
                        isPaid,
                        datePost,
                    },
                });

                await prisma.emergencyFund.update({
                    where: {
                        id: emergencyFundId,
                    },
                    data: {
                        amount,
                        dueDate,
                        isPaid,
                        datePost,
                    },
                });

                return reply.status(201).send();
            }
        );
}
