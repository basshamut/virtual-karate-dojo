const userRepository = require('../persistance/UserRepository')
const bcrypt = require("bcrypt");

const UserService = {}

UserService.save = async function (user) {
    const userValidation = await userRepository.findOne({
        where: {
            email: user.email
        }
    });

    if (!userValidation) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return await userRepository.create({
            email: user.email,
            birthDate: new Date(Date.parse(user.birthDate)),
            password: hashedPassword,
            role: 'USER'
        })
    }

    return null
}

UserService.login = async function (email, password) {
    const user = await userRepository.findOne({
        where: {
            email: email
        }
    });

    if (!user) {
        return null
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return null
    }

    return user
}

module.exports = UserService