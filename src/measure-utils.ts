import process from "node:process"
import { printBytes, printHr, printMs } from "./log-utils"

export function measure(title, warmup, test, repeat, cb) {
  for (let i = 0; i < warmup; i += 1) {
    cb()
  }
  const results = []
  for (let i = 0; i < test; i += 1) {
    gc()
    const startTime = performance.now()
    const beforeMem = getMemory()
    for (let j = 0; j < repeat; j += 1) {
      cb()
    }
    results.push({
      time: (performance.now() - startTime) / repeat,
      mem: (getMemory() - beforeMem) / repeat,
    })
  }
  printResults(results, title)
}

function getMemory() {
  return process.memoryUsage().heapUsed
}

function printResults(results, title) {
  const time = computeResults(results.map((v) => v.time))
  const mem = computeResults(results.map((v) => v.mem))
  console.log()
  console.log(title)
  printHr()
  printBytes("min", mem.min)
  printBytes("max", mem.max)
  printBytes("avg", mem.avg)
  console.log()
  printMs("min", time.min)
  printMs("max", time.max)
  printMs("avg", time.avg)
  console.log()
}

function computeResults(results) {
  let min = Number.MAX_VALUE
  let max = Number.MIN_VALUE
  let total = 0
  results.forEach((r) => {
    if (min > r) {
      min = r
    }
    if (max < r) {
      max = r
    }
    total += r
  })
  const avg = total / results.length
  return { min, max, avg }
}
