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

function parseRemoteName(repositoryUrl) {
  if (!repositoryUrl) return '';
  let segment = repositoryUrl;
  if (segment.includes(':')) segment = segment.split(':').pop() ?? segment;
  segment = segment.split('/').pop() ?? segment;
  if (!segment) return '';
  return segment.endsWith('.git') ? segment : `${segment}.git`;
}

function readPackageName(cwd) {
  try {
    const pkgPath = path.join(cwd, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return pkg.name ?? '';
  } catch {
    return '';
  }
}

export function collectVersionInfo(cwd = process.cwd()) {
  const repository = runGit('remote get-url origin', cwd);
  const branch = runGit('rev-parse --abbrev-ref HEAD', cwd) || runGit('name-rev --name-only HEAD', cwd);
  const shortHash = runGit('rev-parse --short HEAD', cwd);
  const fullHash = runGit('rev-parse HEAD', cwd);
  const authorName = runGit('log -1 --pretty=%an', cwd);
  const authorEmail = runGit('log -1 --pretty=%ae', cwd);
  const author = authorName ? `${authorName} <${authorEmail}>` : '';
  const committedAt = runGit('log -1 --pretty=%cI', cwd);

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
    remote: parseRemoteName(repository),
    branch,
    version: shortHash,
    commit: {
      hash: fullHash,
      shortHash,
      author,
      committedAt
    },
    time
  };

  const name = readPackageName(cwd);
  if (name) info.name = name;
  if (env) info.env = env;

  return info;
}

export function writeVersionJson(filePath, info) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(info, null, 2)}\n`, 'utf8');
}
