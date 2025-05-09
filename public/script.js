// 📌 Função para salvar ou editar usuário
function salvarUsuario() {
    const nomeInput = document.getElementById("nome");
    const mensagem = document.getElementById("mensagem");
    const idOculto = document.getElementById("id"); // Pode ser adicionado futuramente se quiser edição com ID

    const nome = nomeInput.value.trim();

    // Validação
    if (!nome) {
        exibirMensagem("Por favor, digite um nome!", "red");
        return;
    }

    // Criação ou edição (se houver ID oculto no futuro)
    const id = idOculto ? idOculto.value : "";
    const url = id ? `http://localhost:3000/editar/${id}` : "http://localhost:3000/salvar";
    const metodo = id ? "PUT" : "POST";

    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome })
    })
    .then(res => res.json())
    .then(data => {
        exibirMensagem(data.mensagem || "Usuário salvo com sucesso!", "green");

        // Limpa o campo
        nomeInput.value = "";
        if (idOculto) idOculto.value = "";

        listarUsuarios(); // Atualiza a lista
    })
    .catch(error => {
        console.error("Erro ao salvar:", error);
        exibirMensagem("Erro ao salvar usuário!", "red");
    });
}

// 📌 Função para listar usuários
function listarUsuarios() {
    fetch("http://localhost:3000/usuarios")
        .then(res => res.json())
        .then(usuarios => {
            const lista = document.getElementById("listaUsuarios");
            lista.innerHTML = "";

            usuarios.forEach(usuario => {
                const li = document.createElement("li");
                li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

                // Evita problema com aspas simples no nome
                const nomeEscapado = usuario.nome.replace(/'/g, "\\'");

                li.innerHTML = `
                    ${usuario.nome}
                    <div>
                        <button class="btn btn-outline-warning btn-sm me-2" onclick="editarUsuario(${usuario.id}, '${nomeEscapado}')">
                            <i class="bi bi-pencil-square fs-6"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deletarUsuario(${usuario.id})">
                            <i class="bi bi-trash fs-6"></i>
                        </button>
                    </div>
                `;

                lista.appendChild(li);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar usuários:", error);
            exibirMensagem("Erro ao carregar usuários!", "red");
        });
}

function editarUsuario(id, nome) {
    const nomeInput = document.getElementById("nome");
    const container = nomeInput.parentElement; // <div class="form-floating">

    // Verifica se já existe o campo oculto
    let idInput = document.getElementById("id");
    if (!idInput) {
        idInput = document.createElement("input");
        idInput.type = "hidden";
        idInput.id = "id";
        container.appendChild(idInput); // ⬅ Adiciona no mesmo container do nome
    }

    idInput.value = id;
    nomeInput.value = nome;
}

// 📌 Deletar usuário
function deletarUsuario(id) {
    if (confirm("Tem certeza que deseja remover este usuário?")) {
        fetch(`http://localhost:3000/delete/${id}`, { method: "DELETE" })
            .then(res => res.json())
            .then(data => {
                alert(data.mensagem || "Usuário removido.");
                listarUsuarios();
            })
            .catch(error => {
                console.error("Erro ao deletar usuário:", error);
                exibirMensagem("Erro ao deletar usuário!", "red");
            });
    }
}

// 📌 Exibe mensagens de feedback
function exibirMensagem(texto, cor) {
    const mensagem = document.getElementById("mensagem");
    mensagem.textContent = texto;
    mensagem.style.color = cor;
    mensagem.style.display = "block";
    setTimeout(() => mensagem.style.display = "none", 3000);
}

// 📌 Inicializa a lista ao carregar a página
document.addEventListener("DOMContentLoaded", listarUsuarios);
