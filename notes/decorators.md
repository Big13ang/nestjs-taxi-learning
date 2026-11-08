# Decorators — raw + expanded note
Date: Sun 8 Nov 2026 · Session 1 (early start, 18:04–22:30 Asia/Tehran)
Chapter 1 · Decorators

## Dave's raw note
> Decorators are running on the definition time on classes, like:
> ```ts
> @Logger()
> class Feed {}
> ```
> It will run as you start your project, not at runtime.

Correction to the raw syntax: `class Feed {}` — no `()` after the class name.

## Core truth (expanded)
- A decorator is just a **function** that receives the thing it sits on.
- It runs **once, at class-definition time** — when TypeScript/JavaScript evaluates the class, which is when the file/module is first imported (app startup for Nest modules).
- It does **not** run when you create an instance (`new Feed()`), and it does **not** run per request.
- Important split: the decorator *function* runs at definition time. What it leaves behind (metadata, a wrapped method, a changed prototype) is what acts later at runtime. Most Nest decorators just store metadata with `Reflect.defineMetadata`; Nest reads that metadata later.

## All 5 possible decorator kinds (TypeScript legacy / experimentalDecorators)
1. **Class** — `(constructor)` — `@Injectable()`, `@Controller()`, `@Module()`
2. **Method** — `(target, propertyKey, descriptor)` — `@Get()`, custom `@LogTime()`
3. **Accessor** — `(target, propertyKey, descriptor)` for `get`/`set` — same shape as method, descriptor holds `get`/`set`
4. **Property** — `(target, propertyKey)` — no descriptor, return value ignored — `@IsString()`, `@Column()`
5. **Parameter** — `(target, propertyKey, parameterIndex)` — `@Body()`, `@Param()`, `@Inject()`, `@Req()`

There are no other kinds in TypeScript. Everything in Nest is one of these 5.

Target cheat:
- Instance member: `target` = prototype (`FeedService.prototype`)
- Static member / class itself: `target` = constructor function (`FeedService`)

## Decorator factory
A factory is a function that **returns** a decorator, so you can pass arguments.

```ts
function Logger(prefix: string) {          // 1. factory — takes YOUR arguments
  return function (target: Function) {     // 2. the actual decorator
    console.log(`[${prefix}] ${target.name} defined`);
  };
}

@Logger('FEED')   // factory is called first, returns the decorator, decorator runs on Feed
class FeedService {}
```

- With parentheses `@Logger('FEED')` = factory. Without `@Logger` = you are passing the function itself as the decorator.
- Nest examples: `@Controller('feed')`, `@Get(':id')`, `@Roles('ADMIN')` (= `SetMetadata`).

## Multiple decorators — why the order looks reversed
```ts
@First()
@Second()
@Third()
class Demo {}
```
- **Factory evaluation:** top → bottom: `First()`, `Second()`, `Third()`
- **Decorator invocation:** bottom → top: `Third`, `Second`, `First`
- Reason: function composition. `@f @g x` means `f(g(x))`. The decorator closest to the class must finish first so the next one can wrap/receive its result — like an onion / a stack (last on, first applied).
- Memory line: **"Factories read top-down, decorators run bottom-up."**

Full ordering inside a class (TypeScript spec):
1. Parameter decorators, then method/accessor/property decorators — for each **instance** member
2. Parameter decorators, then method/accessor/property decorators — for each **static** member
3. Parameter decorators — for the **constructor**
4. Class decorators — for the **class** (last)

## Training
See decorated page: `docs/notes/decorators.html` — predict-the-output puzzles + write-from-memory drills, with answers hidden in expandable sections.
