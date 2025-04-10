import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { auth } from '@/http/middlewares/auth';
import { BadRequestError } from '../_errors/bad-request-error';

export async function createEmergencyFund(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post(
            '/transaction/emergency-funds',
            {
                schema: {
                    tags: ['emergency-funds'],
                    summary: 'Create a new emergency funds',
                    security: [{ bearerAuth: [] }],
                    body: z.object({
                        amount: z.number(),
                        isPaid: z.boolean(),
                        dueDate: z.coerce.date(),
                        datePost: z.coerce.date().optional(),
                    }),
                    response: {
                        201: z.null(),
                    },
                },
            },
            async (request, reply) => {
                const { amount, dueDate, isPaid, datePost } = request.body;

                const userId = await request.getCurrentUserId();
                const emergencyCategory = await prisma.category.findFirst({
                    where: {
                        userId,
                        name: 'Emergency Fund',
                    },
                });

                if (!emergencyCategory) {
                    throw new BadRequestError(
                        'Category "Emergency Fund" not found.'
                    );
                }

                const transaction = await prisma.transaction.create({
                    data: {
                        name: 'Emergency Fund',
                        userId,
                        amount,
                        description: undefined,
                        categoryId: emergencyCategory.id,
                        dueDate,
                        isPaid,
                        type: 'EXPENSE',
                        datePost: datePost ? datePost : undefined,
                    },
                });

                await prisma.emergencyFund.create({
                    data: {
                        userId,
                        amount,
                        dueDate,
                        isPaid,
                        transactionId: transaction.id,
                        datePost: datePost ? datePost : undefined,
                    },
                });

                return reply.status(201).send();
            }
        );
}
