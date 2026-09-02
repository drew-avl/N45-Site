const mobileNavigationSelector = "details[data-mobile-nav]";

function mobileNavigations() {
  return document.querySelectorAll<HTMLDetailsElement>(
    mobileNavigationSelector,
  );
}

function closeMobileNavigations(except?: HTMLDetailsElement) {
  for (const navigation of mobileNavigations()) {
    if (navigation !== except) navigation.removeAttribute("open");
  }
}

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const navigation = event.target.closest<HTMLDetailsElement>(
    mobileNavigationSelector,
  );

  if (event.target.closest("[data-mobile-nav-link]")) {
    navigation?.removeAttribute("open");
    return;
  }

  if (!navigation) closeMobileNavigations();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  for (const navigation of mobileNavigations()) {
    if (!navigation.open) continue;
    navigation.removeAttribute("open");
    navigation.querySelector<HTMLElement>("summary")?.focus();
  }
});

window.matchMedia("(min-width: 1024px)").addEventListener("change", (event) => {
  if (event.matches) closeMobileNavigations();
});
