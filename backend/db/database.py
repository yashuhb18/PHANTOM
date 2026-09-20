import sqlite3
import json
import os
from pathlib import Path
from datetime import datetime

DB_PATH = Path(__file__).parent.parent / "phantom.db"

def get_connection():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.executescript("""
    CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        device_vid TEXT,
        device_pid TEXT,
        device_serial TEXT,
        device_name TEXT,
        inserted_at TEXT,
        removed_at TEXT,
        status TEXT,
        risk_score INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        session_id TEXT,
        event_type TEXT,
        timestamp TEXT,
        source TEXT,
        details TEXT,
        risk_weight REAL,
        raw_payload TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(id)
    );

    CREATE TABLE IF NOT EXISTS attack_chains (
        session_id TEXT PRIMARY KEY,
        graph_json TEXT,
        nodes_json TEXT,
        edges_json TEXT,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(id)
    );

    CREATE TABLE IF NOT EXISTS fingerprints (
        id TEXT PRIMARY KEY,
        session_id TEXT,
        signature_hash TEXT,
        event_types TEXT,
        touched_paths TEXT,
        process_tree TEXT,
        vector_json TEXT,
        similarity_score REAL DEFAULT 0.0,
        matched_session_id TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(id)
    );

    CREATE TABLE IF NOT EXISTS canary_traps (
        id TEXT PRIMARY KEY,
        name TEXT,
        type TEXT,
        file_path TEXT,
        status TEXT,
        created_at TEXT,
        last_checked TEXT,
        trip_count INTEGER DEFAULT 0,
        tags TEXT
    );

    CREATE TABLE IF NOT EXISTS canary_hits (
        id TEXT PRIMARY KEY,
        trap_id TEXT,
        session_id TEXT,
        timestamp TEXT,
        process_name TEXT,
        process_pid INTEGER,
        details TEXT,
        FOREIGN KEY (trap_id) REFERENCES canary_traps(id),
        FOREIGN KEY (session_id) REFERENCES sessions(id)
    );

    CREATE TABLE IF NOT EXISTS alerts (
        id TEXT PRIMARY KEY,
        session_id TEXT,
        severity TEXT,
        timestamp TEXT,
        host TEXT,
        vector TEXT,
        detection_engine TEXT,
        mitigation_status TEXT,
        score INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS devices (
        id TEXT PRIMARY KEY,
        vid TEXT,
        pid TEXT,
        serial TEXT,
        name TEXT,
        trust_status TEXT,
        last_seen TEXT,
        session_count INTEGER DEFAULT 1
    );
    """)

    conn.commit()

    # Seed initial Canary Traps if empty
    cursor.execute("SELECT COUNT(*) FROM canary_traps")
    if cursor.fetchone()[0] == 0:
        traps_dir = Path(__file__).parent.parent / "decoy_files"
        traps_dir.mkdir(exist_ok=True)

        canary_seeds = [
            ('TRAP-01', 'PASSWORDS_2026_XLSX', 'Honeytoken File', str(traps_dir / 'passwords_2026.xlsx'), 'nominal', datetime.utcnow().isoformat(), 'Just now', 0, '["Finance", "Office"]'),
            ('TRAP-02', 'AWS_ROOT_KEY_CANARY', 'AWS Secret', str(traps_dir / '.aws_creds_canary'), 'nominal', datetime.utcnow().isoformat(), 'Just now', 0, '["Kubernetes", "IAM"]'),
            ('TRAP-03', 'ID_RSA_BACKUP_DECOY', 'Canary File', str(traps_dir / 'id_rsa_backup'), 'nominal', datetime.utcnow().isoformat(), 'Just now', 0, '["SSH", "Bastion"]'),
            ('TRAP-04', 'PROD_DB_ENV_CANARY', 'Honeytoken', str(traps_dir / '.env.production'), 'nominal', datetime.utcnow().isoformat(), 'Just now', 0, '["Database", "Secrets"]')
        ]

        cursor.executemany("""
        INSERT INTO canary_traps (id, name, type, file_path, status, created_at, last_checked, trip_count, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, canary_seeds)

        # Create physical decoy files on disk
        for _, _, _, path, _, _, _, _, _ in canary_seeds:
            p = Path(path)
            if not p.exists():
                p.write_text(f"# PHANTOM SYNTHETIC DECOY ARTIFACT\n# TOKEN_UUID: {os.urandom(8).hex()}\nAWS_ACCESS_KEY_ID=AKIA_CANARY_{os.urandom(4).hex().upper()}\nAWS_SECRET_ACCESS_KEY={os.urandom(16).hex()}\n")

    # Seed known Device records if empty
    cursor.execute("SELECT COUNT(*) FROM devices")
    if cursor.fetchone()[0] == 0:
        device_seeds = [
            ('DEV-01', '0x0483', '0x5740', 'SN-DUCKY-8841', 'RubberDucky HID Injector', 'untrusted', datetime.utcnow().isoformat(), 3),
            ('DEV-02', '0x0951', '0x1666', 'SN-BUNNY-9012', 'BashBunny Multi-Payload', 'untrusted', datetime.utcnow().isoformat(), 1),
            ('DEV-03', '0x0781', '0x5581', 'SN-SANDISK-0014', 'SanDisk Ultra Flair 64GB', 'trusted', datetime.utcnow().isoformat(), 18)
        ]
        cursor.executemany("""
        INSERT INTO devices (id, vid, pid, serial, name, trust_status, last_seen, session_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, device_seeds)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully at", DB_PATH)
