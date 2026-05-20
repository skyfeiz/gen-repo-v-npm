# gen-repo-v

从目标项目的 Git 仓库读取远程地址、分支、commit 等信息，并附带当前时间，生成 `version.json`。

## 使用

在项目根目录执行（写入 `./version.json`）：

```bash
npx -y gen-repo-v
```

构建产物目录（目录存在才写入）：

```bash
npx -y gen-repo-v --dist dist/app
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

| 字段         | 说明                                     |
| ------------ | ---------------------------------------- |
| `node`       | 当前 Node.js 版本                        |
| `repository` | `git remote get-url origin` 完整地址     |
| `branch`     | 当前分支名称                             |
| `version`    | 当前短 commit hash                       |
| `env`        | 当前环境，如 `production`、`development` |
| `time`       | 生成文件时的本地时间                     |
