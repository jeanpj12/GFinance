import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { auth } from '@/http/middlewares/auth';
import { Decimal } from '@prisma/client/runtime/library';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export async function getBalance(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/metrics/balance/:date',
            {
                schema: {
                    tags: ['metrics'],
                    summary: 'Get balance',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        date: z.string().transform((val) => new Date(val)),
                    }),
                    response: {
                        200: z.array(
                            z.object({
                                month: z.string(),
                                incomes: z.string(),
                                expenses: z.string(),
                                balance: z.string(),
                                initial: z.string(),
                                predicted: z.string(),
                            })
                        ),
                    },
                },
            },
            async (request, reply) => {
                const { date } = request.params;

                const startOfMonth = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    1
                );
                const endOfMonth = new Date(
                    date.getFullYear(),
                    date.getMonth() + 1,
                    0,
                    23,
                    59,
                    59,
                    999
                );

                const previousTransactions = await prisma.transaction.findMany({
                    where: {
                        isPaid: true,
                        dueDate: {
                            lt: startOfMonth,
                        },
                    },
                    select: {
                        amount: true,
                        type: true,
                    },
                });

                const initial = previousTransactions.reduce((acc, t) => {
                    if (t.type === 'INCOME') {
                        return acc.plus(t.amount);
                    } else {
                        return acc.minus(t.amount);
                    }
                }, new Decimal(0));

                const paidTransactions = await prisma.transaction.findMany({
                    where: {
                        isPaid: true,
                        dueDate: {
                            gte: startOfMonth,
                            lte: endOfMonth,
                        },
                    },
                    select: {
                        amount: true,
                        type: true,
                    },
                });

                const incomes = paidTransactions
                    .filter((t) => t.type === 'INCOME')
                    .reduce((acc, t) => acc.plus(t.amount), new Decimal(0));

                const expenses = paidTransactions
                    .filter((t) => t.type === 'EXPENSE')
                    .reduce((acc, t) => acc.plus(t.amount), new Decimal(0));

                const balance = initial.plus(incomes).minus(expenses);

                const allMonthTransactions = await prisma.transaction.findMany({
                    where: {
                        dueDate: {
                            gte: startOfMonth,
                            lte: endOfMonth,
                        },
                    },
                    select: {
                        amount: true,
                        type: true,
                    },
                });

                const predictedIncomes = allMonthTransactions
                    .filter((t) => t.type === 'INCOME')
                    .reduce((acc, t) => acc.plus(t.amount), new Decimal(0));

                const predictedExpenses = allMonthTransactions
                    .filter((t) => t.type === 'EXPENSE')
                    .reduce((acc, t) => acc.plus(t.amount), new Decimal(0));

                const predicted = initial
                    .plus(predictedIncomes)
                    .minus(predictedExpenses);

                const month = format(date, 'MMMM', { locale: ptBR });

                const data = [
                    {
                        month,
                        incomes: incomes.toFixed(2),
                        expenses: expenses.toFixed(2),
                        balance: balance.toFixed(2),
                        initial: initial.toFixed(2),
                        predicted: predicted.toFixed(2),
                    },
                ];

                return reply.status(200).send(data);
            }
        );
}
