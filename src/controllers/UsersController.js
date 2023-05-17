const AppError = require('../utils/AppError');

class UsersController {

    //Um controller pode ter no maximo 5 metodos ( ou 5 funcoes)
    // index - Get para listar varios registros
    // show - get para exibir um registro especifico
    // create - post para criar um registro
    // update - put para atualizar um registro
    // delete - delete para remover um registro

    create(request, response) {
        const { name, email, password} = request.body;

        if (!name) {
            throw new AppError("Nome e obrigatorio!");
        }
        
        response.status(201).json({ name, email, password});
    }
}

module.exports = UsersController;