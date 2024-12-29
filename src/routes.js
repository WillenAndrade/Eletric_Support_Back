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
const RefreshTokens = require('../src/models/RefreshTokens');
require('dotenv').config();
const { Op } = require('sequelize');

routes = express.Router()

routes.get('/users/:userNameOrEmail', authenticateToken, async (req, res) => {
    const { userNameOrEmail } = req.params; 

    try {
        const user = await Users.findOne({
            where: {
                [Op.or]: [
                    { username: userNameOrEmail },
                    { email: userNameOrEmail },
                ],
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        return res.status(200).json({
            message: {
                name: user.name || user.username, // Usa 'name' se existir, ou 'username' como fallback
            },
        });
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

routes.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

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

        const token = jwt.sign(
            { id: newUser.id, username: newUser.username, email: newUser.email }, 
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        const refreshToken = jwt.sign(
            { id: newUser.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        await RefreshTokens.create({
            token: refreshToken,
            userId: newUser.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        return res.status(201).json({
            status: true,
            message: "Usuário criado com sucesso!",
            data: { token, refreshToken },
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
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
                    { email: usernameOrEmail },
                    { username: usernameOrEmail },
                ],
            },
        });

        if (!user) {
            return res.status(401).json({ message: 'Usuário ou senha inválidos!' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Usuário ou senha inválidos!' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        await RefreshTokens.create({
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
        });

        return res.status(200).json({
            status: true,
            message: "Login feito com sucesso!",
            data: { token, refreshToken },
        });
    } catch (err) {
        console.error('Erro ao fazer login:', err);
        return res.status(500).json({ message: 'Erro no servidor!' });
    }
});

routes.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;

    try {
        if (!refreshToken) {
            return res.status(400).json({ message: 'Token de atualização não fornecido!' });
        }

        const storedToken = await RefreshTokens.findOne({ where: { token: refreshToken } });

        if (!storedToken || new Date(storedToken.expiresAt) < new Date()) {
            return res.status(401).json({ message: 'Token de atualização inválido ou expirado!' });
        }

        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const newAccessToken = jwt.sign(
            { id: payload.id },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        return res.status(200).json({ token: newAccessToken });
    } catch (err) {
        console.error('Erro ao renovar token:', err);
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
        console.error("Error fetching CircuitsOne data:", error); 

        return res.status(500).json({
            error: true,
            message: `Algo deu errado: ${error.message || error}`,
        });
    }
});

routes.delete("/circuitsone/:nome_tabela", authenticateToken, async (req, res) => {
    const userId = req.user.id;  

    try {
        
        await CircuitsOneTable.destroy({
            where: { userId } 
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
            where: { id, userId }  
        });

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
    const userId = req.user.id;
    try {
        const CircuitsTwoData = await CircuitsTwoTable.create({
            ...req.body,   
            userId         
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
    const userId = req.user.id; 
    
    try {
        const CircuitsTwoData = await CircuitsTwoTable.findAll({
            where: { userId } 
        });

        res.json({
            status: true,
            message: CircuitsTwoData
        });

    } catch (error) {
        console.error("Erro ao buscar circuitos:", error.stack); 
        res.status(500).json({
            error: true,
            message: "Erro ao buscar circuitos",
            details: error.stack  
        });
    }
});

routes.delete("/circuitstwo/:nome_tabela", authenticateToken, async (req, res) => {
    const userId = req.user.id;
    
    try {
        await CircuitsTwoTable.destroy({
            where: { userId } 
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
    const userId = req.user.id; 
    try {
        const result = await CircuitsTwoTable.destroy({
            where: { id, userId } 
        });

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
    const userId = req.user.id; 

    try {
        const CircuitsThreeData = await CircuitsThreeTable.create({
            ...req.body, 
            userId 
        });

        return res.status(201).json({
            error: false,
            message: "Registered with success!",
            data: CircuitsThreeData
        });

    } catch (error) {
        console.error("Error creating circuit:", error.stack);  
        return res.status(500).json({
            error: true,
            message: "Error registering circuit",
            details: error.stack  
        });
    }
});

routes.get("/circuitsthree", authenticateToken, async (req, res) => {
    const userId = req.user.id; 
    
    try {
        const CircuitsThreeData = await CircuitsThreeTable.findAll({
            where: { userId } 
        });
        
        return res.json({
            status: true,
            message: CircuitsThreeData
        });

    } catch (error) {
        console.error("Error fetching circuits:", error.stack);  
        return res.status(500).json({
            error: true,
            message: "Error fetching circuits",
            details: error.stack  
        });
    }
});

routes.delete("/circuitsthree/:nome_tabela", authenticateToken, async (req, res) => {
    const userId = req.user.id; 
    
    try {
        await CircuitsThreeTable.destroy({
            where: { userId } 
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
    const userId = req.user.id; 

    try {
        const result = await CircuitsThreeTable.destroy({
            where: { id, userId } 
        });

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

routes.get("/projects", authenticateToken, async (req, res) => {
    const userId = req.user.id; 
    try { 
        const ProjectsData = await Projects.findAll({ where: { userId } }); 
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

routes.get("/projects/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;  

    try {
        const project = await Projects.findOne({
            where: {
                id,
                userId 
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

routes.post("/projects", authenticateToken, async (req, res) => {
    const { projectName, linkNumber } = req.body;
    const userId = req.user.id;  
    console.log(req.user)

    try {
        const newProject = await Projects.create({
            projectName,
            linkNumber,
            userId, 
            createdAt: new Date(),   
            updatedAt: new Date()    
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

routes.put("/projects/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { projectName, linkNumber } = req.body;
    const userId = req.user.id;  

    try {
        const project = await Projects.findOne({
            where: {
                id,
                userId 
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
    const userId = req.user.id;  

    try {
        const project = await Projects.findOne({
            where: {
                id,
                userId,  
            }
        });

        if (!project) {
            return res.status(404).json({
                status: false,
                message: 'Projeto não encontrado ou não autorizado',
            });
        }

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
