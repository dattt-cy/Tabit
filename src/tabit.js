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

    this.panels = this.getPanels();

    if (this.tabs.length !== this.panels.length) {
        return;
    }
    this.opts = Object.assign(
        {
            activeClassName: "tabit--active",
            remember: false,
        },
        options
    );

    this._cleanRegex = /[^a-zA-Z0-9]/g;
    this.paramKey = selector.replace(this._cleanRegex, "");
    this.originHTML = this.container.innerHTML;
    this._init();
}

Tabit.prototype._init = function () {
    let tab;
    const param = new URLSearchParams(location.search);
    const tabHref = param.get(this.paramKey);
    tab =
        (this.opts.remember &&
            tabHref &&
            this.tabs.find(
                (t) =>
                    t.getAttribute("href").replace(this._cleanRegex, "") ===
                    tabHref
            )) ||
        this.tabs[0];
    this.currentTab = tab;
    this._activateTab(tab, false, false);
    this.tabs.forEach((tab) => {
        tab.onclick = (event) => {
            event.preventDefault();
            this._tryActivateTab(tab);
        };
    });
};
Tabit.prototype.getPanels = function () {
    return this.tabs
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
};

Tabit.prototype._tryActivateTab = function (tab) {
    if (tab !== this.currentTab) {
         this.currentTab = tab;
        this._activateTab(tab);
       
    }
};

Tabit.prototype._activateTab = function (
    tab,
    triggerOnChange = true,
    updateURL = this.opts.remember
) {
    this.tabs.forEach((tab) => {
        tab.closest("li").classList.remove(this.opts.activeClassName);
    });

    tab.closest("li").classList.add(this.opts.activeClassName);

    this.panels.forEach((panel) => {
        panel.hidden = true;
    });

    const panelActive = document.querySelector(tab.getAttribute("href"));
    panelActive.hidden = false;

    if (updateURL) {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set(
            this.paramKey,
            tab.getAttribute("href").replace(this._cleanRegex, "")
        );
        history.replaceState(null, null, `?${searchParams.toString()}`);
    }
    if (triggerOnChange && typeof this.opts.onChange === "function") {
        this.opts.onChange({
            tab: tab,
            panel: panelActive,
        });
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
    this._tryActivateTab(tabToActivate);
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
    this.currentTab = null;
};
