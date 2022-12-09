import { matchParse } from "../utils/matchParse"


chrome.tabs.onCreated.addListener(
    (tab) => {
        chrome.storage.sync.get(["isEnabled"], (res) => {
            if (res.isEnabled) {
                chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
                    const { User } = await chrome.storage.sync.get("User")
                    const response = await fetch(
                        'http://localhost:3001/professor/getPolicies?' + new URLSearchParams({
                            name: User.profId,
                        }),
                        {
                            method: 'GET',

                        },
                    );
                    const { policies } = await response.json();
                    if (policies.includes(matchParse(tab.url)) || tab.url === 'chrome://newtab/') {
                    } else {
                        chrome.tabs.remove(tab.id)
                    }
                })
            }
        })
    }
)

chrome.windows.onFocusChanged.addListener(
    (id) => {
        chrome.storage.sync.get(["isEnabled"], async (res) => {
            if (res.isEnabled) {
                if (id !== chrome.windows.WINDOW_ID_CURRENT) {
                    const { User } = await chrome.storage.sync.get("User")
                    if (User) {
                        fetch(
                            'http://localhost:3001/professor/focus',
                            {
                                method: 'POST',
                                body: JSON.stringify(User),
                                mode: 'cors', 
                                headers: {
                                    'Content-Type': 'application/json'
                                },

                            },
                        );
                    }

                }
            }
        }
        )
    }
)

// chrome.permissions.request({
//     permissions: ['tabs'],
//     origins: ['https://www.google.com/']
// }, (granted) => {
//     // The callback argument will be true if the user granted the permissions.
//     if (granted) {
//         console.log('granted')
//     } else {
//         console.log('rejected')
//     }
// });