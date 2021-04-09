import "./App.css";
import MineSweeper from "./components/MineSweeper";

function App() {
  return (
    <div className="App">
      <MineSweeper rows={3} />
    </div>
  );
}

export default App;
