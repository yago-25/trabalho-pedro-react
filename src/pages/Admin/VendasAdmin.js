export default function VendasAdmin() {
  return (
    <div className="vendas-admin">
      <div className="header-titulo-venda">
        <h1>Vendas</h1>
        <h1 style={{ cursor: "pointer" }} onClick={() => alert("a")}>
          +
        </h1>
      </div>
    </div>
  );
}
