// Carregar as entradas salvas no localStorage (caso existam)
let entradas = JSON.parse(localStorage.getItem("entradas")) || [
    {
      titulo: "Última Canção",
      categoria: "Música",
      descricao: "Gravação recuperada de um rádio AM em 2165.",
      data: "2165-02-01"
    },
    {
      titulo: "Receita de pão do século XXI",
      categoria: "Cotidiano",
      descricao: "Receita tradicional que sobreviveu às guerras.",
      data: "2043-09-12"
    }
  ];
  
  function salvarEntradas() {
    localStorage.setItem("entradas", JSON.stringify(entradas));
  }
  
  // Função para salvar entradas no localStorage
  const salvarEntradasNoLocalStorage = () => {
    localStorage.setItem('entradas', JSON.stringify(entradas));
  };
  
  // Home: Entrada Aleatória
  if (document.getElementById("entrada-aleatoria")) {
    const aleatoria = entradas[Math.floor(Math.random() * entradas.length)];
    document.getElementById("entrada-aleatoria").innerHTML = `
      <div class="entry">
        <h3>${aleatoria.titulo}</h3>
        <p><strong>Categoria:</strong> ${aleatoria.categoria}</p>
        <p><strong>Descrição:</strong> ${aleatoria.descricao}</p>
        <p><strong>Data Estimada:</strong> ${formatarDataBR(aleatoria.data)}</p>
      </div>`;
  }
  
  // Acervo: Listar e filtrar
  if (document.getElementById("lista-acervo")) {
    const renderEntradas = (filtro = "", busca = "") => {
      const container = document.getElementById("lista-acervo");
      container.innerHTML = "";
      entradas
        .filter(e => (!filtro || e.categoria === filtro) && e.titulo.toLowerCase().includes(busca.toLowerCase()))
        .forEach(e => {
          container.innerHTML += `
          <div class="entry">
            <h3>${e.titulo}</h3>
            <p><strong>Categoria:</strong> ${e.categoria}</p>
            <p>${e.descricao}</p>
            <p><em>${formatarDataBR(e.data)}</em></p>
            <button onclick="excluirEntrada('${e.titulo}')">Excluir</button>
          </div>`;
        });
    };
  
    renderEntradas();

    function excluirEntrada(titulo) {
        const index = entradas.findIndex(e => e.titulo === titulo);
            if (index !== -1) {
                if (confirm("Tem certeza que deseja excluir esta entrada?")) {
                   entradas.splice(index, 1);
                   salvarEntradas();
                   renderEntradas(
                    document.getElementById("filtro-categoria").value,
                    document.getElementById("busca").value
                    );
            }
        }
    }
  
    document.getElementById("filtro-categoria").addEventListener("change", e => {
      renderEntradas(e.target.value, document.getElementById("busca").value);
    });
    document.getElementById("busca").addEventListener("input", e => {
      renderEntradas(document.getElementById("filtro-categoria").value, e.target.value);
    });
  };
  
  // Cadastro: Salvar entrada
  if (document.getElementById("form-cadastro")) 
    document.getElementById("form-cadastro").addEventListener("submit", e => {
      e.preventDefault();
      const nova = {
        titulo: document.getElementById("titulo").value,
        categoria: document.getElementById("categoria").value,
        descricao: document.getElementById("descricao").value,
        data: document.getElementById("data-estimada").value
      };
      entradas.push(nova);
      salvarEntradas();
      alert("Entrada cadastrada com sucesso!");
      e.target.reset();
    });
  
  // Dashboard: Gráfico por categoria
  if (document.getElementById("grafico-categorias")) {
    const categorias = {};
    entradas.forEach(e => {
      categorias[e.categoria] = (categorias[e.categoria] || 0) + 1;
    });
  
    if (Object.keys(categorias).length > 0) {
      const ctx = document.getElementById("grafico-categorias").getContext("2d");
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: Object.keys(categorias),
          datasets: [{
            data: Object.values(categorias),
            backgroundColor: ['#00f0ff', '#c800ff', '#39ff14', '#ff0077']
          }]
        },
        options: {
          responsive: false,
          plugins: {
            legend: {
              labels: { color: '#00f0ff' }
            }
          }
        }
      });
    } else {
      document.getElementById("grafico-categorias").innerHTML = "<p>Não há entradas cadastradas para gerar o gráfico.</p>";
    }
  }
  
  function formatarDataBR(data) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(data));
  }