import Toolbar from "./components/Toolbar";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import CodePanel from "./components/CodePanel";

function App() {
  return (
    <div
      className="flex h-screen flex-col"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <Toolbar />
      <main className="flex flex-1 overflow-hidden">
        <Sidebar />
        <Canvas />
        <CodePanel />
      </main>
    </div>
  );
}

export default App;
