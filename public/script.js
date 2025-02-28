function salvarUsuario() {
    const nome = document.getElementById("nome").value;
    fetch("http://localhost:3000/salvar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome })
    })
    .then(res => res.json())
    .then(() => listarUsuarios()); // Atualiza a lista de usuários
    }
    
// 📌 Função para listar usuários cadastrados
function listarUsuarios() {
    fetch("http://localhost:3000/usuarios")
        .then(res => res.json())
        .then(usuarios => {
            const lista = document.getElementById("listaUsuarios");
            lista.innerHTML = ""; // Limpa a lista antes de preencher
            usuarios.forEach(user => {
                const li = document.createElement("li");
                li.textContent = user.nome;
                lista.appendChild(li);
            });
        });
}
// 📌 Carregar usuários ao iniciar a página
listarUsuarios();