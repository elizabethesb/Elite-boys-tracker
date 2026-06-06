import { useState, useEffect } from "react";
import { syncToSupabase, syncFromSupabase } from "./supabaseClient";

const BOYS = [
  { id: "eli", name: "Eli", color: "#00C9FF", accent: "#0077FF" },
  { id: "zachary", name: "Zachary", color: "#00E676", accent: "#00897B" },
  { id: "caleb", name: "Caleb", color: "#FF6D6D", accent: "#E53935" },
];

const DEFAULT_TASKS = {
  earn: [
    { id: "e1", label: "1 hour reading (with explanation to parent)", pts: 1 },
    { id: "e2", label: "30 min garden training session", pts: 1 },
    { id: "e3", label: "5 laps of the park", pts: 1 },
    { id: "e4", label: "Sunday living room clean (together)", pts: 1 },
    { id: "e5", label: "Putting clothes away (together)", pts: 1 },
    { id: "e6", label: "Saturday shoes + hoover stairs & front door", pts: 1 },
    { id: "e7", label: "15 mins reading", pts: 1 },
    { id: "e8", label: "2+ stickers from teacher", pts: 1 },
    { id: "e9", label: "20 min training session", pts: 1 },
    { id: "e10", label: "20 min learning video on YouTube", pts: 1 },
    { id: "e11", label: "Certificate from school", pts: 2 },
    { id: "e12", label: "Man of the Match performance", pts: 2 },
    { id: "e13", label: "Every book read & finished (with explanation)", pts: 2 },
  ],
  lose: [
    { id: "l1", label: "Every minute late to bedtime", pts: 1 },
    { id: "l2", label: "Late to school", pts: 1 },
    { id: "l3", label: "Leaving eating area messy", pts: 1 },
    { id: "l4", label: "Leaving clothes on floor", pts: 1 },
    { id: "l5", label: "Late to tutor lesson", pts: 1 },
    { id: "l6", label: "Not doing what you've been told", pts: 1 },
    { id: "l7", label: "Breaking something by doing what you were told not to", pts: 2 },
    { id: "l8", label: "Lying", pts: 2 },
  ],
  caleb: [
    { id: "c1", label: "Dry night", pts: 2 },
    { id: "c2", label: "2 laps of the park", pts: 1 },
    { id: "c3", label: "Every 2 books completed", pts: 2 },
  ],
};

const REWARDS = [
  { pts: 200, label: "Weekend Away with available parent", icon: "✈️" },
  { pts: 150, label: "Day out in the country with available parent", icon: "🌳" },
  { pts: 100, label: "Restaurant of choice + £40 on PlayStation", icon: "🎮" },
  { pts: 50, label: "Restaurant + £10 on PlayStation", icon: "🍽️" },
];

function getReward(pts) {
  for (const r of REWARDS) { if (pts >= r.pts) return r; }
  return null;
}
function getNextReward(pts) {
  for (let i = REWARDS.length - 1; i >= 0; i--) {
    if (REWARDS[i].pts > pts) return REWARDS[i];
  }
  return null;
}

