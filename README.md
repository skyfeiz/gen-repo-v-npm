# gen-repo-v

从目标项目的 Git 仓库读取远程地址、分支、commit 等信息，并附带当前时间，生成 `version.json`。

## 使用

在项目根目录执行（写入 `./version.json`）：

```bash
npx gen-repo-v
```

构建产物目录（与历史 `version.mjs` 行为一致，目录存在才写入）：

```bash
npx gen-repo-v --dist dist/standard
```

指定输出路径：

```bash
npx gen-repo-v --out dist/app/version.json
```

在 `package.json` 的构建脚本中：

```json
{
  "scripts": {
    "build": "vite build && npx gen-repo-v --dist dist"
  }
}
```

## 输出示例

```json
{
  "node": "v20.11.0",
  "repository": "https://github.com/org/repo.git",
  "remote": "repo.git",
  "branch": "main",
  "version": "ce55420",
  "commit": {
    "hash": "ce55420a1b2c3d4e5f6789012345678901234567",
    "shortHash": "ce55420",
    "message": "feat: add dashboard",
    "author": "name <email@example.com>",
    "committedAt": "2026-05-19T10:00:00+08:00"
  },
  "name": "my-app",
  "env": "production",
  "time": "2026/5/19 18:30:00"
}
```

字段说明：

| 字段         | 说明                                   |
| ------------ | -------------------------------------- |
| `repository` | `git remote get-url origin` 完整地址   |
| `remote`     | 仓库名（兼容旧版 `standard.git` 形式） |
| `version`    | 当前短 commit hash                     |
| `commit`     | 完整 hash、提交说明、作者、提交时间    |
| `time`       | 生成文件时的本地时间                   |

## 发布到 npm

在 GitHub 仓库 **Settings → Secrets and variables → Actions** 中配置 `NPM_TOKEN`（npm 账号的 [Access Token](https://www.npmjs.com/settings/~your-account/tokens)，需具备 **Automation** 或 **Publish** 权限）。

发布流程：

1. 将 `package.json` 中的 `version` 更新为目标版本（如 `0.1.2`）
2. 提交并推送，打标签并推送：`git tag v0.1.2 && git push origin v0.1.2`  
   或在 GitHub 上创建 **Release**（标签名需为 `v` + 版本号，如 `v0.1.2`）
3. 推送 `v*` 标签或发布 Release 后，GitHub Actions 会自动执行 `npm publish`

标签版本（去掉前缀 `v`）必须与 `package.json` 中的 `version` 一致，否则工作流会失败。
