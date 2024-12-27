import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function getLastPushInfo() {
  try {
    const { stdout } = await execAsync('git log -1 --format="%h - %an, %ar : %s"');
    return stdout.trim();
  } catch (error) {
    console.error('Error getting git info:', error);
    return null;
  }
}

export async function getGitStatus() {
  try {
    const { stdout: status } = await execAsync('git status --porcelain');
    const { stdout: branch } = await execAsync('git rev-parse --abbrev-ref HEAD');
    
    return {
      branch: branch.trim(),
      hasUncommittedChanges: status.length > 0,
      uncommittedFiles: status.split('\n').filter(Boolean).map(line => line.slice(3))
    };
  } catch (error) {
    console.error('Error getting git status:', error);
    return null;
  }
} 