function TaskModal({ task, type, onSave, onClose }) {
  const [label, setLabel] = useState(task ? task.label : "");
  const [pts, setPts] = useState(task ? task.pts : 1);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000c", zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20
    }} onClick={onClose}>
      <div style={{
        background: "#161620", border: "1px solid #2a2a3a", borderRadius: 16,
        padding: 24, width: "100%", maxWidth: 380
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#aaa", marginBottom: 16, letterSpacing: 1 }}>
          {task ? "EDIT TASK" : `ADD ${type.toUpperCase()} TASK`}
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, color: "#555", display: "block", marginBottom: 5 }}>TASK LABEL</label>
          <input
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="Describe the task..."
            style={{
              width: "100%", background: "#111", border: "1px solid #333", borderRadius: 8,
              padding: "10px 12px", color: "#fff", fontSize: 13, outline: "none",
              boxSizing: "border-box"
            }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, color: "#555", display: "block", marginBottom: 8 }}>POINTS</label>
          <div style={{ display: "flex", gap: 8 }}>
            {[1, 2, 3, 5].map(p => (
              <button key={p} onClick={() => setPts(p)} style={{
                flex: 1, padding: "10px 0", borderRadius: 8, border: "none", cursor: "pointer",
                background: pts === p ? (type === "lose" ? "#FF5050" : "#00C980") : "#1e1e1e",
                color: pts === p ? "#000" : "#555", fontWeight: 800, fontSize: 15
              }}>{p}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "11px 0", borderRadius: 10, border: "1px solid #333",
            background: "none", color: "#666", cursor: "pointer", fontSize: 13
          }}>Cancel</button>
          <button onClick={() => label.trim() && onSave({ label: label.trim(), pts })} style={{
            flex: 2, padding: "11px 0", borderRadius: 10, border: "none",
            background: type === "lose" ? "#FF5050" : "#00C980",
            color: "#000", fontWeight: 700, cursor: "pointer", fontSize: 13
          }}>
            {task ? "Save Changes" : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PointLog({ log }) {
  if (!log.length) return <div style={{ color: "#555", fontSize: 13, textAlign: "center", padding: "18px 0" }}>No activity yet</div>;
  return (
    <div style={{ maxHeight: 200, overflowY: "auto", display: "flex", flexDirection: "column", gap: 5 }}>
      {[...log].reverse().map((entry, i) => (
        <div key={i} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: entry.pts > 0 ? "rgba(0,201,136,0.07)" : "rgba(255,80,80,0.07)",
          borderLeft: `3px solid ${entry.pts > 0 ? "#00C980" : "#FF5050"}`,
          borderRadius: "0 6px 6px 0", padding: "6px 10px", fontSize: 12
        }}>
          <span style={{ color: "#ccc", flex: 1 }}>{entry.reason}</span>
          <span style={{ fontWeight: 700, fontSize: 13, color: entry.pts > 0 ? "#00E676" : "#FF6D6D", minWidth: 36, textAlign: "right" }}>
            {entry.pts > 0 ? `+${entry.pts}` : entry.pts}
          </span>
        </div>
      ))}
    </div>
  );
}

function TaskRow({ task, color, type, onAction, onEdit, onDelete }) {
  const [showActions, setShowActions] = useState(false);
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "stretch", position: "relative" }}>
      <button
        onClick={() => { onAction(task.label, task.pts); }}
        style={{
          flex: 1, textAlign: "left", background: "#111",
          border: `1px solid ${type === "lose" ? "#FF505033" : "#22222299"}`,
          borderRadius: 8, padding: "8px 10px", color: "#bbb", fontSize: 12, cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = type === "lose" ? "#FF5050" : color}
        onMouseLeave={e => e.currentTarget.style.borderColor = type === "lose" ? "#FF505033" : "#22222299"}
      >
        <span>{type === "lose" ? "−" : "+"}{task.pts > 1 ? task.pts === 2 ? "+" : `×${task.pts}` : ""} {task.label}</span>
        <span style={{
          fontSize: 10, fontWeight: 800, minWidth: 28, textAlign: "center",
          padding: "2px 6px", borderRadius: 99,
          background: type === "lose" ? "#FF505020" : "#00C98020",
          color: type === "lose" ? "#FF7070" : "#00E676"
        }}>{type === "lose" ? `-${task.pts}` : `+${task.pts}`}</span>
      </button>
      <button onClick={() => setShowActions(s => !s)} style={{
        padding: "0 8px", background: "#111", border: "1px solid #222", borderRadius: 8,
        color: "#444", cursor: "pointer", fontSize: 14, lineHeight: 1
      }}>⋯</button>
      {showActions && (
        <div style={{
          position: "absolute", right: 0, top: "100%", background: "#1e1e2e", border: "1px solid #333",
          borderRadius: 10, padding: 6, zIndex: 50, display: "flex", flexDirection: "column", gap: 4, minWidth: 110, marginTop: 4
        }}>
          <button onClick={() => { onEdit(task); setShowActions(false); }} style={{
            background: "none", border: "none", color: "#aaa", cursor: "pointer",
            padding: "7px 12px", textAlign: "left", fontSize: 12, borderRadius: 6
          }}>✏️ Edit</button>
          <button onClick={() => { onDelete(task.id); setShowActions(false); }} style={{
            background: "none", border: "none", color: "#FF6D6D", cursor: "pointer",
            padding: "7px 12px", textAlign: "left", fontSize: 12, borderRadius: 6
          }}>🗑 Remove</button>
        </div>
      )}
    </div>
  );
}

