// NestJS Notes — shared behavior, adapted from Dave's InShop handbook (src/book.js):
// sidebar menu (pages + on-this-page section index + search filter) and the EN/FA toggle.
// Every visible text exists twice in the HTML: <span data-l="en">…</span><span data-l="fa">…</span>.
const LANG_KEY = "nestjs-notes-lang";
const root = document.body.dataset.root || "./";
const here = document.body.dataset.page || "index";

const PAGES = [
  { id: "index", file: "index.html", title: { en: "Home — all notes", fa: "خانه — همه یادداشت‌ها" } },
  { id: "decorators", file: "notes/decorators.html", title: { en: "Decorators", fa: "Decoratorها" } },
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
