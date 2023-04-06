import si from "systeminformation"
import { Query } from "./query-utils"

export function printBytes(name, bytes) {
  printString(name, (bytes / 1024).toFixed(2) + "kb")
}

export function printMs(name, ms) {
  printString(name, ms.toFixed(3) + "ms")
}

export function printString(name, value) {
  console.log(`${name}`.padEnd(15), value)
}

export async function printInfo(warmup, test, query) {
  printHr()
  const os = await si.osInfo()
  const cpu = await si.cpu()
  const mem = await si.mem()
  printString("os", `${os.platform} ${os.distro} ${os.release} ${os.arch}`)
  printString("cpu", `${cpu.manufacturer} ${cpu.brand}`)
  printString("memory", `${(mem.total / 1024 / 1024 / 1024).toFixed(2)}GB`)
  console.log()
  printString("WARMUP_ROUNDS", warmup)
  printString("QUERY_ROUND", query)
  printString("TEST_ROUNDS", test)
  console.log()
}

export async function printQueries(queries: Query[]) {
  const formatter = await import("sql-formatter")
  queries.forEach((q, i) => {
    console.log(`query-${i}`)
    printHr()
    console.log(formatter.format(q.compile().sql, { language: "postgresql" }))
    console.log()
    console.log()
    console.log()
  })
}

export function printHr() {
  console.log("-----------------------------------------------")
}
