import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { auth } from '@/http/middlewares/auth';
import { BadRequestError } from '../_errors/bad-request-error';

export async function updateCategory(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .patch(
            '/category/:id',
            {
                schema: {
                    tags: ['category'],
                    summary: 'Update a category',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        id: z.string().uuid(),
                    }),
                    body: z.object({
                        name: z.string(),
                    }),
                    response: {
                        201: z.null(),
                    },
                },
            },
            async (request, reply) => {
                const { name } = request.body;
                const { id } = request.params;

                const category = await prisma.category.findUnique({
                    where: { id },
                });

                if (!category) {
                    throw new BadRequestError('Category not found');
                }

                await prisma.category.update({
                    where: {
                        id,
                    },
                    data: {
                        name,
                    },
                });

                return reply.status(204).send();
            }
        );
}
