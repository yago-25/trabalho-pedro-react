import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Painel.css";
import axios from "axios";
import { urlApi, user } from "../url";

export default function Painel() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [carrinho, setCarrinho] = useState([]);
  const [nome, setNome] = useState("");
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
  const navigate = useNavigate();

  const getProdutos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${urlApi}/produtos/${user}`);
      setProdutos(response.data);
    } catch (e) {
      console.log(e);
      alert("Erro ao buscar produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProdutos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const adicionarAoCarrinho = (produto) => {
    const jaExiste = carrinho.find((p) => p._id === produto._id);
    if (jaExiste) {
      setCarrinho(
        carrinho.map((p) =>
          p._id === produto._id ? { ...p, quantidade: p.quantidade + 1 } : p
        )
      );
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    }
  };

  const removerDoCarrinho = (id) => {
    setCarrinho((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, quantidade: item.quantidade - 1 } : item
        )
        .filter((item) => item.quantidade > 0)
    );
  };

  const cadastrarVenda = async () => {
    if (!nome.trim()) {
      alert("Digite o nome do cliente.");
      return;
    }

    if (carrinho.length === 0) {
      alert("Carrinho vazio.");
      return;
    }

    const payload = {
      nomeCliente: nome,
      data: new Date().toISOString().split("T")[0],
      usuario: user,
      produtos: carrinho.map((item) => ({
        nome: item.nome,
        quantidade: item.quantidade,
        preco: item.preco,
      })),
    };

    try {
      await axios.post(`${urlApi}/vendas`, payload);
      alert("Venda cadastrada com sucesso!");
      setCarrinho([]);
      setNome("");
      setMostrarCarrinho(false);
      navigate('/agradecimento', { state: nome });
    } catch (e) {
      console.error(e);
      alert("Erro ao cadastrar a venda.");
    }
  };

  const total = carrinho.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );

  return (
    <div className="painel">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Produtos</h1>
        <p
          style={{ cursor: "pointer", fontSize: "24px" }}
          onClick={() => setMostrarCarrinho(!mostrarCarrinho)}
        >
          🛒 ({carrinho.length})
        </p>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="tabela-container-painel">
          <table className="tabela-produtos">
            <thead>
              <tr>
                <th>Imagem</th>
                <th>Nome</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Descrição</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((prod) => (
                <tr key={prod._id}>
                  <td>
                    <img src={prod.imagem} alt={prod.nome} width={50} />
                  </td>
                  <td>{prod.nome}</td>
                  <td>R$ {prod.preco.toFixed(2)}</td>
                  <td>{prod.categoria}</td>
                  <td>{prod.descricao}</td>
                  <td>
                    <button onClick={() => adicionarAoCarrinho(prod)}>
                      Adicionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mostrarCarrinho && (
        <div
          className="carrinho"
          style={{
            marginTop: "20px",
            color: "#282c34",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "210px",
            maxHeight: "400px",
            overflowX: "auto",
          }}
        >
          <h2>Seu carrinho</h2>
          {carrinho.length === 0 ? (
            <p>Nenhum produto no carrinho.</p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <ul style={{ listStyle: "none", padding: 0 }}>
                {carrinho.map((item) => (
                  <li key={item._id}>
                    {item.nome} — {item.quantidade}x R${item.preco.toFixed(2)}{" "}
                    <button onClick={() => removerDoCarrinho(item._id)}>
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
              <p style={{ fontWeight: "bold" }}>Total: R$ {total.toFixed(2)}</p>
              <select
                style={{
                  width: "100%",
                  height: "30px",
                  borderRadius: "5px",
                  outline: "none",
                  border: "none",
                }}
              >
                <option value="pix">Pix</option>
                <option value="credito">Cartão de Crédito</option>
                <option value="debito">Cartão de Débito</option>
                <option value="dinheiro">Dinheiro</option>
              </select>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                type="text"
                style={{
                  width: "100%",
                  height: "30px",
                  borderRadius: "5px",
                  outline: "none",
                  border: "none",
                }}
                placeholder="Digite seu nome"
              />
              <button onClick={cadastrarVenda}>Comprar</button>
            </div>
          )}
        </div>
      )}
      <div style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        Voltar
      </div>
    </div>
  );
}
