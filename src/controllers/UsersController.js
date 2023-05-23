const AppError = require('../utils/AppError');
const sqliteConnection = require("../database/sqlite")
const { hash } = require("bcryptjs");

class UsersController {

    //Um controller pode ter no maximo 5 metodos ( ou 5 funcoes)
    // index - Get para listar varios registros
    // show - get para exibir um registro especifico
    // create - post para criar um registro
    // update - put para atualizar um registro
    // delete - delete para remover um registro

    async create(request, response) {
        const { name, email, password} = request.body;
        const database = await sqliteConnection();
        const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if(checkUserExists) {
            throw new AppError("Esse email ja esta em uso.");
        }

        const hashedPassword = await hash(password, 8);

        await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

        return response.status(201).json();
 
    }
}

module.exports = UsersController;