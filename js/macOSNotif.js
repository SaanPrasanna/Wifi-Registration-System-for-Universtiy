/**
 *  macOSNotifJS: A simple Javascript plugin to create simulated macOS notifications on your website.
 *  <https://github.com/MattIPv4/macOSNotifJS/>
 *  Copyright (C) 2019 Matt Cowley (MattIPv4) (me@mattcowley.co.uk)
 *
 *  This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Affero General Public License as published
 *   by the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *  This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *  You should have received a copy of the GNU Affero General Public License
 *   along with this program. If not, please see
 *   <https://github.com/MattIPv4/macOSNotifJS/blob/master/LICENSE> or <http://www.gnu.org/licenses/>.
 */

require("./css/macOSNotif.css");  // Ensure the CSS gets included
require("@babel/polyfill");  // Polyfill for older browsers

const __macOSNotifJSInteract = require("./interact.js");
const { __macOSNotifJSTheme, __macOSNotifJSThemes } = require("./themes.js");
const __macOSNotifJSTemplate = require("./html/macOSNotif.html").default.replace(/<!--(?!>)[\S\s]*?-->/g, ""); // Strip HTML comments
const __macOSNotifJSNotifs = {};
let __macOSNotifJSFadeThreshold = 6;

/**
 * The main notification class
 */
class macOSNotifJS {

    /**
     * Create a new instance of the notification
     * @param {Object} options - The options to apply to the notification (see source __defaultOptions)
     */
    constructor(options) {
        this.__defaultOptions = {
            delay: 0.5,                             // Delay before display (in seconds)
            autoDismiss: 0,                         // Delay till automatic dismiss (0 = Never, in seconds)
            interactDismiss: true,                  // Toggle swipe/drag to dismiss

            sounds: false,                          // Play sounds for notification
            theme: __macOSNotifJSThemes.Light,      // Set the theme to be used by the notification (from window.macOSNotifThemes)
            themeNative: false,                     // Attempt to detect light/dark from OS, fallback to theme
            zIndex: 5000,                           // CSS z-index value of the notification (will be adjusted for stacked notifications)

            imageSrc: null,                         // Link of the icon to display (null to hide icon)
            imageName: "",                          // Alt/Title text of the icon
            imageLink: null,                        // Link for icon click (see link functionality below)
            imageLinkDismiss: true,                 // Dismiss notification after Image Link pressed (useful if link is function)
            imageLinkNewTab: false,                 // Open Image Link in New Tab (ignored if link is set to dismiss)

            title: "macOSNotifJS",                  // Main Notif Title
            subtitle: "Default notification text",  // Main Notif Sub Title

            mainLink: null,                         // Link for the main text body (see link functionality below)
            mainLinkDismiss: true,                  // Dismiss notification after Main Link pressed (useful if link is function)
            mainLinkNewTab: false,                  // Open Main Link in New Tab (ignored if link is set to dismiss)

            btn1Text: "Close",                      // Text for Button 1 (null to hide all buttons)
            btn1Link: null,                         // Link for Button 1 (see link functionality below)
            btn1Dismiss: true,                      // Dismiss notification after Button 1 pressed (useful if link is function)
            btn1NewTab: false,                      // Open Button 1 Link in New Tab (ignored if link is set to dismiss)

            btn2Text: "Go",                         // Text for Button 2 (null to hide second button)
            btn2Link: null,                         // Link for Button 2 (see link functionality below)
            btn2Dismiss: true,                      // Dismiss notification after Button 2 pressed (useful if link is function)
            btn2NewTab: false,                      // Open Button 2 Link in New Tab (ignored if link is set to dismiss)
        };

        // Link functionality:
        //  - Use null for no link (this will act as dismiss on btn1Link & btn2Link)
        //  - Use "#" to make the element act as dismiss with no further action
        //  - Use any string as a URL which will open when element is clicked
        //  - Use a Javascript function to be called when element is clicked
        //     (Note: The notification object is passed as the 1st parameter if required)

        // Load our options
        this.__options = { ...this.__defaultOptions, ...options };
        // Allow for old-style dark mode option
        if (options && "dark" in options) this.__options.theme = options.dark ? __macOSNotifJSThemes.Dark : __macOSNotifJSThemes.Light;
        // Fix invalid theme option
        if (!(this.__options.theme instanceof __macOSNotifJSTheme)) this.__options.theme = this.__defaultOptions.theme;

        // Other properties
        this.__container = null;
        this.__id = null;
        this.__interact = null;
        this.__dismissing = false;
    }

