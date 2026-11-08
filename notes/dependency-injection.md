# Dependency Injection + Modules — simple version
Date: Mon 9 Nov 2026 · Chapter 1 (Modules / Providers)

## The one rule
You never write `new`. You ask for what you need in the constructor, and Nest brings it.

## Same module — 3 moves
1. `@Injectable()` on the service class.
2. List it in the module's `providers: [...]`.
3. Ask in the constructor: `constructor(private drivers: DriversService) {}`

Nest builds the service once (singleton) at startup and hands the same instance to everyone who asks.

## Another module — 3 moves
A service is private to its module by default.
1. Owner module: `exports: [DriversService]`
2. Needing module: `imports: [DriversModule]`
3. Inject in the constructor as usual.

Analogy: module = a department · providers = its staff · exports = staff allowed to help other departments · imports = the door you open to that department.

## The famous error
"Nest can't resolve dependencies of the X (?). Please make sure that the argument Y at index [0] is available in the ZModule context."
Checklist: @Injectable? → in providers? → exported from its module? → did you import that module?

## Note
`@Global()` module: its exports are available everywhere without importing. Rare — Config is the usual case.
