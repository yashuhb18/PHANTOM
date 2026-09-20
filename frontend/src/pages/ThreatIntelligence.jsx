import React, { useState, useEffect } from 'react';
import { FingerprintList } from '../components/intelligence/FingerprintList';
import { SimilarityGraph } from '../components/intelligence/SimilarityGraph';
import { SimulateButton } from '../components/common/SimulateButton';
import { LoadingState } from '../components/common/LoadingState';

export function ThreatIntelligence() {
  const [fingerprints, setFingerprints] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [selectedFp, setSelectedFp] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await fetch(`http://${window.location.hostname}:8001/api/fingerprints`);
      if (res.ok) {
        const data = await res.json();
        setFingerprints(data);
        if (data.length >= 2) {
          // Compare first two by default
          const compRes = await fetch(
            `http://${window.location.hostname}:8001/api/fingerprints/compare?source=${data[0].session_id}&target=${data[1].session_id}`
          );
          if (compRes.ok) setComparison(await compRes.json());
        }
      }
    } catch (e) {
      console.error("Error fetching fingerprints:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <LoadingState message="Querying Attack DNA database..." />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-[#1C1917]">Attack DNA Fingerprint Engine</h2>
          <p className="text-xs text-[#78716C] mt-0.5">
            Cross-hardware behavioral similarity engine. Detects identical threat actors even when they change physical USB hardware.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SimulateButton stage={2} onComplete={() => loadData()} />
        </div>
      </div>

      {/* 2-Column Grid: Fingerprint Catalog & Jaccard Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FingerprintList
          fingerprints={fingerprints}
          selectedId={selectedFp?.session_id}
          onSelect={(fp) => {
            setSelectedFp(fp);
            if (fingerprints.length >= 2) {
              const other = fingerprints.find(f => f.session_id !== fp.session_id) || fingerprints[0];
              fetch(`http://${window.location.hostname}:8001/api/fingerprints/compare?source=${fp.session_id}&target=${other.session_id}`)
                .then(r => r.json())
                .then(setComparison)
                .catch(console.error);
            }
          }}
        />
        <SimilarityGraph comparison={comparison} />
      </div>
    </div>
  );
}
