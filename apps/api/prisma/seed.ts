import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userId = 'fcbcd982-2f6b-4b51-bd87-94470fd85595';

  // Transações entre 01/05/2025 e 16/05/2025
  const txData = [
    { name: 'Salário de Maio', amount: 5000, type: TransactionType.INCOME, category: 'Salário', sub: 'Salário principal', date: '2025-05-01' },
    { name: 'Aluguel de Maio', amount: 1500, type: TransactionType.EXPENSE, category: 'Moradia', sub: 'Aluguel', date: '2025-05-02' },
    { name: 'Supermercado Semanal', amount: 300, type: TransactionType.EXPENSE, category: 'Alimentação', sub: 'Supermercado', date: '2025-05-03' },
    { name: 'Energia Elétrica', amount: 120, type: TransactionType.EXPENSE, category: 'Moradia', sub: 'Energia elétrica', date: '2025-05-05' },
    { name: 'Água e Esgoto', amount: 70, type: TransactionType.EXPENSE, category: 'Moradia', sub: 'Água e esgoto', date: '2025-05-06' },
    { name: 'Freela Projeto X', amount: 800, type: TransactionType.INCOME, category: 'Renda Extra', sub: 'Freelas', date: '2025-05-07' },
    { name: 'Combustível', amount: 200, type: TransactionType.EXPENSE, category: 'Transporte', sub: 'Combustível', date: '2025-05-08' },
    { name: 'Dividendos Mensais', amount: 200, type: TransactionType.INCOME, category: 'Investimentos', sub: 'Dividendos', date: '2025-05-09' },
    { name: 'Assinatura Netflix', amount: 30, type: TransactionType.EXPENSE, category: 'Lazer e Entretenimento', sub: 'Assinaturas (Spotify, Netflix, etc.)', date: '2025-05-10' },
    { name: 'Uber Viagem', amount: 50, type: TransactionType.EXPENSE, category: 'Transporte', sub: 'Aplicativos (Uber, 99)', date: '2025-05-11' },
    { name: 'Medicamentos', amount: 45, type: TransactionType.EXPENSE, category: 'Saúde', sub: 'Medicamentos', date: '2025-05-12' },
    { name: 'Livro Novo', amount: 80, type: TransactionType.EXPENSE, category: 'Educação', sub: 'Livros', date: '2025-05-13' },
    { name: 'Padaria', amount: 20, type: TransactionType.EXPENSE, category: 'Alimentação', sub: 'Padaria', date: '2025-05-14' },
    { name: 'Restaurante Almoço', amount: 60, type: TransactionType.EXPENSE, category: 'Alimentação', sub: 'Restaurantes', date: '2025-05-15' },
    { name: 'Cinema com Amigos', amount: 25, type: TransactionType.EXPENSE, category: 'Lazer e Entretenimento', sub: 'Cinema, teatro', date: '2025-05-16' }
  ];

  for (const tx of txData) {
    // Busca categoria e subcategoria existentes
    const category = await prisma.category.findFirst({
      where: { name: tx.category, userId }
    });
    if (!category) throw new Error(`Categoria não encontrada: ${tx.category}`);

    const subCategory = await prisma.subCategory.findFirst({
      where: { name: tx.sub, categoryId: category.id }
    });
    if (!subCategory) throw new Error(`Subcategoria não encontrada: ${tx.sub}`);

    await prisma.transaction.create({
      data: {
        name: tx.name,
        amount: tx.amount,
        type: tx.type,
        userId,
        categoryId: category.id,
        subCategoryId: subCategory.id,
        isPaid: true,
        datePost: new Date(tx.date),
        dueDate: new Date(tx.date)
      }
    });
  }

  console.log('Seed de transações executada com sucesso.');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
