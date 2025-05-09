//importando modulos 
const express = require("express"); //framework para criar o servidor 
const sqlite3 = require("sqlite3").verbose(); // Banco de dados SQlite
const cors = require("cors"); // permite requisicoes entre front end e backend
const bodyParser = require("body-parser") // Middleware para processar o JSON


//Inicializa o servidor Express

const app = express();
app.use(cors()); // permite comunicaçao do frontend
app.use(bodyParser.json()); // PROCESSA O JSON no corpo da requisiçao 


// COnexao com o banco de dados SQLite 

const db = new sqlite3.Database("meuSite.db", err =>{
    if(err)console.error("Erro ao conectar ao SQLite", err);
    else console.log("BANCO DE DADOS SQLITE CONECTADO")
});


//CRIAR A TABELA 'USUARIOS'SE NAO EXISTIR 

db.serialize(() =>{
    db.run("CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT)");

    console.log("TABELA 'USUARIOS'verificada/criada com sucesso");
});

// ROTA PARA SALVAR UM NOVO USUARIO 

app.post("/salvar",(req,res)=> {
    const {nome} = req.body; 
    if(!nome) return res.status(400).json({ mensagem: "Nome é obrigatório!"});

    const sql = "INSERT INTO usuarios (nome) VALUES(?)";
    db.run(sql,[nome],function(err){
        if(err){
            console.error("Erro ao inserir", err);

            return res.status(500).json({mensagem: "Erro ao salvar no banco."});
        }

        res.json({mensagem: "Nome Salvo com sucesso!", id: this.lastID});


    });
});

//ROTA PARA LISTAR TODOS OS USUARIOS 

app.get("/usuarios",(req,res)=>{
    db.all("SELECT * FROM usuarios", [] , (err,rows) =>{
        if (err){
            console.error("Erro ao buscar usuários:", err);
            return res.status(500).json({mensagem: "Erro ao buscar usuário"});
        }
        res.json(rows);
    });
});
app.delete("/delete/:id",(req,res)=>{
    const {id} = req.params;
    const sql = "DELETE FROM usuarios WHERE id = ?";
    db.run(sql,[id],function(err){
        if(err){
            console.error("Erro ao deletar", err);
            return res.status(500).json({mensagem: "Erro ao deletar"});
        }
        res.json({mensagem: "Usuário deletado com sucesso!"});
    });
})

//ROTA PARA EDITAR USUARIO 

app.put("/editar/:id", (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;

    // Validação simples
    if (!nome || nome.trim() === "") {
        return res.status(400).json({ mensagem: "O nome é obrigatório." });
    }

    const sql = "UPDATE usuarios SET nome = ? WHERE id = ?";
    db.run(sql, [nome, id], function (err) {
        if (err) {
            console.error("Erro ao editar usuário:", err);
            return res.status(500).json({ mensagem: "Erro ao editar usuário." });
        }

        if (this.changes === 0) {
            return res.status(404).json({ mensagem: "Usuário não encontrado." });
        }

        res.json({ mensagem: "Usuário atualizado com sucesso!" });
    });
});
//INICIA O SERVIDOR NA PORTA 3000
app.listen(3000,() =>{
    console.log("servidor rodando na porta 3000");

});


