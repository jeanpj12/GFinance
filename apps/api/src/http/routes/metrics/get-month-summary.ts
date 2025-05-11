import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { auth } from '@/http/middlewares/auth';
import {
    subDays,
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
} from 'date-fns';

export async function getMonthSummary(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/metrics/month-summary/:date',
            {
                schema: {
                    tags: ['metrics'],
                    summary: 'List transaction',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        date: z.string().transform((val) => new Date(val)),
                    }),
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
                const { date } = request.params;

                const transactions = await prisma.transaction.findMany({
                    where: { isPaid: true },
                    select: {
                        id: true,
                        amount: true,
                        type: true,
                        dueDate: true,
                    },
                });

                const start = startOfMonth(date);
                const end = endOfMonth(date);

                const allDaysOfMonth = eachDayOfInterval({ start, end }).map(
                    (date) => format(date, 'dd/MM')
                );

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

                const data = allDaysOfMonth.map((dayMonth) => {
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
