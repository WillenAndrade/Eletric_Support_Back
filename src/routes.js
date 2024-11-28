const express = require("express") 
const Sequelize = require('sequelize');
const CircuitsOneTable = require("../src/models/CircuitsOne")
const CircuitsTwoTable = require("../src/models/CircuitsTwo")
const CircuitsThreeTable = require("../src/models/CircuitsThree")
const Projects = require("../src/models/Projects")
const Users = require("../src/models/Users")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authenticateToken = require('./middlewares/authenticateToken');
require('dotenv').config();

routes = express.Router()

routes.post('/signup', async (req, res) => {
    const {username, email, password } = req.body;

    try {
       
        
    const existingEmailUser = await Users.findOne({ where: { email } });

    
    const existingUsernameUser = await Users.findOne({ where: { username } });

    
    if (existingEmailUser && existingUsernameUser) {
        return res.status(400).json({ message: 'Este email e nome de usuário já estão em uso.' });
    }

    if (existingEmailUser) {
        return res.status(400).json({ message: 'Este email já está em uso.' });
    }

    if (existingUsernameUser) {
        return res.status(400).json({ message: 'Este nome de usuário já está em uso.' });
    }
       
        const hashedPassword = await bcrypt.hash(password, 10); 

        
        const newUser = await Users.create({
            username,
            email,
            password: hashedPassword,
        });

         // Gera o token JWT
             const token = jwt.sign(
            { id: newUser.id, email: newUser.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
        );

        return res.status(201).json({
            status: true,
            message: "Usuário criado com sucesso!",
            data: { token },
            user: {
                id: newUser.id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                cellNumber: newUser.cellNumber,
            },
        });
    } catch (err) {
        console.error('Erro ao criar usuário:', err);
        return res.status(500).json({ message: 'Erro no servidor!' });
    }
});

routes.post('/login', async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    try {
       
        const user = await Users.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { email: usernameOrEmail },  // Verifica se é o email
                    { username: usernameOrEmail } // Verifica se é o nome de usuário
                ]
            }
        });

        if (user) {
            // Compare a senha fornecida com a senha hashada
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                const token = jwt.sign(
                    { id: user.id, username: user.username, email: user.email },  // Payload with user info
                    process.env.JWT_SECRET,  // Secret key for signing the JWT (keep it secure)
                    { expiresIn: '1d' }      // Set token expiration time (e.g., 1 day)
                );

                return res.json({
                    status: true,
                    message: "Login feito com sucesso...",
                    token: token,  // Send the token in the response to the client
                });
            }
        }

        // Se não encontrar o usuário ou a senha for inválida
        return res.status(401).json({ message: 'Usuário ou senha inválidos!' });
    } catch (err) {
        console.error('Erro ao fazer login:', err);
        return res.status(500).json({ message: 'Erro no servidor!' });
    }
});


// Circuitsone
routes.post("/circuitsone", authenticateToken, async (req, res) => {
    const userId = req.user.id
    const CircuitsOneData = await CircuitsOneTable.create({
        ...req.body,
        userId
    })

        res.status(201).json({
        error: false,
        message: "Registered with success!",
        data: CircuitsOneData
    })
}
)

routes.get("/circuitsone", authenticateToken, async (req, res) => {
    const userId = req.user.id;
    try { 
        // Check if userId is valid
        if (!userId) {
            return res.status(400).json({
                error: true,
                message: "User ID is missing or invalid."
            });
        }

        const CircuitsOneData = await CircuitsOneTable.findAll({ where: { userId } });

        return res.json({
            status: true,
            message: CircuitsOneData
        });

    } catch (error) {
        console.error("Error fetching CircuitsOne data:", error);  // More detailed logging

        return res.status(500).json({
            error: true,
            message: `Algo deu errado: ${error.message || error}`,
        });
    }
});

routes.delete("/circuitsone/:nome_tabela", authenticateToken, async (req, res) => {
    const userId = req.user.id;  // Get userId from the decoded JWT token

    try {
        // Delete records only for the authenticated user
        await CircuitsOneTable.destroy({
            where: { userId }  // Only delete records that belong to the authenticated user
        });

        return res.status(200).json({
            error: false,
            message: `Todos os circuitos de ${userId} foram excluídos com sucesso.`,
            data: CircuitsOneTable
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: 'Erro ao excluir dados.',
        });
    }
});

