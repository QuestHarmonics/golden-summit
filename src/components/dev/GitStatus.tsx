import React, { useEffect, useState } from 'react';
import { getLastPushInfo, getGitStatus } from '../../utils/gitStatus';

export function GitStatus() {
  const [lastPush, setLastPush] = useState<string | null>(null);
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    async function fetchGitInfo() {
      const pushInfo = await getLastPushInfo();
      const statusInfo = await getGitStatus();
      setLastPush(pushInfo);
      setStatus(statusInfo);
    }

    fetchGitInfo();
  }, []);

  if (!lastPush || !status) return null;

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg">
      <h3 className="font-pixel text-lg mb-2">Git Status</h3>
      <div className="space-y-2 text-sm">
        <p>Last Push: {lastPush}</p>
        <p>Current Branch: {status.branch}</p>
        {status.hasUncommittedChanges && (
          <div>
            <p className="text-yellow-400">Uncommitted Changes:</p>
            <ul className="list-disc list-inside">
              {status.uncommittedFiles.map((file: string) => (
                <li key={file} className="text-gray-300">{file}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 