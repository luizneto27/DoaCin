import { React } from "react";
import "./App.css";

function App() {
  return (
    <>
      <div className="Cabeçalho">
        <h1>Bem Vindo! Realize seu Cadastro abaixo:</h1>
      </div>
      <div className="Formulário">
        <form>
          <label>Nome Completo:</label>
          <input type="text" name="nome" required />
          <br />
          <label>Data de Nascimento:</label>
          <input type="date" name="nascimento" required />
        </form>
      </div>
    </>
  );
}

export default App;
