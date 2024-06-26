const express = require("express");
const router = express.Router();
const userService = require("../service/UserService");

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - birthDate
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: El correo electrónico del usuario
 *         birthDate:
 *           type: string
 *           format: date
 *           description: La fecha de nacimiento del usuario
 *         password:
 *           type: string
 *           format: password
 *           description: La contraseña del usuario
 *       example:
 *         email: "usuario@example.com"
 *         birthDate: "2000-01-01"
 *         password: "password1234"
 *
 *     UserLogin:
 *       type: object
 *       required:
 *         - user
 *         - password
 *       properties:
 *         user:
 *           type: string
 *           format: email
 *           description: El correo electrónico del usuario
 *         password:
 *           type: string
 *           format: password
 *           description: La contraseña del usuario (Base64 encoded)
 *       example:
 *         user: "usuario@example.com"
 *         password: "cGFzc3dvcmQxMjM="
 *
 *     UserRole:
 *       type: object
 *       properties:
 *         userMail:
 *           type: string
 *           format: email
 *           description: El correo electrónico del usuario
 *         role:
 *           type: string
 *           description: El rol del usuario
 *       example:
 *         userMail: "usuario@example.com"
 *         role: "admin"
 *
 *     UserValidation:
 *       type: object
 *       required:
 *         - userMail
 *       properties:
 *         userMail:
 *           type: string
 *           format: email
 *           description: El correo electrónico del usuario
 *       example:
 *         userMail: "usuario@example.com"
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: El mensaje de error
 *       example:
 *         message: "El correo electrónico ya está registrado"
 *
 *     UserResponse:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: El correo electrónico del usuario
 *         birthDate:
 *           type: string
 *           format: date
 *           description: La fecha de nacimiento del usuario
 *         role:
 *           type: string
 *           description: El rol del usuario
 *       example:
 *         email: "usuario@example.com"
 *         birthDate: "2000-01-01"
 *         role: "user"
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Registro exitoso
 *       400:
 *         description: Error en la validación de los datos
 *       409:
 *         description: El email ya está registrado
 */
router.post('/register', async (req, res) => {
    const { user, date, password } = req.body;

    const errors = {};

    if (!user) {
        errors.user = "El email es requerido";
    } else if (!validateEmail(user)) {
        errors.user = "El formato del email no es válido";
    }

    const today = new Date();
    const majorityAgeDate = new Date(today.getFullYear() - 18, 0, 1);

    if (!date) {
        errors.date = "La fecha de nacimiento es requerida";
    } else {
        const userDate = new Date(date);
        if (userDate > majorityAgeDate) {
            errors.date = "Debes ser mayor de 18 años";
        }
    }

    if (!password) {
        errors.password = "La contraseña es requerida";
    } else if (!validatePassword(password)) {
        errors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

    const userFound = await userService.save({ email: user, birthDate: date, password });
    if (userFound === null) {
        const errorResponse = { message: 'El email ya está registrado' };
        return res.status(409).json(errorResponse);
    }

    res.status(201).json({ message: 'Registro exitoso' });
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Inicia sesión en la aplicación
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       400:
 *         description: Error en la validación de los datos
 *       404:
 *         description: Usuario o contraseña incorrectos
 */
router.post('/login', async (req, res) => {
    const user = req.body.user;
    const password = atob(req.body.password);

    const errors = {};

    if (!user) {
        errors.user = "El email es requerido";
    } else if (!validateEmail(user)) {
        errors.user = "El formato del email no es válido";
    }

    if (!password) {
        errors.password = "La contraseña es requerida";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

    const userFound = await userService.login(user, password);

    if (!userFound) {
        return res.status(404).json({ message: 'Usuario o contraseña incorrectos' });
    }

    userFound.password = undefined;
    res.status(200).json(userFound);
});

/**
 * @swagger
 * /api/users/roles:
 *   get:
 *     summary: Obtiene los roles de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: userMail
 *         schema:
 *           type: string
 *         required: true
 *         description: El email del usuario
 *     responses:
 *       200:
 *         description: Roles del usuario
 *       400:
 *         description: Error en la solicitud
 */
router.get('/roles', async (req, res) => {
    const userMail = req.query.userMail;
    const role = await userService.getRole(userMail);
    res.status(200).json(role);
});

/**
 * @swagger
 * /api/users/validate:
 *   patch:
 *     summary: Valida un usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserValidation'
 *     responses:
 *       200:
 *         description: Validación exitosa
 *       400:
 *         description: El email ya está validado o no fue proporcionado
 *       404:
 *         description: El email no está registrado
 */
router.patch('/validate', async (req, res) => {
    const userMail = req.body.userMail;
    if (!userMail) {
        return res.status(400).json({ message: 'El email es requerido' });
    }

    const userExist = await userService.findByEmail(userMail);
    if (!userExist) {
        return res.status(404).json({ message: 'El email no está registrado' });
    }

    if (userExist.validated) {
        return res.status(400).json({ message: 'El email ya está validado' });
    }

    await userService.validate(userMail);
    res.status(200).json({ message: 'Validación exitosa' });
});

module.exports = router;
