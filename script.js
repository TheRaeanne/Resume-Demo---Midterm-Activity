const $$ = (s) => [...document.querySelectorAll(s)];
const folder = document.querySelector(".folder");

// Switch between "About Me" (view-about) and "My Art" (view-art)
function showView(name) {
  $$(".view").forEach((v) => (v.hidden = v.id !== `view-${name}`));
  $$(".bookmarks ul").forEach((u) => (u.hidden = u.id !== `nav-${name}`));
  $$(".tab").forEach((t) => {
    const on = t.dataset.view === name;
    t.classList.toggle("active", on);
    t.setAttribute("aria-selected", on);
  });
  folder.dataset.view = name; // lets the CSS round the folder corner for each tab
  window.scrollTo({ top: 0, behavior: "smooth" });
}
$$(".tab").forEach((t) =>
  t.addEventListener("click", () => showView(t.dataset.view)),
);

// Lightbox for the art gallery
const lb = document.getElementById("lightbox");
const lbImg = lb.querySelector("img");
$$(".gallery figure").forEach((f) =>
  f.addEventListener("click", () => {
    const img = f.querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lb.hidden = false;
  }),
);
const closeLb = () => (lb.hidden = true);
lb.addEventListener("click", closeLb);
document.addEventListener("keydown", (e) => e.key === "Escape" && closeLb());

// Back to top
const toTop = document.getElementById("toTop");
window.addEventListener("scroll", () =>
  toTop.classList.toggle("show", window.scrollY > 400),
);
toTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);

// Image path helper: if an image fails, retry once one folder up (../),
// otherwise print the exact URL that failed in the browser console (F12).
const checkImg = (img) => {
  if (img.dataset.retried || !img.getAttribute("src")) return;
  if (img.getAttribute("src").startsWith("../")) {
    console.warn(
      "Image not found:",
      img.src,
      "- check folder, spelling, upper/lowercase and extension",
    );
    return;
  }
  img.dataset.retried = "1";
  img.src = "../" + img.getAttribute("src");
};
$$("img").forEach((img) => {
  img.addEventListener("error", () => checkImg(img));
  if (img.complete && img.naturalWidth === 0) checkImg(img); // already failed before this script ran
});
