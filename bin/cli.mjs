#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { collectVersionInfo, writeVersionJson } from '../lib/index.mjs';

function printHelp() {
  console.log(`
用法: npx @ft/gen-repo-v [选项]

从当前目录的 Git 仓库读取远程地址、分支、commit 等信息，生成 version.json。

选项:
  -c, --cwd <dir>       目标项目目录（默认: 当前目录）
  -o, --out <file>      输出文件路径（默认: <cwd>/version.json）
  -d, --dist <dir>      输出到目录下的 version.json（仅当目录存在时写入）
  -h, --help            显示帮助
`);
}

function parseArgs(argv) {
  const options = {
    cwd: process.cwd(),
    out: null,
    dist: null,
    help: false
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '-h' || arg === '--help') {
      options.help = true;
      continue;
    }
    if (arg === '-c' || arg === '--cwd') {
      options.cwd = path.resolve(argv[++i] ?? '');
      continue;
    }
    if (arg === '-o' || arg === '--out') {
      options.out = path.resolve(options.cwd, argv[++i] ?? '');
      continue;
    }
    if (arg === '-d' || arg === '--dist') {
      options.dist = path.resolve(options.cwd, argv[++i] ?? '');
      continue;
    }
    console.error(`未知参数: ${arg}`);
    options.help = true;
  }

  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  const info = collectVersionInfo(options.cwd);
  const json = JSON.stringify(info, null, 2);
  console.log(json);

  if (options.dist) {
    if (!fs.existsSync(options.dist)) {
      console.warn(`[gen-repo-v] 跳过写入: 目录不存在 ${options.dist}`);
      return;
    }
    const target = path.join(options.dist, 'version.json');
    writeVersionJson(target, info);
    console.log(`[gen-repo-v] 已写入 ${target}`);
    return;
  }

  const target = options.out ?? path.join(options.cwd, 'version.json');
  writeVersionJson(target, info);
  console.log(`[gen-repo-v] 已写入 ${target}`);
}

main().catch(err => {
  console.error('[gen-repo-v]', err.message);
  process.exit(1);
});
