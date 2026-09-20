const API_BASE = 'http://localhost:8001/api';

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  return res.json();
}

export async function fetchSessions() {
  const res = await fetch(`${API_BASE}/sessions`);
  return res.json();
}

export async function fetchSession(id: string) {
  const res = await fetch(`${API_BASE}/sessions/${id}`);
  return res.json();
}

export async function fetchSessionGraph(id: string) {
  const res = await fetch(`${API_BASE}/sessions/${id}/graph`);
  return res.json();
}

export async function fetchSessionTimeline(id: string) {
  const res = await fetch(`${API_BASE}/sessions/${id}/timeline`);
  return res.json();
}

export async function fetchSessionReplay(id: string, step: number = 1) {
  const res = await fetch(`${API_BASE}/sessions/${id}/replay?step=${step}`);
  return res.json();
}

export async function fetchEvents(limit: number = 50) {
  const res = await fetch(`${API_BASE}/events?limit=${limit}`);
  return res.json();
}

export async function fetchFingerprints() {
  const res = await fetch(`${API_BASE}/fingerprints`);
  return res.json();
}

export async function fetchCanaryTraps() {
  const res = await fetch(`${API_BASE}/canary/traps`);
  return res.json();
}

export async function deployCanaryTrap(name: string, type: string, location: string) {
  const res = await fetch(`${API_BASE}/canary/deploy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, type, location })
  });
  return res.json();
}

export async function fetchAlerts() {
  const res = await fetch(`${API_BASE}/alerts`);
  return res.json();
}

export async function containAlert(id: string) {
  const res = await fetch(`${API_BASE}/alerts/${id}/contain`, {
    method: 'POST'
  });
  return res.json();
}

export async function fetchDevices() {
  const res = await fetch(`${API_BASE}/devices`);
  return res.json();
}

export async function fetchIncidentReport(sessionId: string) {
  const res = await fetch(`${API_BASE}/incident-reports/${sessionId}`);
  return res.json();
}

export async function simulateAttack1() {
  const res = await fetch(`${API_BASE}/simulate/attack-1`, {
    method: 'POST'
  });
  return res.json();
}

export async function simulateAttack2() {
  const res = await fetch(`${API_BASE}/simulate/attack-2`, {
    method: 'POST'
  });
  return res.json();
}
