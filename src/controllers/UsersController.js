const AppError = require('../utils/AppError');
const sqliteConnection = require("../database/sqlite")
const { hash, compare } = require("bcryptjs");

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

    async update(request, response) {
        const { name, email, password, old_password } = request.body;
        const { id } = request.params;

        const database = await sqliteConnection();
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

        if(!user) {
            throw new AppError("Usuario nao encontrado");
        }

        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
            throw new AppError("Esse email ja esta em uso");
        }

        if ( password && !old_password) {
            throw new AppError("Voce precisa inserir a senha antiga")
        }

        if (password && old_password) {
            const checkOldPassword = await compare(old_password, user.password)

            if(!checkOldPassword) {
                throw new AppError("A senha antiga nao confere")
            }

            user.password = await hash(password, 8);
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        await database.run(`
        UPDATE users SET 
        name = ?,
        email = ?,
        password = ?,
        updated_at = DATETIME('now')
        WHERE id = ?`,
        [user.name, user.email, user.password, id]
        );

        return response.json();
    }
}

module.exports = UsersController;