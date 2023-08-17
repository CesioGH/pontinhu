// ColecaoCard.js

const ColecaoCard = ({ colecao }) => {
    return (
      <div style={{ border: "1px solid grey", margin: "10px", padding: "10px" }}>
        <h3>{colecao.nome}</h3>
        <p>Preço: {colecao.preco}</p>
        <ul>
          {colecao.resumos.map(resumoId => (
            <li key={resumoId}>{resumoId}</li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default ColecaoCard;
  