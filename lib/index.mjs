import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

function runGit(command, cwd) {
  try {
    return execSync(`git ${command}`, {
      cwd,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();
  } catch {
    return '';
  }
}

export function collectVersionInfo(cwd = process.cwd()) {
  const repository = runGit('remote get-url origin', cwd);
  const branch = runGit('rev-parse --abbrev-ref HEAD', cwd) || runGit('name-rev --name-only HEAD', cwd);
  const shortHash = runGit('rev-parse --short HEAD', cwd);

  let node = '';
  try {
    node = execSync('node -v', { encoding: 'utf8' }).trim();
  } catch {
    node = process.version;
  }

  const env = process.env.NODE_ENV;
  const time = new Date().toLocaleString('zh-CN', { hour12: false });

  const info = {
    node,
    repository,
    branch,
    version: shortHash,
    time
  };

  if (env) info.env = env;

  return info;
}

export function writeVersionJson(filePath, info) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(info, null, 2)}\n`, 'utf8');
}
