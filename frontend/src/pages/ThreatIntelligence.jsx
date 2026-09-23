import React, { useState, useEffect } from 'react';
import { FingerprintList } from '../components/intelligence/FingerprintList';
import { SimilarityGraph } from '../components/intelligence/SimilarityGraph';
import { SimulateButton } from '../components/common/SimulateButton';
import { LoadingState } from '../components/common/LoadingState';
import { Dna } from 'lucide-react';

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
      <div className="bg-[#141414] border border-white/[0.08] rounded-[28px] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-white/[0.08] flex items-center justify-center text-[#FDE047] shrink-0">
            <Dna className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight uppercase">Attack DNA Fingerprint Engine</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Cross-hardware behavioral similarity engine. Correlates identical threat actors even when physical USB devices are swapped.
            </p>
          </div>
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
