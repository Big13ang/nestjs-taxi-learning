// NestJS Notes — shared behavior, adapted from Dave's InShop handbook (src/book.js):
// sidebar menu (pages + on-this-page section index + search filter) and the EN/FA toggle.
// Every visible text exists twice in the HTML: <span data-l="en">…</span><span data-l="fa">…</span>.
const LANG_KEY = "nestjs-notes-lang";
const root = document.body.dataset.root || "./";
const here = document.body.dataset.page || "index";

const PAGES = [
  { id: "index", file: "index.html", title: { en: "Home — all notes", fa: "خانه — همه یادداشت‌ها" } },
  { id: "decorators", file: "notes/decorators.html", title: { en: "Decorators", fa: "Decoratorها" } },
  { id: "di", file: "notes/dependency-injection.html", title: { en: "Dependency injection and modules", fa: "تزریق وابستگی و Moduleها" } },
  { id: "guards", file: "notes/sample-guards.html", title: { en: "Guards (sample)", fa: "Guardها (نمونه)" } },
];

// Section index per page: anchor → title. Rendered in the sidebar for the current page.
const SECTIONS = {
  index: [
    { a: "notes", en: "Notes", fa: "یادداشت‌ها" },
    { a: "how", en: "How this works", fa: "این سیستم چطور کار می‌کند" },
    { a: "month", en: "The month at a glance", fa: "این ماه در یک نگاه" },
  ],
  decorators: [
    { a: "core", en: "Your note, corrected", fa: "یادداشت تو، اصلاح‌شده" },
    { a: "mental-model", en: "Mental model", fa: "مدل ذهنی" },
    { a: "all-kinds", en: "All 5 decorator kinds", fa: "هر ۵ نوع Decorator" },
    { a: "factory", en: "Decorator factory", fa: "Factory Decorator" },
    { a: "order", en: "Multiple decorators — the order", fa: "چند Decorator — ترتیب اجرا" },
    { a: "examples", en: "Examples to memorize", fa: "مثال‌هایی برای حفظ کردن" },
    { a: "training", en: "Train on these", fa: "با این‌ها تمرین کن" },
    { a: "nest", en: "Where this lands in Nest", fa: "این کجای Nest استفاده می‌شود" },
    { a: "review", en: "Review questions", fa: "سوال‌های مرور" },
  ],
  di: [
    { a: "idea", en: "The idea, in one picture", fa: "ایده، در یک تصویر" },
    { a: "recipe", en: "Same module: three moves", fa: "همان Module: سه حرکت" },
    { a: "other-modules", en: "Another module: three more moves", fa: "Module دیگر: سه حرکت دیگر" },
    { a: "errors", en: "The one error, translated", fa: "آن یک خطا، ترجمه‌شده" },
    { a: "training", en: "Train on these", fa: "با این‌ها تمرین کن" },
    { a: "review", en: "Review questions", fa: "سوال‌های مرور" },
  ],
  guards: [
    { a: "model", en: "Mental model", fa: "مدل ذهنی" },
    { a: "example", en: "Simple example", fa: "مثال ساده" },
    { a: "mistake", en: "Common mistake", fa: "اشتباه رایج" },
    { a: "project", en: "In the taxi project", fa: "در پروژه تاکسی" },
    { a: "review", en: "Review questions", fa: "سوال‌های مرور" },
  ],
};

function readLang() {
  const fromLink = new URLSearchParams(location.search).get("lang");
  if (fromLink === "fa" || fromLink === "en") return fromLink;
  try { return localStorage.getItem(LANG_KEY) === "fa" ? "fa" : "en"; } catch { return "en"; }
}
function applyLang(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  const btn = document.getElementById("lang-toggle");
  if (btn) btn.textContent = lang === "fa" ? "English" : "فارسی";
  try { localStorage.setItem(LANG_KEY, lang); } catch { /* page still works */ }
}
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  for (const c of children) node.append(c);
  return node;
}
function bilingual(t) {
  return [el("span", { "data-l": "en" }, [t.en]), el("span", { "data-l": "fa" }, [t.fa])];
}

