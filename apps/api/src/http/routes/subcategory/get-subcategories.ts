import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { auth } from '@/http/middlewares/auth';
import { BadRequestError } from '../_errors/bad-request-error';

export async function getSubcategory(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/subcategory/:categoryid',
            {
                schema: {
                    tags: ['sub-category'],
                    summary: 'List Sub Categories',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        categoryid: z.string().uuid(),
                    }),
                    response: {
                        200: z.array(
                            z.object({
                                id: z.string().uuid(),
                                name: z.string(),
                                categoryId: z.string(),
                                createdAt: z.string().datetime(),
                                updatedAt: z.string().datetime(),
                            })
                        ),
                    },
                },
            },
            async (request, reply) => {
                const { categoryid } = request.params;

                const subcategories = await prisma.subCategory.findMany({
                    where: { categoryId: categoryid },
                });

                return reply.status(200).send(
                    subcategories.map((subcategory) => ({
                        ...subcategory,
                        createdAt: subcategory.createdAt.toISOString(),
                        updatedAt: subcategory.updatedAt.toISOString(),
                    }))
                );
            }
        );
}
