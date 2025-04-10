import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { auth } from '@/http/middlewares/auth';
import { BadRequestError } from '../_errors/bad-request-error';

export async function updateTransaction(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .patch(
            '/transaction/:id',
            {
                schema: {
                    tags: ['transaction'],
                    summary: 'Update a transaction',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        id: z.string().uuid(),
                    }),
                    body: z.object({
                        name: z.string().optional(),
                        amount: z.number().optional(),
                        description: z.string().optional(),
                        categoryId: z.string().uuid().optional(),
                        subCategoryId: z.string().uuid().optional(),
                        isPaid: z.boolean().optional(),
                        dueDate: z.string().datetime().optional(),
                        datePost: z.string().datetime().optional(),
                    }),
                    response: {
                        204: z.null(),
                    },
                },
            },
            async (request, reply) => {
                const data = request.body;

                const { id } = request.params;

                const transaction = await prisma.transaction.findUnique({
                    where: { id },
                });

                if (!transaction) {
                    throw new BadRequestError('Transaction not found');
                }

                await prisma.transaction.update({
                    where: {
                        id,
                    },
                    data: {
                        ...transaction,
                        ...data,
                    },
                });

                return reply.status(204).send();
            }
        );
}
