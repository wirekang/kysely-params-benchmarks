import { Kysely, PostgresDialect } from "kysely"
import { measure } from "./measure-utils"
import { printInfo, printQueries } from "./log-utils"
import { Query0, Query1, Query2, Query3, Query4 } from "./queries"

const WARMUP_ROUNDS = 4000
const TEST_ROUNDS = 10000
const QUERY_ROUNDS = 1000

const kysely = new Kysely({ dialect: new PostgresDialect({} as any) })
const queries = [Query0, Query1, Query2, Query3, Query4].map((clazz) => new clazz(kysely).init())

if (process.argv.length > 2 && process.argv[2].trim() === "-q") {
  printQueries(queries)
} else {
  printInfo(WARMUP_ROUNDS, TEST_ROUNDS, QUERY_ROUNDS).then(benchmark)
}

let result

function benchmark() {
  const noop = (v?) => v

  measure("no-op", WARMUP_ROUNDS, TEST_ROUNDS, QUERY_ROUNDS, () => {
    noop()
  })

  for (let i = 0; i < queries.length; i += 1) {
    const query = queries[i]
    measure(`kysely-${i}`, WARMUP_ROUNDS, TEST_ROUNDS, QUERY_ROUNDS, () => {
      result = query.compile()
    })

    const parameterized = query.parameterize()
    measure(`kysely-params-${i}`, WARMUP_ROUNDS, TEST_ROUNDS, QUERY_ROUNDS, () => {
      const newParams = { ...query.parameters }
      result = parameterized.instantiate(newParams)
    })
  }
}