    /**
     * Converts an integer notification ID to the full string ID
     * @param {number} id - The base integer ID of the notification
     * @returns {string} - The full length ID string
     * @private
     */
    static __fullId(id) {
        return "macOSNotifJS_n" + id.toString();
    }

    /**
     * Generates the integer ID for the next notification based on the current notifications
     * @returns {number} - The next ID to use
     * @private
     */
    static __nextId() {
        // Handle empty
        if (!__macOSNotifJSNotifs || Object.keys(__macOSNotifJSNotifs).length === 0) return 0;

        // Get max
        const keys = Object.keys(__macOSNotifJSNotifs).map(Number);
        return Math.max(...keys) + 1;
    }

    /**
     * Generates the HTML template for the next notification, fetching the template & next ID
     * @returns {{template: string, id: number}} - The HTML template for the notification with ID injected and the raw integer ID
     * @private
     */
    static __generateTemplate() {
        // Get the template and insert the id
        let template = __macOSNotifJSTemplate;
        const id = this.__nextId();
        __macOSNotifJSNotifs[id] = null;
        template = template.replace(/macOSNotifJS_/g, this.__fullId(id) + "_");

        // Return template and the ID of it
        return { template, id };
    }

    /**
     * Generates or locates the audio component for notifications
     * @returns {HTMLElement} - The audio element
     * @private
     */
    static __generateAudio() {
        // If already exists, return it
        const element = document.getElementById("macOSNotifJS_Audio");
        if (element) return element;

        // Create new audio
        const audio = document.createElement("audio");
        audio.id = "macOSNotifJS_Audio";
        audio.autoplay = false;
        audio.volume = 1;
        audio.controls = false;
        audio.preload = "auto";

        // Create sources
        const sourceMp3 = document.createElement("source");
        sourceMp3.src = require("./audio/macOSNotif.mp3");
        sourceMp3.type = "audio/mpeg";
        audio.appendChild(sourceMp3);
        const sourceOgg = document.createElement("source");
        sourceOgg.src = require("./audio/macOSNotif.ogg");
        sourceOgg.type = "audio/ogg";
        audio.appendChild(sourceOgg);

        // Add to DOM and return
        document.body.appendChild(audio);
        return audio;
    }

    /**
     * Gets all constituent elements of a notification based on the ID passed
     * @param {number} id - The integer ID of the notification to fetch elements for
     * @returns {{Subtitle: HTMLElement, Container: HTMLElement, Img: HTMLElement, Button1: HTMLElement, Title: HTMLElement,
     *            Text: HTMLElement, Buttons: HTMLElement, Outer: HTMLElement, Button2: HTMLElement, Image: HTMLElement}} - The full
     *            collection of elements for the notification
     * @private
     */
    static __getElements(id) {
        // Get the full ID
        const fullId = this.__fullId(id) + "_";

        // Get all the elements
        const Outer = document.getElementById(fullId + "Outer");
        const Container = document.getElementById(fullId + "Container");
        const Img = document.getElementById(fullId + "Img");
        const Image = document.getElementById(fullId + "Image");
        const Text = document.getElementById(fullId + "Text");
        const Title = document.getElementById(fullId + "Title");
        const Subtitle = document.getElementById(fullId + "Subtitle");
        const Buttons = document.getElementById(fullId + "Buttons");
        const Button1 = document.getElementById(fullId + "Button1");
        const Button2 = document.getElementById(fullId + "Button2");

        // Return
        return { Outer, Container, Img, Image, Text, Title, Subtitle, Buttons, Button1, Button2 };
    }

    /**
     * Run a specified callback on each notification that exists after a specific ID
     * @param {number} id - The integer ID of the notification to run the callback after
     * @param {string} callback - The name of the method within the notification to be run on each notification
     * @private
     */
    static __doAfter(id, callback) {
        for (const key in __macOSNotifJSNotifs) {
            if (!__macOSNotifJSNotifs.hasOwnProperty(key)) continue;
            if (parseInt(key, 10) < id) __macOSNotifJSNotifs[key][callback]();
        }
    }

    /**
     * Dismiss all notifications after a specific notification ID
     * @param {number} id - The integer ID of the notification after which to dismiss
     * @private
     */
    static __dismissAfter(id) {
        this.__doAfter(id, "dismiss");
    }

    /**
     * Update the display position of every notification currently active
     * @private
     */
    static __updatePosAll() {
        for (const key in __macOSNotifJSNotifs) {
            if (!__macOSNotifJSNotifs.hasOwnProperty(key)) continue;
            __macOSNotifJSNotifs[key].__updatePos();
        }
    }

