import React, { useEffect, useState } from "react";

// JQ Motors - Single-file React app (Tailwind classes) // How to use: // 1) Create a React app (Vite / Create React App) and ensure Tailwind CSS is installed. // 2) Replace App.jsx / App.tsx with this file (or import the default export component). // 3) Configure API_BASE to point to your deployed Python backend that returns inventory data. //    Expected endpoint: GET ${API_BASE}/inventory?code=CODIGO //    Expected JSON response shape: //    { //      "code": "AN250", //      "agencies": [ //        {"agency": "Sucursal Centro", "description": "Balata delantera AN250", "quantity": 5, "price": 120.5}, //        {"agency": "Bodega Planta", "description": "Balata delantera AN250", "quantity": 0, "price": 115.0} //      ] //    } // 4) If you don't yet have the backend, toggle Demo mode in the UI to use sample data. // 5) The default password is "administrador". You can change it in Settings (stored hashed in localStorage).

const API_BASE = "REPLACE_WITH_YOUR_PYTHON_BACKEND_URL"; // e.g. https://my-backend.example.com

// Utility: SHA-256 hash for storing password securely (browser-side) async function sha256(text) { const encoder = new TextEncoder(); const data = encoder.encode(text); const hashBuffer = await crypto.subtle.digest("SHA-256", data); const hashArray = Array.from(new Uint8Array(hashBuffer)); return hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); }

const DEFAULT_PASSWORD = "administrador"; const STORAGE_KEY = "jqmotors_password_hash"; const STORAGE_PREFS = "jqmotors_prefs";

