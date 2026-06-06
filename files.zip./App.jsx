import { useState, useEffect } from "react";
import SupabaseSync from "./SupabaseSync";
import Tracker from "./Tracker";

export default function App() {
  const [syncEnabled, setSyncEnabled] = useState(() => {
    try { return JSON.parse(localStorage.getItem("eb_sync_enabled") || "false"); } catch { return false; }
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    localStorage.setItem("eb_sync_enabled", JSON.stringify(syncEnabled));
  }, [syncEnabled]);

  return (
    <div>
      <Tracker user={user} syncEnabled={syncEnabled} />
      {!user && (
        <SupabaseSync onToggle={setSyncEnabled} onUserChange={setUser} />
      )}
    </div>
  );
}
