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

router.get('/roles', async (req, res) => {
    const userMail = req.query.userMail;
    const role = await userService.getRole(userMail);
    res.status(200).json(role);
});

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
