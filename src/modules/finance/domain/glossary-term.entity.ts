export class GlossaryTerm {
  constructor(
    public readonly id: string,
    public readonly term: string,
    public readonly simpleDefinition: string,
    public readonly category: string
  ) {}
}
