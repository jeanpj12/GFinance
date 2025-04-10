import fastify from 'fastify';
import {
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
    ZodTypeProvider,
} from 'fastify-type-provider-zod';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyCors from '@fastify/cors';
import { errorHandler } from './error-handler';
import fastifyJwt from '@fastify/jwt';
import { createAccount } from './routes/auth/create-account';
import { authenticateWithPassword } from './routes/auth/authenticate-with-password';
import { getProfile } from './routes/auth/get-profile';

import { env } from '@repo/env';
import { createTransaction } from './routes/transactions/create-transaction';
import { createCategory } from './routes/category/create-category';
import { createSubcategory } from './routes/subcategory/create-subcategory';
import { updateCategory } from './routes/category/update-category';
import { deleteCategory } from './routes/category/delete-category';
import { getCategory } from './routes/category/get-categories';
import { getSubcategory } from './routes/subcategory/get-subcategories';
import { updateSubcategory } from './routes/subcategory/update-subcategory';
import { deleteSubcategory } from './routes/subcategory/delete-subcategory';
import { getTransactions } from './routes/transactions/get-transactions';
import { updateTransaction } from './routes/transactions/update-transaction';
import { deleteTransaction } from './routes/transactions/delete-transaction';
import { getEmergencyFunds } from './routes/emergency-funds/get-emergency-funds';
import { getWeeklySummary } from './routes/metrics/get-weekly-summary';
import { getLastTransactions } from './routes/metrics/get-last-transactions';
import { getBalance } from './routes/metrics/get-balance';
import { createEmergencyFund } from './routes/emergency-funds/create-emergency-fund';
import { updateEmergencyFund } from './routes/emergency-funds/update-emergency-fund';

const app = fastify().withTypeProvider<ZodTypeProvider>();
app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
app.setErrorHandler(errorHandler);

app.register(fastifyCors);

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'GFinance API',
            description: 'Game table extension',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description:
                        'Enter JWT token here to access protected endpoints',
                },
            },
        },
    },
    transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
});

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
});

app.register(createAccount);
app.register(authenticateWithPassword);
app.register(getProfile);

app.register(createEmergencyFund);
app.register(getEmergencyFunds);
app.register(updateEmergencyFund);

app.register(createTransaction);
app.register(getTransactions);
app.register(updateTransaction);
app.register(deleteTransaction);

app.register(getCategory);
app.register(createCategory);
app.register(updateCategory);
app.register(deleteCategory);

app.register(getSubcategory);
app.register(createSubcategory);
app.register(updateSubcategory);
app.register(deleteSubcategory);

app.register(getWeeklySummary);
app.register(getLastTransactions);
app.register(getBalance);

app.listen({ port: env.PORT }).then(() =>
    console.log('server is running')
);
