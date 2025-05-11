import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { auth } from '@/http/middlewares/auth';
import { TransactionType } from '@prisma/client';

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
                        type: z.nativeEnum(TransactionType),
                    }),
                    response: {
                        201: z.object({
                            type: z.nativeEnum(TransactionType),
                            name: z.string(),
                            id: z.string().uuid(),
                            userId: z.string().uuid(),
                            hidden: z.boolean(),
                            createdAt: z.date(),
                            updatedAt: z.date(),
                        })
                    },
                },
            },
            async (request, reply) => {
                const { name, type } = request.body;
                const userId = await request.getCurrentUserId();

                const category = await prisma.category.create({
                    data: {
                        name,
                        userId,
                        type,
                    },
                });

                return reply.status(201).send(category);
            }
        );
}
