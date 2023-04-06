import { Query } from "./query-utils"
import { sql } from "kysely"

export class Query0 extends Query {
  public override parameters = {}

  protected override build() {
    return this.kysely.selectFrom("person").selectAll()
  }

  protected override buildConditions(builder, param) {
    return builder
  }
}

export class Query1 extends Query {
  public override parameters = {
    personId: 123456,
  }

  protected override build() {
    return this.kysely.selectFrom("person").selectAll()
  }

  protected override buildConditions(builder, param) {
    return builder.where("id", "=", param("personId"))
  }
}

export class Query2 extends Query {
  public parameters = {
    toUserId: 42,
    handleType: "normal",
  }

  protected override build() {
    return this.kysely
      .selectFrom("user_following")
      .innerJoin("user_handle", "user_handle.id", "user_following.to_user_id")
      .innerJoin("user_profile", "user_profile.user_id", "user_handle.id")
      .select([
        "user_following.id",
        "user_following.from_user_id",
        "user_following.to_user_id",
        "user_following.accepted",
        "user_profile.nickname",
        "user_profile.search_id",
        "user_profile.profile_image_url",
      ])
      .orderBy("user_following.accepted", "asc")
      .orderBy("user_following.id", "desc")
  }

  protected override buildConditions(builder, param) {
    return builder
      .where("user_handle.type", "=", param("handleType"))
      .where("user_following.to_user_id", "=", param("toUserId"))
  }
}

export class Query3 extends Query {
  public parameters = {
    toUserId: 42,
    handleType: "normal",
  }

  protected override build() {
    return this.kysely
      .selectFrom("Trade_tbl as t1")
      .innerJoin("Trade_tbl as t2", "t1.Trade_Stock", "t2.Trade_Stock")
      .select([
        "t1.Trade_Stock",
        "t1.TRADE_ID",
        "t2.TRADE_ID",
        "t1.Trade_Timestamp",
        "t2.Trade_Timestamp",
        "t1.Price",
        "t2.Price",
      ])
      .orderBy("t1.TRADE_ID")
  }

  protected override buildConditions(builder, param) {
    return builder
      .select((eb) => Query3.price_diff_pct(eb, param("p1")).as("price_diff_pct"))
      .where((eb) =>
        eb.and([
          eb.cmpr("t1.Trade_Timestamp", "<", eb.ref("t2.Trade_Timestamp")),
          eb.cmpr(
            eb.fn("datediff", [sql`second`, "t1.Trade_Timestamp", "t2.Trade_Timestamp"]),
            "<",
            param("p0"),
          ),
          eb.cmpr(Query3.price_diff_pct(eb, param("p1")), ">", param("p2")),
        ]),
      )
  }

  private static price_diff_pct(eb, param) {
    return eb.bxp(
      eb.fn("abs", [eb.bxp("t1.Price", "-", eb.ref("t2.Price"))]),
      "*",
      eb.bxp(sql`1.0`, "/", eb.bxp("t1.Price", "*", param)),
    )
  }
}

export class Query4 extends Query {
  public override parameters = {
    name: "Foo Bar Asdf Zxcv",
    minAge: 15,
    maxAge: 150,
    married: false,
    petKind: "dog",
    jobKind: "developer",
    minPopulation: 5000000,
    planetKind: "solid",
  }

  protected override build() {
    return this.kysely
      .selectFrom("user")
      .innerJoin("employment", "employment.user_id", "user.id")
      .innerJoin("job", "job.id", "employment.job_id")
      .innerJoin("company", "company.id", "employment.company_id")
      .innerJoin("country", "country.id", "company.country_id")
      .innerJoin("planet", "planet.id", "country.planet_id")
      .leftJoin("marriage", "marriage.user_id", "user.id")
      .leftJoin("pet", "pet.owner_id", "user.id")
      .select([
        "user.id",
        "user.first_name",
        "user.last_name",
        "user.age",
        "marriage.married",
        "marriage.married_at",
        "pet.name",
        "pet.kind",
        "job.kind",
        "employment.employed_at",
        "company.name",
        "company.created_at",
        "country.id",
        "country.code",
        "country.population",
        "country.population_updated_at",
        "planet.id",
        "planet.kind",
      ])
      .orderBy("marriage.married", "desc")
      .orderBy("country.population", "asc")
  }

  protected override buildConditions(builder, param) {
    return builder.where((eb) =>
      eb.and([
        eb.cmpr("user.name", "like", param("name")),
        eb.cmpr("user.age", ">=", param("minAge")),
        eb.cmpr("user.age", "<=", param("maxAge")),
        eb.cmpr("marriage.married", "=", param("married")),
        eb.cmpr("pet.kind", "=", param("petKind")),
        eb.cmpr("job.kind", "=", param("jobKind")),
        eb.cmpr("country.population", ">=", param("minPopulation")),
        eb.cmpr("planet.kind", "=", param("planetKind")),
      ]),
    )
  }
}
