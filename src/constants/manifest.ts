export const MANIFEST = {
    "manifest_version": 3,
    "version": "1.0",
    "name": "WorkCheck",
    "permissions": [
        "storage",
        "tabs",
        "management"
    ],
    "action": {
        "default_title": "Click me",
        "default_popup": "popup.html"
    }, 
    "chrome_url_overrides": {
        "newtab": "newtab.html" 
    },
    "content_scripts": [
        {
            "matches": ["http://*/*", "https://*/*"],
            "js": ["contentScript.js"]
        }    
    ],
    "background": {
        "service_worker": "background.js",
        "type": "module"
      }
}