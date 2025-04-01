import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { auth } from '@/http/middlewares/auth';

export async function createSubcategory(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post(
            '/subcategory',
            {
                schema: {
                    tags: ['sub-category'],
                    summary: 'Create a new subcategory',
                    security: [{ bearerAuth: [] }],
                    body: z.object({
                        name: z.string(),
                        categoryId: z.string().uuid(),
                    }),
                    response: {
                        201: z.null(),
                    },
                },
            },
            async (request, reply) => {
                const { name, categoryId } = request.body;

                await prisma.subCategory.create({
                    data: {
                        name,
                        categoryId,
                    },
                });

                return reply.status(201).send();
            }
        );
}
