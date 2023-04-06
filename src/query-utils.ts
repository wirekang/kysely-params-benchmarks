import { Kysely, SelectQueryBuilder } from "kysely"
import { parameterizeQuery } from "kysely-params"

export type Builder = SelectQueryBuilder<any, any, any>

export abstract class Query {
  private paramForCompile: (key: string) => any
  public abstract parameters: Record<string, any>

  public constructor(protected readonly kysely: Kysely<any>) {}

  public init(): this {
    this.paramForCompile = (key) => this.parameters[key]
    return this
  }

  protected abstract build(): Builder
  protected abstract buildConditions(builder: Builder, param: (key: string) => any): Builder

  public compile() {
    return this.buildConditions(this.build(), this.paramForCompile).compile()
  }

  public parameterize() {
    return parameterizeQuery(this.build()).asFollows(({ qb, param }) => this.buildConditions(qb, param))
  }
}