export default function App() { const [ready, setReady] = useState(false); const [authenticated, setAuthenticated] = useState(false); const [demoMode, setDemoMode] = useState(false); const [loading, setLoading] = useState(false); const [query, setQuery] = useState(""); const [results, setResults] = useState(null); const [error, setError] = useState(null); const [currentPage, setCurrentPage] = useState("search"); // 'search' or 'settings' const [prefs, setPrefs] = useState({});

useEffect(() => { (async () => { // ensure a password hash exists const existing = localStorage.getItem(STORAGE_KEY); if (!existing) { const h = await sha256(DEFAULT_PASSWORD); localStorage.setItem(STORAGE_KEY, h); } const p = JSON.parse(localStorage.getItem(STORAGE_PREFS) || "{}"); setPrefs(p); setDemoMode(!!p.demoMode); setReady(true); })(); }, []);

async function handleLogin(input) { setError(null); const storedHash = localStorage.getItem(STORAGE_KEY); const inputHash = await sha256(input); if (inputHash === storedHash) { setAuthenticated(true); setCurrentPage("search"); } else { setError("Contraseña incorrecta"); } }

async function changePassword(oldPass, newPass) { setError(null); const storedHash = localStorage.getItem(STORAGE_KEY); const oldHash = await sha256(oldPass); if (oldHash !== storedHash) { setError("La contraseña actual no coincide"); return false; } const newHash = await sha256(newPass); localStorage.setItem(STORAGE_KEY, newHash); return true; }

function savePrefs(updates) { const merged = { ...prefs, ...updates }; setPrefs(merged); localStorage.setItem(STORAGE_PREFS, JSON.stringify(merged)); if (typeof updates.demoMode !== "undefined") setDemoMode(updates.demoMode); }

async function performSearch(code) { setLoading(true); setResults(null); setError(null); setQuery(code);

try {
  if (demoMode || API_BASE === "REPLACE_WITH_YOUR_PYTHON_BACKEND_URL") {
    // demo data
    await new Promise((r) => setTimeout(r, 400));
    const sample = {
      code: code || "AN250",
      agencies: [
        { agency: "Sucursal Centro", description: "Balata delantera AN250", quantity: 5, price: 120.5 },
        { agency: "Bodega Planta", description: "Balata delantera AN250", quantity: 0, price: 115.0 },
        { agency: "Sucursal Norte", description: "Balata delantera AN250 - Alta fricción", quantity: 2, price: 135.0 }
      ]
    };
    setResults(sample);
    setLoading(false);
    return;
  }

  const resp = await fetch(`${API_BASE.replace(/\/$/, "")}/inventory?code=${encodeURIComponent(code)}`);
  if (!resp.ok) throw new Error(`Error del servidor: ${resp.status}`);
  const data = await resp.json();
  // Expect { code: '...', agencies: [ {agency, description, quantity, price}, ... ] }
  setResults(data);
} catch (err) {
  setError(err.message || "Error desconocido");
} finally {
  setLoading(false);
}

}

if (!ready) return <div className="p-6">Cargando...</div>;

if (!authenticated) return <AuthScreen onLogin={handleLogin} error={error} />;

return ( <div className="min-h-screen bg-gray-50 text-gray-900"> <header className="bg-white shadow-sm sticky top-0 z-20"> <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between"> <div className="flex items-center gap-3"> <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">JQ</div> <div> <div className="font-semibold">JQ Motors - Refacciones</div> <div className="text-xs text-gray-500">Catálogo multi-agencia</div> </div> </div>

<nav className="flex items-center gap-3">
        <button className={`px-3 py-2 rounded-md ${currentPage === "search" ? "bg-indigo-600 text-white" : "hover:bg-gray-100"}`} onClick={() => setCurrentPage("search")}>Buscar</button>
        <button className={`px-3 py-2 rounded-md ${currentPage === "settings" ? "bg-indigo-600 text-white" : "hover:bg-gray-100"}`} onClick={() => setCurrentPage("settings")}>Configuración</button>
        <button className="px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => { setAuthenticated(false); setResults(null); }}>Salir</button>
      </nav>
    </div>
  </header>

  <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {currentPage === "search" && (
      <SearchPage
        onSearch={performSearch}
        loading={loading}
        results={results}
        error={error}
        demoMode={demoMode}
        savePrefs={savePrefs}
      />
    )}

    {currentPage === "settings" && (
      <SettingsPage
        demoMode={demoMode}
        savePrefs={savePrefs}
        onChangePassword={changePassword}
        apiBase={API_BASE}
        setApiBase={(url) => {
          // Note: API_BASE is a constant in this file; instruct user to change it in source.
          alert("Para cambiar la URL del backend, edita la constante API_BASE en el archivo de la app.");
        }}
      />
    )}
  </main>

  <footer className="text-center text-sm text-gray-500 py-6">Hecho para JQ Motors • Demo local disponible • Conecta tu backend Python para datos reales</footer>
</div>

); }

function AuthScreen({ onLogin, error }) { const [input, setInput] = useState(""); return ( <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 p-6"> <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6"> <h2 className="text-2xl font-semibold mb-2">Acceso - JQ Motors</h2> <p className="text-sm text-gray-500 mb-4">Introduce la contraseña para continuar.</p> <input value={input} onChange={(e) => setInput(e.target.value)} type="password" placeholder="Contraseña" className="w-full p-3 border rounded-md mb-3" /> {error && <div className="text-red-600 text-sm mb-2">{error}</div>} <div className="flex gap-2"> <button className="flex-1 bg-indigo-600 text-white p-3 rounded-md" onClick={() => onLogin(input)}>Entrar</button> </div> <div className="mt-4 text-xs text-gray-500">Contraseña por defecto: <span className="font-medium">administrador</span></div> </div> </div> ); }

function SearchPage({ onSearch, loading, results, error, demoMode, savePrefs }) { const [code, setCode] = useState("");

return ( <div> <div className="bg-white rounded-2xl p-5 shadow-sm mb-6"> <div className="flex flex-col sm:flex-row gap-3"> <input placeholder="Escribe código de refacción (ej. AN250)" value={code} onChange={(e) => setCode(e.target.value)} className="flex-1 p-3 border rounded-md" /> <button onClick={() => onSearch(code)} className="px-5 py-3 bg-indigo-600 text-white rounded-md">Buscar</button> <label className="flex items-center gap-2 text-sm"> <input type="checkbox" checked={demoMode} onChange={(e) => savePrefs({ demoMode: e.target.checked })} /> Demo mode </label> </div> <div className="mt-2 text-xs text-gray-500">Si tu backend está desplegado, desactiva Demo mode y asegúrate de configurar API_BASE en el archivo.</div> </div>

<div>
    {loading && <CardSkeleton />}
    {error && <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>}
    {results && <ResultsGrid data={results} />}
  </div>
</div>

); }

function CardSkeleton() { return ( <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> {[1, 2, 3].map((i) => ( <div key={i} className="p-4 bg-white rounded-lg shadow-sm animate-pulse"> <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" /> <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" /> <div className="h-12 bg-gray-200 rounded w-full" /> </div> ))} </div> ); }

function ResultsGrid({ data }) { // data.agencies => array of { agency, description, quantity, price } const agencies = data.agencies || [];

if (!agencies.length) return <div className="p-4 bg-yellow-50 rounded-md">No se encontraron agencias para este código.</div>;

return ( <div> <div className="mb-4"> <h3 className="text-lg font-semibold">Resultados para: <span className="text-indigo-600">{data.code}</span></h3> <p className="text-sm text-gray-500">Se muestran {agencies.length} agencias</p> </div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {agencies.map((a, idx) => (
      <div key={idx} className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-medium">{a.agency}</div>
            <div className="text-sm text-gray-500">{a.description}</div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-semibold ${a.quantity > 0 ? "text-emerald-600" : "text-gray-400"}`}>{a.quantity}</div>
            <div className="text-xs text-gray-500">piezas</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">Precio</div>
          <div className="text-lg font-semibold">${Number(a.price).toFixed(2)}</div>
        </div>

        <div className="mt-3 flex gap-2">
          <button className="flex-1 p-2 rounded-md border hover:bg-gray-50">Reservar</button>
          <button className="p-2 rounded-md bg-indigo-600 text-white">Ver</button>
        </div>
      </div>
    ))}
  </div>
</div>

); }

function SettingsPage({ demoMode, savePrefs, onChangePassword, apiBase, setApiBase }) { const [oldPass, setOldPass] = useState(""); const [newPass, setNewPass] = useState(""); const [confirm, setConfirm] = useState(""); const [msg, setMsg] = useState(null);

async function handleChange() { setMsg(null); if (!oldPass || !newPass) { setMsg({ type: "error", text: "Completa ambas contraseñas" }); return; } if (newPass !== confirm) { setMsg({ type: "error", text: "La nueva contraseña y su confirmación no coinciden" }); return; } const ok = await onChangePassword(oldPass, newPass); if (ok) { setMsg({ type: "success", text: "Contraseña actualizada" }); setOldPass(""); setNewPass(""); setConfirm(""); } else { setMsg({ type: "error", text: "No se pudo cambiar la contraseña" }); } }

return ( <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> <div className="bg-white p-6 rounded-2xl shadow-sm"> <h3 className="text-lg font-semibold mb-3">Seguridad</h3> <p className="text-sm text-gray-500 mb-4">Cambia la contraseña de acceso (la contraseña por defecto es "administrador").</p> <input type="password" placeholder="Contraseña actual" value={oldPass} onChange={(e) => setOldPass(e.target.value)} className="w-full p-3 border rounded-md mb-2" /> <input type="password" placeholder="Nueva contraseña" value={newPass} onChange={(e) => setNewPass(e.target.value)} className="w-full p-3 border rounded-md mb-2" /> <input type="password" placeholder="Confirmar nueva contraseña" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full p-3 border rounded-md mb-3" /> <button className="px-4 py-2 bg-indigo-600 text-white rounded-md" onClick={handleChange}>Cambiar contraseña</button> {msg && <div className={mt-3 text-sm ${msg.type === "error" ? "text-red-600" : "text-emerald-600"}}>{msg.text}</div>} </div>

<div className="bg-white p-6 rounded-2xl shadow-sm">
    <h3 className="text-lg font-semibold mb-3">Conexión al Backend</h3>
    <p className="text-sm text-gray-500 mb-4">La app obtiene datos desde un backend Python. Debes desplegar tu aplicación Python (por ejemplo en Heroku, Railway, Render, o un servidor propio) y poner la URL aquí editando el código fuente (constante API_BASE) o en una variable de entorno en tu proyecto.</p>
    <div className="mb-3">
      <label className="text-sm text-gray-600">Demo mode</label>
      <div className="flex items-center gap-3 mt-2">
        <label className="flex items-center gap-2"><input type="checkbox" checked={demoMode} onChange={(e) => savePrefs({ demoMode: e.target.checked })} /> Usar datos de ejemplo</label>
      </div>
    </div>

    <div>
      <label className="text-sm text-gray-600">Formato de respuesta esperado</label>
      <pre className="mt-2 text-xs bg-gray-100 p-3 rounded">{

{ "code": "AN250", "agencies": [ {"agency": "Sucursal Centro", "description": "Balata...", "quantity": 5, "price": 120.5} ] } }</pre>

<div className="mt-3 text-sm text-gray-500">Si necesitas, puedo generar el ejemplo del endpoint Python que devuelva este JSON, listo para alojar en GitHub / Railway.</div>
    </div>
  </div>
</div>

); }
