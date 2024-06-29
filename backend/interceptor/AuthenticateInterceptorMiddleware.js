const userService = require("../service/UserService");

async function interceptorMiddleware(req, res, next) {
    const path = req.path.toLowerCase();

    const excludedPaths = [
        /^\/api\/users\/login$/,
        /^\/api\/users\/register$/,
        /^\/api\/users\/validate$/,
    ];

    const isExcluded = excludedPaths.some((pattern) => pattern.test(path));

    if (!isExcluded) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const authHeaderReplaced = authHeader.replace('Basic ', '');
            const authDecode = Buffer.from(authHeaderReplaced, 'base64').toString('utf-8');
            const [user, password] = authDecode.split(':');
            
            // Validar usuario y contraseña
            const userFound = await userService.login(user, atob(password));

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
