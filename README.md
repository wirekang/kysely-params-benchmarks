# kysely-params-benchmarks

Memory and speed benchmarks: [kysely](https://github.com/kysely-org/kysely) vs [kysely + kysely-params](https://github.com/jtlapp/kysely-params)

Results may vary depending on environment, so please share yours, and I'll update readme.

It takes about an hour to complete, so be patient.  
(It's hard to measure memory usage in node due to GC)  
Reduce the `*_ROUNDS` in `src/main.ts` if you want to see the result quickly.

See [Diagram](#diagram) to check how it works.

## Results

### Summary

Average of memory usage in kilobyte

| query | kysely   | kysely-params |
| ----- | -------  | ------------- |
| 0     | 0.99     | 0.23          |
| 1     | 2.05    | 0.48          |
| 2     | 14.64   | 0.38          |
| 3     | 12.25    | 0.39          |
| 4     | 10.92    | 0.56          |


Average of time spend in milliseconds

| query | kysely   | kysely-params |
| ----- | -------  | ------------- |
| 0     | 0.001     | 0.000          |
| 1     | 0.002    | 0.000          |
| 2     | 0.013   | 0.000          |
| 3     | 0.026    | 0.000          |
| 4     | 0.038    | 0.000          |




```
os              linux Ubuntu 22.04.2 LTS x64
cpu             Intel Gen Intel® Core™ i7-12700K
memory          46.85GB

WARMUP_ROUNDS   4000
QUERY_ROUND     1000
TEST_ROUNDS     10000


no-op
-----------------------------------------------
min             0.00kb
max             0.22kb
avg             0.00kb

min             0.000ms
max             0.000ms
avg             0.000ms


kysely-0
-----------------------------------------------
min             0.92kb
max             1.39kb
avg             0.99kb

min             0.001ms
max             0.002ms
avg             0.001ms


kysely-params-0
-----------------------------------------------
min             0.23kb
max             0.49kb
avg             0.23kb

min             0.000ms
max             0.000ms
avg             0.000ms


kysely-1
-----------------------------------------------
min             1.87kb
max             2.36kb
avg             2.05kb

min             0.002ms
max             0.005ms
avg             0.002ms


kysely-params-1
-----------------------------------------------
min             0.25kb
max             0.75kb
avg             0.48kb

min             0.000ms
max             0.000ms
avg             0.000ms


kysely-2
-----------------------------------------------
min             14.40kb
max             14.93kb
avg             14.64kb

min             0.012ms
max             0.018ms
avg             0.013ms


kysely-params-2
-----------------------------------------------
min             0.27kb
max             0.52kb
avg             0.38kb

min             0.000ms
max             0.000ms
avg             0.000ms


kysely-3
-----------------------------------------------
min             11.89kb
max             12.52kb
avg             12.25kb

min             0.024ms
max             0.043ms
avg             0.026ms


kysely-params-3
-----------------------------------------------
min             0.28kb
max             0.53kb
avg             0.39kb

min             0.000ms
max             0.000ms
avg             0.000ms


kysely-4
-----------------------------------------------
min             10.42kb
max             11.13kb
avg             10.92kb

min             0.036ms
max             0.063ms
avg             0.038ms


kysely-params-4
-----------------------------------------------
min             0.41kb
max             0.66kb
avg             0.56kb

min             0.000ms
max             0.001ms
avg             0.000ms

Done in 2739.24s.

```


## Usage

1. setup node_modules  
`yarn install` or `npm install`

2. start  
`yarn start` or `npm start`


* To see which query is used, pass `-q`:  
  `yarn start -q` or `npm start -q`

```
query-0
-----------------------------------------------
select
  *
from
  "person"



query-1
-----------------------------------------------
select
  *
from
  "person"
where
  "id" = $1



query-2
-----------------------------------------------
select
  "user_following"."id",
  "user_following"."from_user_id",
  "user_following"."to_user_id",
  "user_following"."accepted",
  "user_profile"."nickname",
  "user_profile"."search_id",
  "user_profile"."profile_image_url"
from
  "user_following"
  inner join "user_handle" on "user_handle"."id" = "user_following"."to_user_id"
  inner join "user_profile" on "user_profile"."user_id" = "user_handle"."id"
where
  "user_handle"."type" = $1
  and "user_following"."to_user_id" = $2
order by
  "user_following"."accepted" asc,
  "user_following"."id" desc



query-3
-----------------------------------------------
select
  "t1"."Trade_Stock",
  "t1"."TRADE_ID",
  "t2"."TRADE_ID",
  "t1"."Trade_Timestamp",
  "t2"."Trade_Timestamp",
  "t1"."Price",
  "t2"."Price",
  abs("t1"."Price" - "t2"."Price") * 1.0 / "t1"."Price" * $1 as "price_diff_pct"
from
  "Trade_tbl" as "t1"
  inner join "Trade_tbl" as "t2" on "t1"."Trade_Stock" = "t2"."Trade_Stock"
where
  (
    "t1"."Trade_Timestamp" < "t2"."Trade_Timestamp"
    and datediff (
      second,
      "t1"."Trade_Timestamp",
      "t2"."Trade_Timestamp"
    ) < $2
    and abs("t1"."Price" - "t2"."Price") * 1.0 / "t1"."Price" * $3 > $4
  )
order by
  "t1"."TRADE_ID"



query-4
-----------------------------------------------
select
  "user"."id",
  "user"."first_name",
  "user"."last_name",
  "user"."age",
  "marriage"."married",
  "marriage"."married_at",
  "pet"."name",
  "pet"."kind",
  "job"."kind",
  "employment"."employed_at",
  "company"."name",
  "company"."created_at",
  "country"."id",
  "country"."code",
  "country"."population",
  "country"."population_updated_at",
  "planet"."id",
  "planet"."kind"
from
  "user"
  inner join "employment" on "employment"."user_id" = "user"."id"
  inner join "job" on "job"."id" = "employment"."job_id"
  inner join "company" on "company"."id" = "employment"."company_id"
  inner join "country" on "country"."id" = "company"."country_id"
  inner join "planet" on "planet"."id" = "country"."planet_id"
  left join "marriage" on "marriage"."user_id" = "user"."id"
  left join "pet" on "pet"."owner_id" = "user"."id"
where
  (
    "user"."name" like $1
    and "user"."age" >= $2
    and "user"."age" <= $3
    and "marriage"."married" = $4
    and "pet"."kind" = $5
    and "job"."kind" = $6
    and "country"."population" >= $7
    and "planet"."kind" = $8
  )
order by
  "marriage"."married" desc,
  "country"."population" asc

```


## Diagram

```mermaid
stateDiagram-v2
    [*] --> _build_query
    _build_query -->  _build_query : (WARMUP_ROUNDS)
    _build_query --> gc
    gc --> record_before
    record_before --> build_query
    build_query --> build_query : (QUERY_ROUNDS)
    build_query --> record_after 
    record_after --> save_diff
    save_diff --> gc : (TEST_ROUNDS)
    save_diff --> print_results : finish

```
