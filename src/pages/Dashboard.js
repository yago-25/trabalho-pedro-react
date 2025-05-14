import { Link, useNavigate } from "react-router-dom";
import "./../styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
    localStorage.removeItem("TOKEN");
    localStorage.removeItem("USUARIO");
  };
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <p>Área Administrativa</p>
        <p className="logout" onClick={logout}>
          Sair
        </p>
      </header>
      <div className="links">
        <Link className="link">Editar Produtos</Link>
        <Link className="link">Editar Categorias</Link>
        <Link className="link">Editar Vendas</Link>
      </div>
    </div>
  );
}