    /**
     * Update the position on the web-page of the notification in the notification stack
     * @private
     */
    __updatePos() {
        // Calculate notifications above (that aren't dismissing)
        const id = this.__id;
        let elmsAbove = 0;
        Object.values(__macOSNotifJSNotifs).forEach(value => {
            if (value.__id > id) {
                if (!value.__dismissing) {
                    elmsAbove += 1;
                }
            }
        });

        const outer = this.__container.parentElement;
        let newPos = outer.offsetHeight * Math.min(elmsAbove, __macOSNotifJSFadeThreshold - 1);

        // Within visible list
        if (elmsAbove < __macOSNotifJSFadeThreshold) {
            this.__container.style.opacity = "1";
            this.__container.style.pointerEvents = "auto";
            outer.style.top = newPos + "px";
        } else {

            // Within stack (1st/2nd after threshold)
            if (elmsAbove - __macOSNotifJSFadeThreshold < 2) {
                this.__container.style.opacity = ((3 - (elmsAbove - __macOSNotifJSFadeThreshold)) / 4).toString();
                this.__container.style.pointerEvents = "none";
                newPos += outer.offsetHeight * (elmsAbove - __macOSNotifJSFadeThreshold + 1) / 8;
                outer.style.top = newPos + "px";
            } else {

                // Hidden
                this.__container.style.opacity = "0";
                this.__container.style.pointerEvents = "none";
            }
        }
    }

    /**
     * Handle the processing of a click event on a link element within the notification
     * @param {null|string|function} link - The "link" specific by the initial options of the notification
     * @param {boolean} newTab - Whether the link should be opened in a new tab
     * @param {boolean} dismiss - Whether the notification should dismiss after opening the link
     * @param {boolean} [nullNoDismiss=false] - (Optional) If a null value in the link should trigger dismissal
     * @private
     */
    __handleGo(link, newTab, dismiss, nullNoDismiss) {
        if (typeof nullNoDismiss === "undefined") nullNoDismiss = false;

        if (dismiss && !(link === null && nullNoDismiss)) this.dismiss();

        if (link === "#" || link === null) return;

        setTimeout(() => {
            if (typeof link === "function") {
                link(this);
            } else {
                if (newTab) {
                    const win = window.open(link, "_blank");
                    win.focus();
                } else {
                    window.location.href = link;
                }
            }
        }, dismiss ? 800 : 0);
    }

    /**
     * Dismiss all active notifications
     */
    static dismissAll() {
        const notifs = Object.values(__macOSNotifJSNotifs).reverse();
        notifs.forEach((notif, i) => {
            setTimeout(notif.dismiss(), 100 * i);
        });
    }

    /**
     * Dismiss this notification
     */
    dismiss() {
        // Only dismiss once
        if (this.__dismissing) return;

        // Let others know
        this.__dismissing = true;
        if (this.__interact) this.__interact.disable();

        // Get our ids
        const fullId = this.constructor.__fullId(this.__id);

        // Animate dismissal
        this.__container.parentElement.style.pointerEvents = "none";
        this.__container.style.right = -this.__container.parentElement.offsetWidth + "px";
        this.__container.style.opacity = "0.1";
        this.constructor.__updatePosAll();

        // Clear the autodismiss if applicable
        if (window[fullId + "_AutoDismiss"]) {
            clearTimeout(window[fullId + "_AutoDismiss"]);
            delete window[fullId + "_AutoDismiss"];
        }

        // Clear the onclick handlers
        if (window[fullId + "_ButtonMain"]) delete window[fullId + "_ButtonMain"];
        if (window[fullId + "_Button1"]) delete window[fullId + "_Button1"];
        if (window[fullId + "_Button2"]) delete window[fullId + "_Button2"];

        // Remove fully once animation completed
        setTimeout(() => {
            // Delete outer
            this.__container.parentElement.parentElement.removeChild(this.__container.parentElement);

            // Remove styles if applicable
            this.__clearTheme();

            // Remove window data
            delete __macOSNotifJSNotifs[this.__id];
            delete window[fullId];
        }, 800);
    }

    /**
     * Removes the current theme/style element for the notification if there is one
     * @private
     */
    __clearTheme() {
        const styleElement = document.getElementById(this.constructor.__fullId(this.__id) + "_Styles");
        if (styleElement) styleElement.parentElement.removeChild(styleElement);
    }

