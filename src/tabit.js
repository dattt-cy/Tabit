function Tabit(selector, options) {
    this.container = document.querySelector(selector);
    if (!this.container) {
        console.error("Tabit: Container not found");
        return;
    }
    this.tabs = Array.from(this.container.querySelectorAll("li a"));
    if (!this.tabs.length) {
        console.error("Tabit: No tabs found");
        return;
    }

    this.panels = this.tabs
        .map((tab) => {
            const panel = document.querySelector(tab.getAttribute("href"));
            if (!panel) {
                console.error(
                    `Tabit: Panel for ${tab.getAttribute("href")} not found`
                );
            }
            return panel;
        })
        .filter(Boolean);

    if (this.tabs.length !== this.panels.length) {
        return;
    }
    this.opts = Object.assign(
        {
            remember: false,
        },
        options
    );
    this.originHTML = this.container.innerHTML;
}

Tabit.prototype._init = function () {
    let tab;
    const hash = location.hash;
    tab =
        (this.opts.remember &&
            hash &&
            this.tabs.find((t) => t.getAttribute("href") === hash)) ||
        this.tabs[0];

    this._activateTab(tab);

    this.tabs.forEach((tab) => {
        tab.onclick = (event) => this._handleTabClick(event, tab);
    });
};

Tabit.prototype._handleTabClick = function (event, tab) {
    event.preventDefault();
    this._activateTab(tab);
};

Tabit.prototype._activateTab = function (tab) {
    this.tabs.forEach((tab) => {
        tab.closest("li").classList.remove("tabit--active");
    });

    tab.closest("li").classList.add("tabit--active");

    this.panels.forEach((panel) => {
        panel.hidden = true;
    });

    const panelActive = document.querySelector(tab.getAttribute("href"));
    panelActive.hidden = false;

    if (this.opts.remember) {
        history.replaceState(null, null, tab.getAttribute("href"));
    }
};

Tabit.prototype.switch = function (input) {
    let tabToActivate;
    if (typeof input === "string") {
        tabToActivate = this.tabs.find(
            (tab) => tab.getAttribute("href") === input
        );
        if (!tabToActivate) {
            console.error(`Tabit: Tab with href ${input} not found`);
            return;
        }
    } else if (this.tabs.includes(input)) {
        tabToActivate = input;
        if (!tabToActivate) {
            console.error("Tabit: Tab element not found in tabs");
            return;
        }
    }
    this._activateTab(tabToActivate);
};

Tabit.prototype.destroy = function () {
    this.container.innerHTML = this.originHTML;
    this.panels.forEach((panel) => {
        panel.hidden = false;
    });
    this.tabs = [];
    this.panels = [];
    this.container = null;
    this.originHTML = null;
};
