const userService = require("../service/UserService");

async function interceptorMiddleware(req, res, next) {
    const path = req.path.toLowerCase();

    const excludedPaths = [
        '/api/users/login',
        '/api/users/register',
        '/api/users/validate'
    ];

    console.log(!excludedPaths.includes(path))

    if (!excludedPaths.includes(path)) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const authHeaderReplaced = authHeader.replace('Basic ', '');
            const authDecode = Buffer.from(authHeaderReplaced, 'base64').toString('utf-8');
            const [user, encodedPassword] = authDecode.split(':');

            // Decodificar la contraseña desde base64
            const password = Buffer.from(encodedPassword, 'base64').toString('utf-8');

            // Validar usuario y contraseña
            const userFound = await userService.login(user, password);

            if (!userFound) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Agregar el usuario encontrado al objeto req para su uso posterior si es necesario
            req.user = userFound;

        } catch (error) {
            console.error('Error en middleware de autenticación:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    next();
}

module.exports = interceptorMiddleware;
