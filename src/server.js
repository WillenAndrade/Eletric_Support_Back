const express = require("express")
const cors = require("cors")
const app = express()

const port = 3000

require("./models");

const routes = require("./routes")

app.use(express.json())
app.use(cors())
app.use(routes)

app.get("/", (req,res)=>{
    res.send("Continue the hard Work!")
})

// Sincroniza o banco de dados antes de iniciar o servidor
const sequelize = require("./db/connection");
sequelize.sync({ alter: true })  // Se você quiser permitir alterações na estrutura das tabelas
  .then(() => {
    app.listen(port, () => {
      console.log("Server running at the port " + port);
    });
  })
  .catch((err) => {
    console.error('Erro ao sincronizar o banco de dados:', err);
  });