    /**
     * Applies a theme instance to the current notification
     * @param {__macOSNotifJSTheme} theme - The theme to apply to the notification
     * @private
     */
    __applyTheme(theme) {
        this.__clearTheme();
        const { Outer } = this.constructor.__getElements(this.__id);
        const styles = theme.generateStyle(this.constructor.__fullId(this.__id));
        if (styles) document.body.insertBefore(styles, Outer);
    }

    /**
     * Checks the current device for native theme preferences and applies that preference as the current notification theme if possible
     * @private
     */
    __checkNative() {
        // Get current
        const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const isMSDarkHighContrast = window.matchMedia("(-ms-high-contrast: white-on-black)").matches;
        const isLightMode = window.matchMedia("(prefers-color-scheme: light)").matches;
        const isNotSpecified = window.matchMedia("(prefers-color-scheme: no-preference)").matches;
        const hasNoSupport = !isDarkMode && !isLightMode && !isNotSpecified;

        // Fallback to theme specific in options if no native support or not natively specified
        if (hasNoSupport || isNotSpecified) {
            this.__applyTheme(this.__options.theme);
            return;
        }

        // Apply based on OS
        if (isDarkMode || isMSDarkHighContrast) {
            this.__applyTheme(window.macOSNotifThemes.Dark);
        } else {
            this.__applyTheme(window.macOSNotifThemes.Light);
        }
    }

    /**
     * Gets the current theme for the notification
     * @returns {__macOSNotifJSTheme} - The current set theme for the notification
     */
    get theme() {
        return this.__options.theme;
    }

    /**
     * Sets a new theme for the notification
     * @param {__macOSNotifJSTheme} theme - The new theme to apply to the notification
     */
    set theme(theme) {
        // Validate
        if (!(theme instanceof __macOSNotifJSTheme)) return console.error("Invalid theme provided, not instance of theme class");
        // Set
        this.__options.theme = theme;
        // Apply
        if (this.__options.themeNative) this.__checkNative();
        else this.__applyTheme(this.__options.theme);
    }

    /**
     * Gets the current title of the notification
     * @returns {string} - The current notification title
     */
    get title() {
        const { Title } = this.constructor.__getElements(this.__id);
        return Title.textContent;
    }

    /**
     * Allows the title of the notification to be updated
     * @param {string} text - The text of the new title to be applied
     */
    set title(text) {
        this.__options.title = text;
        const { Title } = this.constructor.__getElements(this.__id);
        Title.textContent = text;
    }

    /**
     * Gets the current subtitle of the notification
     * @returns {string} - The current notification subtitle
     */
    get subtitle() {
        const { Subtitle } = this.constructor.__getElements(this.__id);
        return Subtitle.textContent;
    }

    /**
     * Allows the subtitle of the notification to be updated
     * @param {string} text - The text of the new subtitle to be applied
     */
    set subtitle(text) {
        this.__options.subtitle = text;
        const { Subtitle } = this.constructor.__getElements(this.__id);
        Subtitle.textContent = text;
    }

    /**
     * Creates the initial notification container during the run process of the notification
     * @private
     */
    __runInitialContainer() {
        // Generate the base template
        const templateData = this.constructor.__generateTemplate();
        this.__id = templateData.id;

        // Add the notification to DOM
        document.body.insertAdjacentHTML("beforeend", templateData.template);

        // Find the container
        const { Container } = this.constructor.__getElements(this.__id);
        this.__container = Container;
        this.__container.setAttribute("data-id", this.__id);
    }

    /**
     * Applies the correct theming to the notification during run, attaching native listener events if necessary
     * @private
     */
    __runApplyTheming() {
        if (this.__options.themeNative) {
            // Check current
            this.__checkNative();

            // Attach listeners
            window.matchMedia("(prefers-color-scheme: dark)").addListener(() => this.__checkNative());
            window.matchMedia("(prefers-color-scheme: light)").addListener(() => this.__checkNative());
        } else {
            this.__applyTheme(this.__options.theme);
        }
    }

    /**
     * Sets all the appropriate options on the notification as defined by the user, as part of the run process
     * @private
     */
    __runApplyOptions() {
        // Get the elements
        const { Img, Image, Text, Buttons, Button1, Button2 } = this.constructor.__getElements(this.__id);

        // Set the z-index with offset based on id (stacking)
        this.__container.parentElement.style.zIndex = (this.__options.zIndex + this.__id).toString();

        // Set the icon (& link if needed)
        if (this.__options.imageSrc !== null) {
            if (this.__options.imageLink !== null) {
                Image.classList.add("macOSNotif_Clickable");
            }
            Image.src = this.__options.imageSrc;
            Image.alt = this.__options.imageName;
            Image.title = this.__options.imageName;
        } else {
            Img.parentElement.removeChild(Img);
        }

        // Set the titles
        this.title = this.__options.title;
        this.subtitle = this.__options.subtitle;
        if (this.__options.mainLink !== null) {
            Text.classList.add("macOSNotif_Clickable");
        }

        // Set the buttons
        if (this.__options.btn1Text !== null) {
            Button1.textContent = this.__options.btn1Text;
            if (this.__options.btn2Text !== null) {
                Button2.textContent = this.__options.btn2Text;
            } else {
                Button1.classList.add("macOSNotif_ButtonFull");
                Button2.parentElement.removeChild(Button2);
            }
        } else {
            Text.classList.add("macOSNotif_TextFull");
            Buttons.parentElement.removeChild(Buttons);
        }
    }