routes.delete("/circuitone/:id", authenticateToken, async (req, res) => {
    
    try {
        const {id} = req.params
        const userId = req.user.id 
        
        const result = await CircuitsOneTable.destroy({
            where: { id, userId }  // Only delete if the circuit belongs to the authenticated user
        });

        // Check if any rows were deleted (result will be the number of affected rows)
        if (result === 0) {
            return res.status(404).json({
                status: false,
                message: 'Circuito não encontrado ou você não tem permissão para deletá-lo.',
            });
        }

        return res.json({
            status:true,
            message:'Circuito removido'
        })

    } catch (error) {
        return res.json({
            status:false,
            message:error?.message ?? 'Erro grave contate admin'
        })
    }
})



//Circuitstwo
routes.post("/circuitstwo", authenticateToken, async (req, res) => {
    const userId = req.user.id; // Pega o userId do token JWT
    
    try {
        // Cria um circuito na tabela CircuitsTwoTable com o userId associado
        const CircuitsTwoData = await CircuitsTwoTable.create({
            ...req.body,   // Os dados enviados no corpo da requisição
            userId         // Adiciona o userId para associar o circuito ao usuário
        });

        res.status(201).json({
            error: false,
            message: "Circuito registrado com sucesso!",
            data: CircuitsTwoData
        });
    } catch (error) {
        console.error("Erro ao criar circuito:", error);
        res.status(500).json({
            error: true,
            message: "Erro ao registrar o circuito"
        });
    }
});

routes.get("/circuitstwo", authenticateToken, async (req, res) => {
    const userId = req.user.id; // Pega o userId do token JWT
    
    try {
        // Busca os circuitos da tabela CircuitsTwoTable associados ao usuário
        const CircuitsTwoData = await CircuitsTwoTable.findAll({
            where: { userId } // Filtra os circuitos pelo userId
        });

        res.json({
            status: true,
            message: CircuitsTwoData
        });

    } catch (error) {
        console.error("Erro ao buscar circuitos:", error.stack);  // Exibe detalhes do erro
        res.status(500).json({
            error: true,
            message: "Erro ao buscar circuitos",
            details: error.stack  // Inclui detalhes do erro
        });
    }
});

routes.delete("/circuitstwo/:nome_tabela", authenticateToken, async (req, res) => {
    const userId = req.user.id; // Pega o userId do token JWT
    
    try {
        // Exclui todos os circuitos pertencentes ao usuário autenticado
        await CircuitsTwoTable.destroy({
            where: { userId } // Exclui apenas os circuitos do usuário autenticado
        });

        res.status(200).json({
            error: false,
            message: `Todos os circuitos do usuário ${userId} foram excluídos com sucesso.`,
            data: CircuitsTwoTable
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: true,
            message: "Erro ao excluir circuitos"
        });
    }
});

routes.delete("/circuittwo/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Pega o userId do token JWT

    try {
        // Exclui o circuito apenas se ele pertencer ao usuário autenticado
        const result = await CircuitsTwoTable.destroy({
            where: { id, userId } // Garante que o circuito pertence ao usuário
        });

        // Verifica se algum circuito foi excluído
        if (result === 0) {
            return res.status(404).json({
                status: false,
                message: "Circuito não encontrado ou você não tem permissão para deletá-lo."
            });
        }

        res.json({
            status: true,
            message: "Circuito removido com sucesso"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: error?.message ?? "Erro grave, contate o administrador"
        });
    }
});

routes.post("/circuitsthree", authenticateToken, async (req, res) => {
    const userId = req.user.id; // Retrieve the userId from the token JWT

    try {
        // Add userId to the request body before creating the new circuit
        const CircuitsThreeData = await CircuitsThreeTable.create({
            ...req.body, // All the fields sent in the request body
            userId // Add the userId to associate the circuit with the user
        });

        return res.status(201).json({
            error: false,
            message: "Registered with success!",
            data: CircuitsThreeData
        });

    } catch (error) {
        console.error("Error creating circuit:", error.stack);  // Log the error details
        return res.status(500).json({
            error: true,
            message: "Error registering circuit",
            details: error.stack  // Include error details
        });
    }
});

routes.get("/circuitsthree", authenticateToken, async (req, res) => {
    const userId = req.user.id; // Retrieve the userId from the token JWT
    
    try {
        // Find all circuits from CircuitsThreeTable associated with the authenticated user
        const CircuitsThreeData = await CircuitsThreeTable.findAll({
            where: { userId } // Filter by userId
        });
        
        return res.json({
            status: true,
            message: CircuitsThreeData
        });

    } catch (error) {
        console.error("Error fetching circuits:", error.stack);  // Log the error details
        return res.status(500).json({
            error: true,
            message: "Error fetching circuits",
            details: error.stack  // Include error details
        });
    }
});

