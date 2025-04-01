import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { auth } from '@/http/middlewares/auth';
import { BadRequestError } from '../_errors/bad-request-error';

export async function deleteTransaction(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .delete(
            '/transaction/:id',
            {
                schema: {
                    tags: ['transaction'],
                    summary: 'Delete a transaction',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        id: z.string().uuid(),
                    }),
                    response: {
                        204: z.null(),
                    },
                },
            },
            async (request, reply) => {
                const { id } = request.params;

                const transaction = await prisma.transaction.findUnique({
                    where: { id },
                });

                if (!transaction) {
                    throw new BadRequestError('Transaction not found');
                }

                await prisma.transaction.delete({
                    where: {
                        id,
                    },
                });

                return reply.status(204).send();
            }
        );
}
