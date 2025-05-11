import { prisma } from '@/lib/prisma';
import { TransactionType } from '@prisma/client';

interface categoryProps {
    name: string;
    type: TransactionType;
    userId: string;
    hidden: boolean;
}

interface subcategoryProps {
    name: string;
    categoryId: string;
}

const createCategory = async ({
    name,
    type,
    userId,
    hidden,
}: categoryProps) => {
    return await prisma.category.create({
        data: { name, type, userId, hidden },
    });
};

const createSubcategory = async ({ name, categoryId }: subcategoryProps) => {
    return await prisma.subCategory.create({
        data: { name, categoryId },
    });
};

const expenseCategories = [
    {
        category: 'Moradia',
        subcategories: [
            'Aluguel',
            'Financiamento imobiliário',
            'Condomínio',
            'IPTU',
            'Energia elétrica',
            'Água e esgoto',
            'Gás',
            'Internet',
            'TV a cabo/streaming',
            'Reparos e manutenção',
        ],
    },
    {
        category: 'Transporte',
        subcategories: [
            'Combustível',
            'Transporte público',
            'Estacionamento',
            'Pedágio',
            'Seguro do carro',
            'Manutenção/revisão',
            'IPVA',
            'Financiamento veicular',
            'Aplicativos (Uber, 99)',
        ],
    },
    {
        category: 'Alimentação',
        subcategories: [
            'Supermercado',
            'Feira',
            'Açougue',
            'Padaria',
            'Lanches',
            'Restaurantes',
            'Delivery',
        ],
    },
    {
        category: 'Saúde',
        subcategories: [
            'Plano de saúde',
            'Consultas médicas',
            'Medicamentos',
            'Exames',
            'Terapias',
            'Odontologia',
        ],
    },
    {
        category: 'Educação',
        subcategories: [
            'Mensalidade escolar/faculdade',
            'Materiais escolares',
            'Cursos online',
            'Livros',
            'Reforço escolar',
        ],
    },
    {
        category: 'Higiene e Cuidados Pessoais',
        subcategories: [
            'Produtos de higiene',
            'Cabeleireiro/barbeiro',
            'Estética',
            'Cosméticos',
        ],
    },
    {
        category: 'Lazer e Entretenimento',
        subcategories: [
            'Cinema, teatro',
            'Viagens',
            'Assinaturas (Spotify, Netflix, etc.)',
            'Eventos e festas',
            'Jogos',
        ],
    },
    {
        category: 'Vestuário',
        subcategories: [
            'Roupas',
            'Calçados',
            'Acessórios',
            'Costureira/lavanderia',
        ],
    },
    {
        category: 'Financeiras e Dívidas',
        subcategories: [
            'Cartão de crédito',
            'Empréstimos',
            'Financiamentos',
            'Juros e tarifas bancárias',
            'Investimentos',
        ],
    },
    {
        category: 'Filhos e Família',
        subcategories: [
            'Escola/creche',
            'Fraldas',
            'Brinquedos',
            'Mesada',
            'Atividades extracurriculares',
        ],
    },
    {
        category: 'Pets',
        subcategories: [
            'Ração',
            'Veterinário',
            'Banho e tosa',
            'Vacinas',
            'Acessórios',
        ],
    },
    {
        category: 'Presentes e Doações',
        subcategories: ['Presentes', 'Doações', 'Caridade'],
    },
    {
        category: 'Manutenção e Serviços',
        subcategories: [
            'Reparos gerais',
            'Serviços domésticos',
            'Jardinagem',
            'Limpeza',
        ],
    },
    {
        category: 'Impostos e Documentos',
        subcategories: [
            'IRPF',
            'Taxas e emolumentos',
            'Documentação (RG, passaporte, CNH)',
        ],
    },
];

const incomeCategories = [
  {
    category: "Salário",
    subcategories: ["Salário principal", "Comissões", "Bônus"],
  },
  {
    category: "Renda Extra",
    subcategories: ["Freelas", "Serviços", "Vendas informais"],
  },
  {
    category: "Investimentos",
    subcategories: ["Dividendos", "Rendimentos de aplicações"],
  },
  {
    category: "Aluguéis",
    subcategories: ["Aluguel de imóveis", "Airbnb"],
  },
  {
    category: "Aposentadoria/Pensão",
    subcategories: ["INSS", "Previdência privada"],
  },
];


export async function generateCategoriesAndSubcategories(userId: string) {
    await createCategory({
        name: 'Fundo de emergencia',
        type: 'EXPENSE',
        userId,
        hidden: true,
    });

    expenseCategories.map(async (item) => {
        const category = await createCategory({
            name: item.category,
            type: 'EXPENSE',
            userId,
            hidden: false,
        });
        item.subcategories.map(async (item) => {
            createSubcategory({ name: item, categoryId: category.id });
        });
    });

    incomeCategories.map(async (item) => {
      const category = await createCategory({
          name: item.category,
          type: 'INCOME',
          userId,
          hidden: false,
      });
      item.subcategories.map(async (item) => {
          createSubcategory({ name: item, categoryId: category.id });
      });
  });
}
