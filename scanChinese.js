const fs = require('fs')
const path = require('path')

// 匹配中文字符
const chineseReg = /[\u4e00-\u9fa5]/

// 匹配各种注释
const commentPatterns = [
  /\/\*[\s\S]*?\*\//g, // 多行注释 /* ... */
  /\/\/.*/g, // 单行注释 //
  /<!--[\s\S]*?-->/g, // HTML/Vue 注释 <!-- ... -->
]

// 匹配 console.log("xxx") 中的内容
const consolePattern = /console\.(log|info|warn|error)\s*\([\s\S]*?\)/g

// 需要扫描的文件类型
const exts = ['.vue', '.js', '.ts', '.json', '.css', '.scss']

// 忽略的目录
const ignoreDirs = ['node_modules', 'dist', '.git', 'build', 'public']

function removeCommentsAndConsole(content) {
  let cleaned = content

  // 移除注释
  commentPatterns.forEach((reg) => {
    cleaned = cleaned.replace(reg, '')
  })

  // 移除 console.log 内容
  cleaned = cleaned.replace(consolePattern, '')

  return cleaned
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const cleaned = removeCommentsAndConsole(content)

  if (chineseReg.test(cleaned)) {
    console.log('发现中文：', filePath)
  }
}

function scanDir(dir) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    // 跳过忽略目录
    if (stat.isDirectory() && ignoreDirs.includes(file)) {
      return
    }

    if (stat.isDirectory()) {
      scanDir(fullPath)
    } else {
      const ext = path.extname(fullPath)
      if (exts.includes(ext)) {
        scanFile(fullPath)
      }
    }
  })
}

// 从项目根目录开始扫描
scanDir(process.cwd())
