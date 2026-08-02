document.addEventListener("DOMContentLoaded", async () => {
    const rootPath = document.body.dataset.root || "";

    await Promise.all([
        loadComponent("site-header", "header.html", rootPath),
        loadComponent("site-footer", "footer.html", rootPath)
    ]);

    initialiseMenu();
    highlightCurrentPage();
});


/* =========================================================
   LOAD REUSABLE COMPONENT
========================================================= */

async function loadComponent(containerId, fileName, rootPath) {
    const container = document.getElementById(containerId);

    if (!container) {
        return;
    }

    try {
        const response = await fetch(
            `${rootPath}includes/${fileName}`
        );

        if (!response.ok) {
            throw new Error(
                `Unable to load ${fileName}: ${response.status}`
            );
        }

        let componentHtml = await response.text();

        componentHtml = componentHtml.replaceAll(
            "{{ROOT}}",
            rootPath
        );

        container.innerHTML = componentHtml;

    } catch (error) {
        console.error(error);

        container.innerHTML = `
            <p class="component-error">
                Unable to load website component.
            </p>
        `;
    }
}


/* =========================================================
   BURGER MENU
========================================================= */

function initialiseMenu() {
    const header = document.querySelector(".ehn-header");
    const menuButton = document.querySelector(".ehn-menu-button");
    const navigation = document.querySelector(".ehn-navigation");
    const overlay = document.querySelector(".ehn-menu-overlay");

    if (!header || !menuButton || !navigation || !overlay) {
        return;
    }

    const navigationLinks = navigation.querySelectorAll("a");

    function openMenu() {
        header.classList.add("menu-open");
        navigation.classList.add("is-open");
        overlay.classList.add("is-visible");

        menuButton.setAttribute("aria-expanded", "true");
        menuButton.setAttribute(
            "aria-label",
            "Close navigation menu"
        );

        document.body.classList.add("ehn-menu-is-open");
    }

    function closeMenu(returnFocus = false) {
        header.classList.remove("menu-open");
        navigation.classList.remove("is-open");
        overlay.classList.remove("is-visible");

        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        document.body.classList.remove("ehn-menu-is-open");

        if (returnFocus) {
            menuButton.focus();
        }
    }

    function toggleMenu() {
        const isOpen =
            menuButton.getAttribute("aria-expanded") === "true";

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    menuButton.addEventListener("click", toggleMenu);

    overlay.addEventListener("click", () => {
        closeMenu();
    });

    navigationLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu(true);
        }
    });
}


/* =========================================================
   CURRENT-PAGE HIGHLIGHT
========================================================= */

function highlightCurrentPage() {
    const navigationLinks = document.querySelectorAll(
        ".ehn-navigation a"
    );

    if (!navigationLinks.length) {
        return;
    }

    const currentPath = normalisePath(
        window.location.pathname
    );

    navigationLinks.forEach((link) => {
        const linkPath = normalisePath(
            new URL(link.href, window.location.href).pathname
        );

        if (linkPath === currentPath) {
            link.classList.add("is-active");
            link.setAttribute("aria-current", "page");
        }
    });
}


function normalisePath(path) {
    let cleanPath = path.replace(/\/+/g, "/");

    if (cleanPath.endsWith("/")) {
        cleanPath += "index.html";
    }

    return cleanPath.toLowerCase();
}