import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import axios from "axios";
import { urlApi } from "../../url";
import Voltar from "../../components/Voltar";
import "./../../styles/Admin/CategoriasAdmin.css";
import { useNavigate } from "react-router-dom";

export default function CategoriasAdmin() {
  const navigate = useNavigate();
  const token = localStorage.getItem("TOKEN");

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);

  const buscarCategorias = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${urlApi}/categorias`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setCategorias(response.data);
    } catch (e) {
      console.log(e);
      alert("Erro ao buscar categorias");
    } finally {
      setLoading(false);
    }
  };

  const editarCategoria = (categoria) => {
    navigate("/categorias/alterar", { state: { categoria } });
  };

  const criarCategoria = () => {
    navigate("/categorias/alterar");
  };

  const removerCategoria = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${urlApi}/categorias`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { id },
      });
      buscarCategorias();
      alert("Categoria deletada com sucesso!");
    } catch (e) {
      console.log(e);
      alert("Erro ao deletar categoria.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarCategorias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="categorias-admin">
      <div className="header-titulo-cat">
        <h1>Categorias</h1>
        <h1 style={{ cursor: "pointer" }} onClick={() => criarCategoria()}>
          +
        </h1>
      </div>
      <table className="tabela-categorias">
        <thead>
          <th>ID</th>
          <th>Nome</th>
          <th>Usuário</th>
          <th>Ações</th>
        </thead>
        <tbody>
          {categorias.map((cat) => (
            <tr key={cat._id}>
              <td>{cat._id}</td>
              <td>{cat.nome}</td>
              <td>{cat.usuario}</td>
              <td>
                <p
                  style={{ color: "yellow", cursor: "pointer" }}
                  onClick={() => editarCategoria(cat)}
                >
                  Editar
                </p>
                <p
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => {
                    const confirmar = window.confirm(
                      "Tem certeza que deseja excluir esta categoria?"
                    );
                    if (confirmar) {
                      removerCategoria(cat._id);
                    }
                  }}
                >
                  Excluir
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Voltar />
    </div>
  );
}