routes.delete("/circuitsthree/:nome_tabela", authenticateToken, async (req, res) => {
    const userId = req.user.id; // Pega o userId do token JWT
    
    try {
        // Exclui todos os circuitos pertencentes ao usuário autenticado
        await CircuitsThreeTable.destroy({
            where: { userId } // Exclui apenas os circuitos do usuário autenticado
        });

        res.status(200).json({
            error: false,
            message: `All circuits for user ${userId} have been successfully deleted.`,
            data: CircuitsThreeTable
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: true,
            message: "Error deleting circuits"
        });
    }
});

routes.delete("/circuitthree/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Pega o userId do token JWT

    try {
        // Exclui o circuito apenas se ele pertencer ao usuário autenticado
        const result = await CircuitsThreeTable.destroy({
            where: { id, userId } // Garante que o circuito pertence ao usuário
        });

        // Verifica se algum circuito foi excluído
        if (result === 0) {
            return res.status(404).json({
                status: false,
                message: "Circuito não encontrado ou você não tem permissão para deletá-lo."
            });
        }

        res.json({
            status: true,
            message: "Circuito removido com sucesso"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: error?.message ?? "Erro grave, contate o administrador"
        });
    }
});

// Fetch all projects for the authenticated user
routes.get("/projects", authenticateToken, async (req, res) => {
    const userId = req.user.id;  // Get userId from the decoded JWT token
    try { 
        const ProjectsData = await Projects.findAll({ where: { userId } }); // Only fetch the projects that belong to the authenticated user
        return res.json({
            status: true,
            message: ProjectsData 
        });
    } catch (error) {
        console.log(error);
        return res.json({
            error: true,
            message: "Algo deu errado",
        });
    }
});

// Fetch a single project by ID for the authenticated user
routes.get("/projects/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;  // Get userId from the decoded JWT token

    try {
        const project = await Projects.findOne({
            where: {
                id,
                userId // Ensure the project belongs to the authenticated user
            }
        });

        if (!project) {
            return res.status(404).json({
                status: false,
                message: 'Projeto não encontrado ou não autorizado',
            });
        }

        return res.json({
            status: true,
            message: project,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: 'Erro ao buscar o projeto',
        });
    }
});

// Create a new project for the authenticated user
routes.post("/projects", authenticateToken, async (req, res) => {
    const { projectName, linkNumber } = req.body;
    const userId = req.user.id;  // Get userId from the decoded JWT token
    console.log(req.user)

    try {
        const newProject = await Projects.create({
            projectName,
            linkNumber,
            userId, 
            createdAt: new Date(),   // Adiciona o valor de createdAt manualmente
            updatedAt: new Date()    // Adiciona o valor de updatedAt manualmente // Link the project to the authenticated user
        });

        return res.status(201).json({
            status: true,
            message: 'Projeto criado com sucesso!',
            data: newProject
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: error?.message ?? 'Erro grave, contate o administrador'
        });
    }
});

// Update a project by ID for the authenticated user
routes.put("/projects/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { projectName, linkNumber } = req.body;
    const userId = req.user.id;  // Get userId from the decoded JWT token

    try {
        const project = await Projects.findOne({
            where: {
                id,
                userId // Ensure the project belongs to the authenticated user
            }
        });

        if (!project) {
            return res.status(404).json({
                status: false,
                message: 'Projeto não encontrado ou não autorizado',
            });
        }

        await Projects.update(
            { projectName, linkNumber }, 
            { where: { id, userId } }
        );

        return res.json({
            status: true,
            message: 'Projeto atualizado com sucesso'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: error?.message ?? 'Erro grave, contate o administrador'
        });
    }
});

routes.delete("/projects/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;  // Pega o userId do token JWT

    try {
        // Verifica se o projeto existe e pertence ao usuário autenticado
        const project = await Projects.findOne({
            where: {
                id,
                userId,  // Verifica se o projeto pertence ao usuário
            }
        });

        if (!project) {
            return res.status(404).json({
                status: false,
                message: 'Projeto não encontrado ou não autorizado',
            });
        }

        // Exclui os circuitos associados ao projeto
       // await CircuitsOneTable.destroy({ where: { projectId: id } });

        // Exclui o projeto
        await Projects.destroy({ where: { id, userId } });

        return res.json({
            status: true,
            message: 'Projeto e circuitos removidos com sucesso',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: error?.message ?? 'Erro grave, contate o administrador'
        });
    }
});

module.exports = routes;
