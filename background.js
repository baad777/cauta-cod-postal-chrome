chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "searchPostalCode",
        title: "Cauta cod postal",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "searchPostalCode" && info.selectionText) {
        const query = encodeURIComponent(info.selectionText.trim());
        chrome.system.display.getInfo((displays) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                return;
            }

            if (!displays || displays.length === 0) {
                console.error("No display information available.");
                return;
            }

            const primaryDisplay = displays.find(display => display.isPrimary);
            const width = 510;
            const height = 600;
            const left = Math.round((primaryDisplay.workArea.width - width) / 2);
            const top = Math.round((primaryDisplay.workArea.height - height) / 2);

            chrome.windows.create({
                url: `popup.html?query=${query}`,
                type: "popup",
                width: width,
                height: height,
                left: left + primaryDisplay.workArea.left,
                top: top + primaryDisplay.workArea.top
            });
        });
    }
});