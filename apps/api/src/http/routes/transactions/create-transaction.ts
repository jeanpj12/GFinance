import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { auth } from '@/http/middlewares/auth';
import { TransactionType } from '@prisma/client';

export async function createTransaction(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post(
            '/transaction',
            {
                schema: {
                    tags: ['transaction'],
                    summary: 'Create a new transaction',
                    security: [{ bearerAuth: [] }],
                    body: z.object({
                        name: z.string(),
                        amount: z.number(),
                        description: z.string().optional(),
                        type: z.nativeEnum(TransactionType),
                        categoryId: z.string().uuid(),
                        subCategoryId: z.string().uuid().optional(),
                        isPaid: z.boolean(),
                        dueDate: z.date(),
                        datePost: z.date().optional(),
                        toEmergencyFund: z.boolean(),
                    }),
                    response: {
                        201: z.null(),
                    },
                },
            },
            async (request, reply) => {
                const {
                    name,
                    amount,
                    categoryId,
                    dueDate,
                    isPaid,
                    toEmergencyFund,
                    type,
                    datePost,
                    description,
                    subCategoryId,
                } = request.body;

                const userId = await request.getCurrentUserId();

                await prisma.transaction.create({
                    data: {
                        name,
                        userId,
                        amount,
                        description: description ? description : undefined,
                        categoryId,
                        subCategoryId: subCategoryId
                            ? subCategoryId
                            : undefined,
                        dueDate,
                        isPaid,
                        toEmergencyFund,
                        type,
                        datePost: datePost ? datePost : undefined,
                    },
                });

                return reply.status(201).send();
            }
        );
}
