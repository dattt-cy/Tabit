function Tabit(selector) {
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
    this.originHTML = this.container.innerHTML;
}

Tabit.prototype._init = function () {
    const tabActive = this.tabs[0];
    this._activeTab(tabActive);

    this.tabs.forEach((tab) => {
        tab.onclick = (event) => this._handleTabClick(event, tab);
    });
};

Tabit.prototype._handleTabClick = function (event, tab) {
    event.preventDefault();
    this._activeTab(tab);
};

Tabit.prototype._activeTab = function (tab) {
    this.tabs.forEach((tab) => {
        tab.closest("li").classList.remove("tabit--active");
    });

    tab.closest("li").classList.add("tabit--active");

    this.panels.forEach((panel) => {
        panel.hidden = true;
    });

    const panelActive = document.querySelector(tab.getAttribute("href"));
    panelActive.hidden = false;
};

Tabit.prototype.switch = function (input) {
    let tab;
    if (typeof input === "string") {
        tab = this.tabs.find((tab) => tab.getAttribute("href") === input);
        if (!tab) {
            console.error(`Tabit: Tab with href ${input} not found`);
            return;
        }
    } else if (this.tabs.includes(input)) {
        tab = input;
        if (!tab) {
            console.error("Tabit: Tab element not found in tabs");
            return;
        }
    }
    this._activeTab(tab);
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
