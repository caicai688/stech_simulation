# 🎭 喜剧鉴赏调度器系统

## 🌟 系统概述

全新的健壮调度器系统，解决 429 错误和并发问题。

### 核心特性

#### 1. 多级自动降级 (Multi-level Fallback)
```
Gemini (首选) 
  ↓ 429/超时
千问 (备选1)
  ↓ 429/超时  
智谱 (备选2)
  ↓
所有失败才报错
```

#### 2. 智能缓存 (24小时)
- 相同段子24小时内直接返回缓存
- 大幅减少 API 调用次数
- 节省配额，提升响应速度

#### 3. 并发限流 (Throttle)
```
Gemini:  最多 2  个并发
千问:    最多 5  个并发
智谱:    最多 10 个并发
```
- 超出限制自动排队，不直接失败
- 智能队列管理

#### 4. 统一输出格式
无论使用哪个模型，输出格式完全一致：
```typescript
{
  totalScore: number;
  grade: string;
  vibes: {...};
  comments: [...];
  // ... 其他字段
}
```

## 📁 新增文件

### 核心文件
- **`services/comedyScheduler.ts`** - 调度器核心逻辑
  - 多级降级
  - 缓存管理
  - 限流控制
  - 统一协议

- **`components/SchedulerDebugPanel.tsx`** - 监控面板
  - 实时并发数
  - 缓存统计
  - 队列状态

### 更新文件
- **`services/geminiService.ts`** - 简化为调度器代理
- **`App.tsx`** - 集成调试面板入口

## 🎯 使用方式

### 对用户透明
用户无需任何改变，系统自动：
1. 尝试 Gemini
2. 遇到 429 自动切换千问
3. 千问失败切换智谱
4. 所有请求自动缓存

### 开发者监控
点击右上角 **绿色活动图标 (Activity)** 查看：
- 实时并发数
- 缓存命中情况
- 队列排队状态
- 使用的模型

## 🔧 配置说明

### 环境变量 (已配置)
```bash
VITE_GEMINI_API_KEY=AIzaSyBs7k...
VITE_GLM_API_KEY=e5b45d35f9c1...
VITE_QWEN_API_KEY=sk-570be67e...
```

### 并发限制调整
在 `comedyScheduler.ts` 的 `initModelConfigs()` 中：
```typescript
// Gemini 配置
{
  name: 'gemini',
  maxConcurrent: 2,  // ← 修改这里
  timeout: 30000
}
```

### 缓存时长调整
在 `getFromCache()` 函数中：
```typescript
const MAX_AGE = 24 * 60 * 60 * 1000; // ← 24小时
```

## 📊 监控功能

### 调度器统计
```typescript
import { getSchedulerStats } from './services/comedyScheduler';

const stats = getSchedulerStats();
// {
//   cacheSize: 15,
//   concurrentCounts: { gemini: 1, qwen: 0, glm: 0 },
//   queueSizes: { gemini: 0, qwen: 2, glm: 0 }
// }
```

### 清除缓存
```typescript
import { clearCache } from './services/comedyScheduler';

clearCache(); // 清除所有缓存
```

### 查看缓存详情
```typescript
import { getCacheDetails } from './services/comedyScheduler';

const details = getCacheDetails();
// [
//   { key: 'comedy_...', age: 15, model: 'gemini' },
//   { key: 'comedy_...', age: 30, model: 'qwen' }
// ]
```

## 🚀 工作流程

### 完整调用链路
```
用户提交段子
  ↓
检查缓存 (24h)
  ├─ 命中 → 直接返回 ✅
  └─ 未命中 ↓
尝试 Gemini (并发≤2)
  ├─ 成功 → 缓存 → 返回 ✅
  ├─ 429/超时 ↓
尝试千问 (并发≤5)
  ├─ 成功 → 缓存 → 返回 ✅
  ├─ 429/超时 ↓
尝试智谱 (并发≤10)
  ├─ 成功 → 缓存 → 返回 ✅
  └─ 失败 → 报错 ❌
```

### 排队机制
```
请求到达 → 检查并发
  ├─ 未满 → 立即执行
  └─ 已满 → 加入队列
           ↓
        等待空位
           ↓
        自动执行
```

## 🎨 性能优化

### 预期效果
- **缓存命中率**: 40-60% (重复段子)
- **429 错误率**: 降低 80%+
- **平均响应时间**: 减少 50%
- **API 配额消耗**: 减少 40-60%

### 降级效果
- Gemini 限流 → 自动切千问
- 千问故障 → 自动切智谱
- 零用户感知的故障转移

## 💡 最佳实践

### 1. 监控健康度
定期查看调试面板，关注：
- 缓存命中率
- 各模型使用频率
- 队列堆积情况

### 2. 调整并发数
根据实际 API 配额调整：
```typescript
// 如果 Gemini 429 频繁
maxConcurrent: 1  // 降低并发

// 如果千问稳定
maxConcurrent: 10 // 提高并发
```

### 3. 清理过期缓存
系统自动清理24小时以上的缓存，无需手动干预。

### 4. 紧急降级
如果某个模型完全不可用，删除对应环境变量即可：
```bash
# 禁用 Gemini
# VITE_GEMINI_API_KEY=xxx  ← 注释掉
```

## 🐛 故障排查

### 问题: 所有模型都返回 429
**原因**: 并发数设置过高
**解决**: 降低 `maxConcurrent` 值

### 问题: 响应很慢
**原因**: 队列堆积
**解决**: 查看调试面板 → 清除缓存 → 降低并发

### 问题: 缓存不生效
**原因**: 段子内容有细微差异
**解决**: 正常现象，缓存基于完全匹配

### 问题: 某个模型一直失败
**原因**: API Key 无效或配额耗尽
**解决**: 检查 `.env.local` → 更新 Key

## 📈 未来优化方向

- [ ] Redis 持久化缓存（跨用户共享）
- [ ] 模型负载均衡（智能选择最快模型）
- [ ] 实时配额监控（预警机制）
- [ ] 自适应并发调整（根据成功率动态调整）
- [ ] 分布式限流（多实例协调）

## 🎉 总结

新调度器系统提供：
- ✅ 自动容错（多级降级）
- ✅ 智能缓存（减少调用）
- ✅ 并发控制（避免429）
- ✅ 统一接口（无缝切换）
- ✅ 实时监控（可视化面板）

**结果**: 更稳定、更快速、更省钱的喜剧鉴赏服务！🎭
