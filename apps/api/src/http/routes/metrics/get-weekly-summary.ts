import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { auth } from '@/http/middlewares/auth';
import { subDays, format } from 'date-fns';

export async function getWeeklySummary(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/metrics/weekly-summary',
            {
                schema: {
                    tags: ['metrics'],
                    summary: 'List transaction',
                    security: [{ bearerAuth: [] }],
                    response: {
                        200: z.array(
                            z.object({
                                expense: z.number(),
                                income: z.number(),
                                dayMonth: z.string(),
                            })
                        ),
                    },
                },
            },
            async (request, reply) => {
                const transactions = await prisma.transaction.findMany({
                    where: { isPaid: true },
                    select: {
                        id: true,
                        amount: true,
                        type: true,
                        dueDate: true,
                    },
                });

                const last8Days = Array.from({ length: 8 }).map((_, i) => {
                    const date = subDays(new Date(), 7 - i);
                    return format(date, 'dd/MM');
                });

                const groupedByDay = new Map<
                    string,
                    { income: number; expense: number }
                >();

                transactions.forEach((transaction) => {
                    const dayMonth = format(
                        new Date(transaction.dueDate),
                        'dd/MM'
                    );

                    const current = groupedByDay.get(dayMonth) || {
                        income: 0,
                        expense: 0,
                    };

                    if (transaction.type === 'INCOME') {
                        current.income += Number(transaction.amount);
                    } else if (transaction.type === 'EXPENSE') {
                        current.expense += Number(transaction.amount);
                    }

                    groupedByDay.set(dayMonth, current);
                });

                const data = last8Days.map((dayMonth) => {
                    const values = groupedByDay.get(dayMonth) || {
                        income: 0,
                        expense: 0,
                    };
                    return {
                        dayMonth,
                        income: values.income,
                        expense: values.expense,
                    };
                });

                return reply.status(200).send(data);
            }
        );
}
