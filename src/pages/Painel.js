import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Painel.css";
import axios from "axios";
import { urlApi, user } from "../url";

export default function Painel() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [carrinho, setCarrinho] = useState([]);
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

  const irParaCheckout = () => {
    const params = new URLSearchParams();
    carrinho.forEach((p, i) => {
      params.append(`produtos[${i}][_id]`, p._id);
      params.append(`produtos[${i}][nome]`, p.nome);
      params.append(`produtos[${i}][quantidade]`, p.quantidade);
      params.append(`produtos[${i}][preco]`, p.preco);
    });
    navigate(`/checkout?${params.toString()}`);
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
              <select style={{ width: "100%" }}>
                <option value="pix">Pix</option>
                <option value="credito">Cartão de Crédito</option>
                <option value="debito">Cartão de Débito</option>
                <option value="dinheiro">Dinheiro</option>
              </select>
              <button onClick={irParaCheckout}>Comprar</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