function BoyCard({ boy, points, log, tasks, onAward, onDeduct, onTaskAdd, onTaskEdit, onTaskDelete, onManualAdjust }) {
  const [tab, setTab] = useState("earn");
  const [modal, setModal] = useState(null);
  const [manualPts, setManualPts] = useState(1);
  const [editingTask, setEditingTask] = useState(null);

  const reward = getReward(points);
  const next = getNextReward(points);
  const progress = next ? Math.min(100, (points / next.pts) * 100) : 100;

  const earnTasks = tasks.earn || [];
  const loseTasks = tasks.lose || [];
  const calebTasks = tasks.caleb || [];

  return (
    <div style={{
      background: "linear-gradient(160deg, #111 0%, #1a1a2e 100%)",
      border: `1px solid ${boy.color}33`, borderRadius: 18, padding: "22px 20px 18px",
      boxShadow: `0 0 30px ${boy.color}15`,
      display: "flex", flexDirection: "column", gap: 14, position: "relative", overflow: "visible"
    }}>
      <div style={{
        position: "absolute", top: -30, right: -30, width: 120, height: 120,
        borderRadius: "50%", background: boy.color, opacity: 0.07, filter: "blur(30px)", pointerEvents: "none"
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: boy.color, fontWeight: 700, textTransform: "uppercase" }}>Elite Boys Reward</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: -1, marginTop: 2 }}>{boy.name}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 38, fontWeight: 900, color: boy.color, lineHeight: 1 }}>{points}</div>
          <div style={{ fontSize: 11, color: "#666", letterSpacing: 1 }}>POINTS</div>
        </div>
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "#111", border: "1px solid #222", borderRadius: 10, padding: "8px 12px"
      }}>
        <span style={{ fontSize: 11, color: "#555", flex: 1, letterSpacing: 1 }}>MANUAL ADJUST</span>
        <button onClick={() => setManualPts(p => Math.max(1, p - 1))} style={{
          width: 28, height: 28, borderRadius: 6, border: "1px solid #333", background: "#1a1a1a",
          color: "#aaa", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center"
        }}>−</button>
        <span style={{ fontSize: 16, fontWeight: 800, color: "#fff", minWidth: 24, textAlign: "center" }}>{manualPts}</span>
        <button onClick={() => setManualPts(p => p + 1)} style={{
          width: 28, height: 28, borderRadius: 6, border: "1px solid #333", background: "#1a1a1a",
          color: "#aaa", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center"
        }}>+</button>
        <button onClick={() => onManualAdjust(manualPts, true)} style={{
          padding: "6px 12px", borderRadius: 7, border: "none", background: "#00C98030",
          color: "#00E676", fontWeight: 700, cursor: "pointer", fontSize: 12
        }}>+Add</button>
        <button onClick={() => onManualAdjust(manualPts, false)} style={{
          padding: "6px 12px", borderRadius: 7, border: "none", background: "#FF505030",
          color: "#FF7070", fontWeight: 700, cursor: "pointer", fontSize: 12
        }}>−Sub</button>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 11, color: "#888" }}>
          <span>{reward ? `🏆 ${reward.icon} ${reward.label}` : "Keep earning!"}</span>
          {next && <span>{next.pts - points} pts to next</span>}
        </div>
        <div style={{ background: "#222", borderRadius: 99, height: 6, overflow: "hidden" }}>
          <div style={{
            width: `${progress}%`, height: "100%",
            background: `linear-gradient(90deg, ${boy.accent}, ${boy.color})`,
            borderRadius: 99, transition: "width 0.5s cubic-bezier(.4,0,.2,1)"
          }} />
        </div>
        {next && <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>Next: {next.icon} {next.label}</div>}
        {!next && points >= 200 && (
          <div style={{ fontSize: 12, color: "#FFD700", marginTop: 4, fontWeight: 700 }}>
            🏅 Maximum reward unlocked! Weekend Away!
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        {["earn", "lose", "log"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer",
            fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase",
            background: tab === t ? boy.color : "#1e1e1e",
            color: tab === t ? "#000" : "#555", transition: "all 0.2s"
          }}>
            {t === "earn" ? "Earn" : t === "lose" ? "Lose" : "Log"}
          </button>
        ))}
      </div>

      {tab === "earn" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {earnTasks.map(task => (
            <TaskRow key={task.id} task={task} color={boy.color} type="earn"
              onAction={onAward}
              onEdit={t => { setEditingTask(t); setModal({ type: "earn" }); }}
              onDelete={id => onTaskDelete("earn", id)}
            />
          ))}
          {boy.id === "caleb" && calebTasks.length > 0 && (
            <>
              <div style={{ fontSize: 10, color: "#E53935", letterSpacing: 2, margin: "4px 0 2px" }}>CALEB ONLY</div>
              {calebTasks.map(task => (
                <TaskRow key={task.id} task={task} color={boy.color} type="earn"
                  onAction={onAward}
                  onEdit={t => { setEditingTask(t); setModal({ type: "caleb" }); }}
                  onDelete={id => onTaskDelete("caleb", id)}
                />
              ))}
              <button onClick={() => { setEditingTask(null); setModal({ type: "caleb" }); }} style={{
                marginTop: 2, background: "none", border: "1px dashed #E5393555",
                borderRadius: 8, padding: "8px", color: "#E53935", fontSize: 12, cursor: "pointer"
              }}>+ Add Caleb Task</button>
            </>
          )}
          <button onClick={() => { setEditingTask(null); setModal({ type: "earn" }); }} style={{
            marginTop: 2, background: "none", border: `1px dashed ${boy.color}55`,
            borderRadius: 8, padding: "8px", color: boy.color, fontSize: 12, cursor: "pointer"
          }}>+ Add Earn Task</button>
        </div>
      )}

      {tab === "lose" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {loseTasks.map(task => (
            <TaskRow key={task.id} task={task} color={boy.color} type="lose"
              onAction={(label, pts) => onDeduct(label, pts)}
              onEdit={t => { setEditingTask(t); setModal({ type: "lose" }); }}
              onDelete={id => onTaskDelete("lose", id)}
            />
          ))}
          <button onClick={() => { setEditingTask(null); setModal({ type: "lose" }); }} style={{
            marginTop: 2, background: "none", border: "1px dashed #FF505055",
            borderRadius: 8, padding: "8px", color: "#FF7070", fontSize: 12, cursor: "pointer"
          }}>+ Add Lose Task</button>
        </div>
      )}

      {tab === "log" && <PointLog log={log} />}

      {modal && (
        <TaskModal
          task={editingTask}
          type={modal.type}
          onClose={() => { setModal(null); setEditingTask(null); }}
          onSave={({ label, pts }) => {
            if (editingTask) {
              onTaskEdit(modal.type, { ...editingTask, label, pts });
            } else {
              onTaskAdd(modal.type, { label, pts });
            }
            setModal(null);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}

const storageGet = (key, fallback) => {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
};
const storageSet = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

export default function Tracker({ user, syncEnabled }) {
  const [points, setPoints] = useState(() => storageGet("eb_points", { eli: 0, zachary: 0, caleb: 0 }));
  const [logs, setLogs] = useState(() => storageGet("eb_logs", { eli: [], zachary: [], caleb: [] }));
  const [tasks, setTasks] = useState(() => storageGet("eb_tasks", DEFAULT_TASKS));
  const [toast, setToast] = useState(null);
  const [resetConfirm, setResetConfirm] = useState(false);

  useEffect(() => storageSet("eb_points", points), [points]);
  useEffect(() => storageSet("eb_logs", logs), [logs]);
  useEffect(() => storageSet("eb_tasks", tasks), [tasks]);

  const showToast = (msg, type = "earn") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const award = (boyId, reason, pts) => {
    setPoints(p => ({ ...p, [boyId]: p[boyId] + pts }));
    setLogs(l => ({ ...l, [boyId]: [...l[boyId], { reason, pts, time: Date.now() }] }));
    showToast(`+${pts} pt${pts > 1 ? "s" : ""} for ${BOYS.find(b => b.id === boyId).name}!`, "earn");
  };

  const deduct = (boyId, reason, pts) => {
    setPoints(p => ({ ...p, [boyId]: Math.max(0, p[boyId] - pts) }));
    setLogs(l => ({ ...l, [boyId]: [...l[boyId], { reason, pts: -pts, time: Date.now() }] }));
    showToast(`−${pts} pt${pts > 1 ? "s" : ""} from ${BOYS.find(b => b.id === boyId).name}`, "lose");
  };

  const manualAdjust = (boyId, pts, isAdd) => {
    const reason = `Manual ${isAdd ? "addition" : "deduction"} (${pts} pt${pts > 1 ? "s" : ""})`;
    if (isAdd) award(boyId, reason, pts);
    else deduct(boyId, reason, pts);
  };

  const addTask = (type, task) => {
    const id = type[0] + Date.now();
    setTasks(t => ({ ...t, [type]: [...(t[type] || []), { ...task, id }] }));
  };

  const editTask = (type, updated) => {
    setTasks(t => ({ ...t, [type]: t[type].map(tk => tk.id === updated.id ? updated : tk) }));
  };

  const deleteTask = (type, id) => {
    setTasks(t => ({ ...t, [type]: t[type].filter(tk => tk.id !== id) }));
  };

  const resetAll = () => {
    setPoints({ eli: 0, zachary: 0, caleb: 0 });
    setLogs({ eli: [], zachary: [], caleb: [] });
    setResetConfirm(false);
    showToast("Points reset for new quarter", "neutral");
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0f",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      padding: "24px 16px 40px", color: "#fff"
    }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: 5, color: "#444", textTransform: "uppercase", marginBottom: 6 }}>
          Family Rewards System
        </div>
        <h1 style={{
          fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: -1.5,
          background: "linear-gradient(135deg, #00C9FF, #00E676, #FF6D6D)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>Elite Boys</h1>
        <div style={{ fontSize: 12, color: "#444", marginTop: 4 }}>
          Points reset every 3 months · {syncEnabled ? "✓ Cloud synced" : "Local only"}
        </div>
        <div style={{
          display: "inline-flex", gap: 0, background: "#111", borderRadius: 99,
          border: "1px solid #222", marginTop: 14, overflow: "hidden"
        }}>
          {BOYS.map((b, i) => (
            <div key={b.id} style={{
              padding: "8px 20px", borderRight: i < 2 ? "1px solid #222" : "none", textAlign: "center"
            }}>
              <div style={{ fontSize: 10, color: b.color, letterSpacing: 2, textTransform: "uppercase" }}>{b.name}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{points[b.id]}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: "14px 16px", marginBottom: 24 }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: "#555", marginBottom: 10, textTransform: "uppercase" }}>Reward Tiers</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {REWARDS.map(r => (
            <div key={r.pts} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                fontSize: 11, fontWeight: 800, color: "#FFD700", minWidth: 36,
                background: "#FFD70015", borderRadius: 6, padding: "3px 6px", textAlign: "center"
              }}>{r.pts}</div>
              <span style={{ fontSize: 11, color: "#888" }}>{r.icon} {r.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {BOYS.map(boy => (
          <BoyCard
            key={boy.id}
            boy={boy}
            points={points[boy.id]}
            log={logs[boy.id]}
            tasks={tasks}
            onAward={(reason, pts) => award(boy.id, reason, pts)}
            onDeduct={(reason, pts) => deduct(boy.id, reason, pts)}
            onManualAdjust={(pts, isAdd) => manualAdjust(boy.id, pts, isAdd)}
            onTaskAdd={addTask}
            onTaskEdit={editTask}
            onTaskDelete={deleteTask}
          />
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 28 }}>
        {!resetConfirm ? (
          <button onClick={() => setResetConfirm(true)} style={{
            background: "none", border: "1px solid #333", color: "#555",
            borderRadius: 99, padding: "8px 22px", fontSize: 12, cursor: "pointer", letterSpacing: 1
          }}>Reset All Points (Quarterly)</button>
        ) : (
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button onClick={resetAll} style={{
              background: "#FF4444", border: "none", color: "#fff",
              borderRadius: 99, padding: "8px 22px", fontSize: 12, cursor: "pointer", fontWeight: 700
            }}>Confirm Reset</button>
            <button onClick={() => setResetConfirm(false)} style={{
              background: "#222", border: "none", color: "#aaa",
              borderRadius: 99, padding: "8px 22px", fontSize: 12, cursor: "pointer"
            }}>Cancel</button>
          </div>
        )}
      </div>

      {toast && (
        <div style={{
          position: "fixed", bottom: 30, left: "50%", transform: "translateX(-50%)",
          background: toast.type === "earn" ? "#00C98099" : toast.type === "lose" ? "#FF444499" : "#33333399",
          backdropFilter: "blur(10px)", borderRadius: 99, padding: "12px 28px",
          fontSize: 14, fontWeight: 700, color: "#fff", boxShadow: "0 8px 32px #000a",
          whiteSpace: "nowrap", zIndex: 100, animation: "fadeUp 0.3s ease"
        }}>{toast.msg}</div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        button { transition: all 0.15s; }
        button:active { transform: scale(0.97); }
        input:focus { border-color: #555 !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 99px; }
      `}</style>
    </div>
  );
}
