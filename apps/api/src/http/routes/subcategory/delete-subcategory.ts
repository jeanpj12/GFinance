import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { auth } from '@/http/middlewares/auth';
import { BadRequestError } from '../_errors/bad-request-error';

export async function deleteSubcategory(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .delete(
            '/subcategory/:id',
            {
                schema: {
                    tags: ['sub-category'],
                    summary: 'Delete a subcategory',
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

                const subcategory = await prisma.subCategory.findUnique({
                    where: { id },
                });

                if (!subcategory) {
                    throw new BadRequestError('Sub Category not found');
                }

                await prisma.subCategory.delete({
                    where: {
                        id,
                    },
                });

                return reply.status(204).send();
            }
        );
}
