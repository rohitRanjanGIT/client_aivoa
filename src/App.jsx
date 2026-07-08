import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import InteractionForm from "./components/InteractionForm.jsx";
import AiAssistant from "./components/AiAssistant.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { getModels } from "./api/client.js";
import { setModels } from "./features/chat/chatSlice.js";

export default function App() {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);

  // Load the model catalog once so the sidebar switcher is populated.
  useEffect(() => {
    getModels()
      .then((data) => dispatch(setModels(data)))
      .catch(() => {}); // sidebar simply shows no models if the backend is down
  }, [dispatch]);

  // Collapsed → a thin rail; expanded → the full 280px panel.
  const cols = collapsed
    ? "lg:grid-cols-[52px_1.5fr_1fr]"
    : "lg:grid-cols-[280px_1.5fr_1fr]";

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-800">
      <div className={`mx-auto grid max-w-[1600px] grid-cols-1 gap-4 ${cols}`}>
        <aside className="max-h-[calc(100vh-2rem)] overflow-hidden rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        </aside>
        <section className="max-h-[calc(100vh-2rem)] overflow-y-auto rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <InteractionForm />
        </section>
        <section className="flex max-h-[calc(100vh-2rem)] flex-col rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <AiAssistant />
        </section>
      </div>
    </div>
  );
}