    /**
     * If interactivity is enabled in the options, this starts the interact instanceas part of the run process
     * @private
     */
    __runStartInteract() {
        if (this.__options.interactDismiss) {
            this.__interact = new __macOSNotifJSInteract(this.__container);
            this.__interact.onDismiss(() => {
                this.dismiss();
            }).run();
        }
    }

    /**
     * Registers all the action listeners for the notification when the run process occurs
     * @private
     */
    __runDefineActions() {
        const fullId = this.constructor.__fullId(this.__id);
        // Define these all in window as this is where the HTML template calls to (we don't bind events here)
        window[fullId + "_ButtonImg"] = () => {
            this.__handleGo(this.__options.imageLink, this.__options.imageLinkNewTab, this.__options.imageLinkDismiss, true);
        };
        window[fullId + "_ButtonMain"] = () => {
            this.__handleGo(this.__options.mainLink, this.__options.mainLinkNewTab, this.__options.mainLinkDismiss, true);
        };
        window[fullId + "_Button1"] = () => {
            this.__handleGo(this.__options.btn1Link, this.__options.btn1NewTab, this.__options.btn1Dismiss);
        };
        window[fullId + "_Button2"] = () => {
            this.__handleGo(this.__options.btn2Link, this.__options.btn2NewTab, this.__options.btn2Dismiss);
        };
    }

    /**
     * Starts the auto-dismiss timeout if enabled in the notification options as part of the run process
     * @private
     */
    __runAutoDismiss() {
        if (this.__options.autoDismiss !== 0) {
            // Set the timeout (in window, so user can control if needed)
            window[this.constructor.__fullId(this.__id) + "_AutoDismiss"] = setTimeout(() => {
                this.dismiss();
            }, (this.__options.autoDismiss * 1000) + (this.__options.delay * 1000));
        }
    }

    /**
     * Shows the notification on the web-page during the run process, triggering the sound if needed
     * @private
     */
    __runShowNotification() {
        setTimeout(() => {
            // Stop overlapping
            this.constructor.__updatePosAll();

            // Do sound
            if (this.__options.sounds) this.constructor.__generateAudio().play();

            // Show
            this.__container.style.right = "15px";
            this.__container.style.opacity = "1";
        }, this.__options.delay * 1000);
    }

    /**
     * Exports the notification instance to the local store and to the window object during the run process
     * @private
     */
    __runStoreNotification() {
        __macOSNotifJSNotifs[this.__id] = this;
        window[this.constructor.__fullId(this.__id)] = this;
    }

    /**
     * Runs the notification!
     */
    run() {
        // Only ever run once
        if (this.__id !== null) return;

        // Template into DOM with container ID
        this.__runInitialContainer();

        // Apply theme
        this.__runApplyTheming();

        // Apply user defined options
        this.__runApplyOptions();

        // Interact dismiss
        this.__runStartInteract();

        // Set the actions
        this.__runDefineActions();

        // Set auto-dismiss
        this.__runAutoDismiss();

        // Handle show
        this.__runShowNotification();

        // Store
        this.__runStoreNotification();
    }
}

// Provide theme data to users through the window (ensure a copy, not reference)
window.macOSNotifThemes = Object.assign({}, __macOSNotifJSThemes);

// Allow setting & getting of FadeThreshold
Object.defineProperty(window, "macOSNotifFadeThreshold", {
    get: () => {
        return __macOSNotifJSFadeThreshold;
    },
    set: x => {
        __macOSNotifJSFadeThreshold = x;
    },
});

// Expose raw class to window for static method access
window.macOSNotifJS = macOSNotifJS;

// Allow access to create new notif
window.macOSNotif = options => {
    // A quick method for generating a full instance of macOSNotifJS and running it
    const thisNotif = new macOSNotifJS(options);
    thisNotif.run();
    return thisNotif;
};