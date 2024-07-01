const userRepository = require('../persistance/UserRepository')
const bcrypt = require("bcrypt");
const mailerService = require("./MailerService");

const UserService = {}

UserService.save = async function (user) {
    const userValidation = await userRepository.findOne({
        where: {
            email: user.email
        }
    });

    if (!userValidation) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const createResult = await userRepository.create({
            email: user.email,
            birthDate: new Date(Date.parse(user.birthDate)),
            password: hashedPassword,
            role: 'USER'
        })

        const domain = process.env.FRONTEND_URL
        const to = user.email
        const subject = 'Welcome to Mushin Dojo'
        const text = 'Welcome to Mushin Dojo'
        const html = '<h1>Welcome to Mushin Dojo</h1>' +
            '<p>' +
            'Thank you for signing up, please verify your registration by clicking on this link: ' +
            '<a href="' + domain + '/virtual-dojo/frontend/validation?mail=' + user.email + '">Dojo</a>' +
            '</p>';

        try {
            await mailerService.sendMail(to, subject, text, html)
            return createResult
        }   catch (error) {
            console.log('Error sending email:', error)
            console.log('Deleting user:', user.email)
            await UserService.deleteByEmail(user.email)
        }
    }
    return null
}

UserService.login = async function (email, password) {
    const user = await userRepository.findOne({
        where: {
            email: email,
            validated: true
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

UserService.deleteByEmail = async function (email) {
    await userRepository.destroy({
        where: {
            email: email
        }
    });
}

UserService.getRole = async function (email) {
    const user = await userRepository.findOne({
        where: {
            email: email
        }
    });

    if (!user) {
        return null
    }

    return user.role
}

UserService.validate = async function (email) {
    const user = await userRepository.findOne({
        where: {
            email: email,
            validated: false
        }
    });

    if (!user) {
        return null
    }

    user.validated = true
    await user.save()
    return user
}

UserService.findByEmail = async function(userMail) {
    const user = await userRepository.findOne({
        where: {
            email: userMail
        }
    });

    return user
}


module.exports = UserService