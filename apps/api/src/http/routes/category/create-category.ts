import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { auth } from '@/http/middlewares/auth';

export async function createCategory(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post(
            '/category',
            {
                schema: {
                    tags: ['category'],
                    summary: 'Create a new category',
                    security: [{ bearerAuth: [] }],
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
                const userId = await request.getCurrentUserId();
                
                await prisma.category.create({
                    data: {
                        name,
                        userId,
                    },
                });

                return reply.status(201).send();
            }
        );
}