function renderToc() {
  const nav = document.querySelector("nav.toc");
  if (!nav) return;
  const search = el("input", { class: "search", type: "search", autocomplete: "off", placeholder: "Search · جستجو", "aria-label": "Search the notes" });
  const tree = el("div", { class: "tree" });
  nav.replaceChildren(
    el("a", { class: "book-title", href: root + "index.html" }, bilingual({ en: "NestJS Notes", fa: "یادداشت‌های NestJS" })),
    search, tree,
  );
  tree.append(el("h4", {}, bilingual({ en: "Notes", fa: "یادداشت‌ها" })));
  for (const page of PAGES) {
    const link = el("a", { class: "page", href: root + page.file }, bilingual(page.title));
    if (page.id === here) link.setAttribute("aria-current", "page");
    tree.append(link);
  }
  const sections = SECTIONS[here] || [];
  if (sections.length) {
    tree.append(el("h4", {}, bilingual({ en: "On this page", fa: "در این صفحه" })));
    for (const s of sections) tree.append(el("a", { class: "page sec", href: "#" + s.a }, bilingual(s)));
  }
  tree.append(el("h4", {}, bilingual({ en: "Course", fa: "دوره" })));
  const course = el("a", { class: "page", href: "https://codehalic.ir/courses/nestjs-intermediate" }, bilingual({ en: "Codehalic — NestJS Intermediate", fa: "کدهالیک — NestJS متوسط" }));
  tree.append(course);
  search.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    for (const link of tree.querySelectorAll("a.page")) {
      link.style.display = !q || link.textContent.toLowerCase().includes(q) ? "" : "none";
    }
  });
}

applyLang(readLang());
renderToc();
document.getElementById("lang-toggle")?.addEventListener("click", () => {
  applyLang(document.documentElement.lang === "fa" ? "en" : "fa");
});

/* ---- Reading progress: one thin accent line at the top ---- */
const progressBar = el("div", { id: "read-progress" });
document.body.prepend(progressBar);
addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progressBar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
}, { passive: true });

/* ---- Scrollspy: the sidebar marks the section you are reading ---- */
const secLinks = new Map();
for (const link of document.querySelectorAll(".toc a.sec")) {
  secLinks.set(link.getAttribute("href").slice(1), link);
}
if (secLinks.size) {
  const spy = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of secLinks.values()) link.removeAttribute("aria-current");
      secLinks.get(entry.target.id)?.setAttribute("aria-current", "true");
    }
  }, { rootMargin: "-15% 0px -70% 0px" });
  for (const id of secLinks.keys()) {
    const section = document.getElementById(id);
    if (section) spy.observe(section);
  }
}

/* ---- TypeScript syntax highlighting for every code block ----
   Decorators get the one bold color (amber): they are the subject. */
const KEYWORDS = new Set(("const let var function return class extends implements new if else for of in await async import from export default public private protected readonly static get set this throw typeof instanceof true false null undefined void interface type enum namespace abstract is as satisfies").split(" "));
const PRIMITIVES = new Set(["string", "number", "boolean", "any", "object", "unknown", "never"]);
const TOKEN_RE = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`)|(@\w+)|(\b\d+(?:\.\d+)?\b)|\b[A-Za-z_$][\w$]*\b/g;
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function highlightTs(code) {
  let out = "", last = 0, m;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(code))) {
    out += escapeHtml(code.slice(last, m.index));
    const [tok, comment, str, decorator, num] = [m[0], m[1], m[2], m[3], m[4]];
    let cls = null;
    if (comment) cls = "tok-c";
    else if (str) cls = "tok-s";
    else if (decorator) cls = "tok-d";
    else if (num) cls = "tok-n";
    else if (KEYWORDS.has(tok)) cls = "tok-k";
    else if (PRIMITIVES.has(tok)) cls = "tok-t";
    else if (/^[A-Z]/.test(tok)) cls = "tok-t";
    else if (/^\s*\(/.test(code.slice(TOKEN_RE.lastIndex, TOKEN_RE.lastIndex + 2))) cls = "tok-f";
    out += cls ? `<span class="${cls}">${escapeHtml(tok)}</span>` : escapeHtml(tok);
    last = TOKEN_RE.lastIndex;
  }
  return out + escapeHtml(code.slice(last));
}
for (const block of document.querySelectorAll("pre code")) {
  block.innerHTML = highlightTs(block.textContent);
}
