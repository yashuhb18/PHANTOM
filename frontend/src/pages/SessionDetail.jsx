import React, { useState, useEffect } from 'react';
import { DeviceInfo } from '../components/session/DeviceInfo';
import { Timeline } from '../components/session/Timeline';
import { AttackGraph } from '../components/session/AttackGraph';
import { ReplayScrubber } from '../components/session/ReplayScrubber';
import { LoadingState } from '../components/common/LoadingState';

export function SessionDetail({ sessionId = 'sess_demo_stage1_ducky' }) {
  const [session, setSession] = useState(null);
  const [graph, setGraph] = useState(null);
  const [replay, setReplay] = useState(null);
  const [activeFrame, setActiveFrame] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [sessRes, graphRes, replayRes] = await Promise.all([
          fetch(`http://${window.location.hostname}:8001/api/sessions/${sessionId}`),
          fetch(`http://${window.location.hostname}:8001/api/sessions/${sessionId}/graph`),
          fetch(`http://${window.location.hostname}:8001/api/sessions/${sessionId}/replay`),
        ]);

        if (sessRes.ok) setSession(await sessRes.json());
        if (graphRes.ok) setGraph(await graphRes.json());
        if (replayRes.ok) {
          const repData = await replayRes.json();
          setReplay(repData);
          setActiveFrame(repData.total_frames ? repData.total_frames - 1 : 0);
        }
      } catch (err) {
        console.error("Error loading session data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [sessionId]);

  if (loading) return <LoadingState message="Reconstructing attack graph and timeline..." />;

  const totalFrames = replay?.total_frames || 6;
  const currentTimelineEvents = replay?.timeline?.slice(0, activeFrame + 1) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hardware Device Metadata Card */}
      <DeviceInfo session={session} />

      {/* Time-Travel Audio Scrubber */}
      <ReplayScrubber
        totalFrames={totalFrames}
        currentFrame={activeFrame}
        onChangeFrame={setActiveFrame}
      />

      {/* Attack Graph (NetworkX) */}
      <AttackGraph graph={graph} activeFrame={activeFrame} />

      {/* Chronological Event Sequence */}
      <Timeline events={currentTimelineEvents} activeIndex={activeFrame} />
    </div>
  );
}
