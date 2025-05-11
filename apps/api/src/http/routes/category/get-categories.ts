import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { auth } from '@/http/middlewares/auth';
import { BadRequestError } from '../_errors/bad-request-error';
import { TransactionType } from '@prisma/client';

export async function getCategory(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/category/:type',
            {
                schema: {
                    tags: ['category'],
                    summary: 'List Categories',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        type: z.nativeEnum(TransactionType),
                    }),
                    response: {
                        200: z.array(
                            z.object({
                                id: z.string().uuid(),
                                name: z.string(),
                                userId: z.string(),
                                createdAt: z.string().datetime(),
                                updatedAt: z.string().datetime(),
                            })
                        ),
                    },
                },
            },
            async (request, reply) => {
                const userId = await request.getCurrentUserId();
                const { type } = request.params;
                const categories = await prisma.category.findMany({
                    where: { userId, hidden: false, type },
                });

                return reply.status(200).send(
                    categories.map((category) => ({
                        ...category,
                        createdAt: category.createdAt.toISOString(),
                        updatedAt: category.updatedAt.toISOString(),
                    }))
                );
            }
        );
}
