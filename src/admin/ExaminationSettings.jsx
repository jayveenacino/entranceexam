import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ExaminationSettings() {
    const API_URL = import.meta.env.VITE_API_URL;

    const [enabled, setEnabled] = useState(false);
    const [minutes, setMinutes] = useState(60);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/api/exam/timer-settings`)
            .then(res => res.json())
            .then(data => {
                setEnabled(data.enabled);
                setMinutes(data.duration / 60);
            })
            .catch(() => { });
    }, [API_URL]);

    async function saveSettings() {
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/exam/timer-settings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    enabled,
                    duration: enabled ? minutes * 60 : 0
                })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                Swal.fire("Error", "Failed to save settings", "error");
                return;
            }

            Swal.fire({
                icon: "success",
                title: "Saved Successfully",
                text: "Timer settings have been updated.",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });

        } catch {
            Swal.fire("Error", "Network error", "error");
        } finally {
            setLoading(false);
        }
    }


    return (
        <div style={{ maxWidth: "500px" }}>
            <h1>Examination Settings</h1>

            <div style={{ marginTop: "20px" }}>
                <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                        type="checkbox"
                        checked={enabled}
                        onChange={() => setEnabled(!enabled)}
                    />
                    Enable Exam Timer
                </label>
            </div>

            {enabled && (
                <div style={{ marginTop: "15px" }}>
                    <label>Timer Duration (minutes)</label>
                    <input
                        type="number"
                        min="1"
                        value={minutes}
                        onChange={e => setMinutes(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px"
                        }}
                    />
                </div>
            )}

            <button
                onClick={saveSettings}
                disabled={loading}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    background: "#0a6a25",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}
            >
                {loading ? "Saving..." : "Save Settings"}
            </button>
        </div>
    );
}
