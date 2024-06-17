module.exports = {
    env: {
        node: true,  // Indica que estás en un entorno de Node.js
        es2021: true // O la versión de ECMAScript que estés usando
    },
    extends: [
        'eslint:recommended', // Usar las configuraciones recomendadas por ESLint
    ],
    parserOptions: {
        ecmaVersion: 12, // O la versión de ECMAScript que estés usando
        sourceType: 'module',
    },
    rules: {
        // Aquí puedes añadir o sobrescribir reglas específicas
    },
};