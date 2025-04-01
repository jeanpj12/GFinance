import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { auth } from '@/http/middlewares/auth';
import { BadRequestError } from '../_errors/bad-request-error';

export async function updateSubcategory(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .patch(
            '/subcategory/:id',
            {
                schema: {
                    tags: ['sub-category'],
                    summary: 'Update a subcategory',
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

                const subcategory = await prisma.subCategory.findUnique({
                    where: { id },
                });

                if (!subcategory) {
                    throw new BadRequestError('Sub Category not found');
                }

                await prisma.subCategory.update({
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
