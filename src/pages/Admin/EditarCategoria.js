import { useState } from "react";
import Voltar from "../../components/Voltar";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import axios from "axios";
import { urlApi } from "../../url";
import './../../styles/Admin/EditarCategoria.css';

export default function EditarCategoria() {
  const token = localStorage.getItem("TOKEN");

  const navigate = useNavigate();
  const location = useLocation();
  const categoria = location.state?.categoria;

  const [nome, setNome] = useState(categoria ? categoria.nome : "");
  const [loading, setLoading] = useState(false);

  const editaOuCriaCategoria = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (categoria) {
        await axios.put(
          `${urlApi}/categorias`,
          {
            id: categoria._id,
            nome_categoria: nome,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          `${urlApi}/categorias`,
          {
            nome_categoria: nome,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      navigate("/categorias");
      alert("Categoria atualizada com sucesso!");
    } catch (e) {
      console.log(e);
      alert("Erro ao atualizar categoria.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="editar-categoria">
      {categoria ? (
        <h1>Editar categoria: {categoria.nome}</h1>
      ) : (
        <h1>Criar categoria</h1>
      )}
      <form onSubmit={editaOuCriaCategoria}>
        <div className="input-row">
          <label>
            Nome:
            <input
              type="text"
              value={nome ?? ""}
              onChange={(e) => setNome(e.target.value)}
            />
          </label>
          <div className="botoes">
            <button type="submit">Salvar</button>
            <button type="button" onClick={() => window.history.back()}>
              Cancelar
            </button>
          </div>
        </div>
      </form>
      <Voltar />
    </div>
  );
}
