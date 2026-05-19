# gen-repo-v

从目标项目的 Git 仓库读取远程地址、分支、commit 等信息，并附带当前时间，生成 `version.json`。

## 使用

在项目根目录执行（写入 `./version.json`）：

```bash
npx -y gen-repo-v
```

构建产物目录（与历史 `version.mjs` 行为一致，目录存在才写入）：

```bash
npx -y gen-repo-v --dist dist/standard
```

指定输出路径：

```bash
npx -y gen-repo-v --out dist/app/version.json
```

在 `package.json` 的构建脚本中：

```json
{
  "scripts": {
    "build": "vite build && npx -y gen-repo-v --dist dist"
  }
}
```

## 输出示例

```json
{
  "node": "v20.11.0",
  "repository": "https://github.com/org/repo.git",
  "branch": "main",
  "version": "ce55420",
  "env": "production",
  "time": "2026/5/19 18:30:00"
}
```

字段说明：

| 字段         | 说明                                 |
| ------------ | ------------------------------------ |
| `repository` | `git remote get-url origin` 完整地址 |
| `version`    | 当前短 commit hash                   |
| `time`       | 生成文件时的本地时间                 |
