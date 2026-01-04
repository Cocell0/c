/**
 * Adds all plugins to the global `window.plugin` object
 * This is used to ensure that plugins are available globally in the browser environment
 * Defines `window.appName`
 * Cleans up URL params
 */

console.clear();

const appName = window.location.pathname.split("/")[1];
window.plugins = new Proxy(
  {},
  {
    get(target, plugin) {
      if (plugin in target) return target[plugin];
      console.warn(`Plugin "${plugin}" is not available`);
      return () => {}; // Return a noop function so calling it won't throw
    },
  },
);

if (typeof $plugins !== "undefined") {
  $plugins.$allKeys.forEach((key) => {
    window.plugins[key] = $plugins[key];
  });
}

/**
 * When running on Perchance, it removes the `__generatorLastEditTime` and `__initWithDataFromParentWindow` URL parameters
 */
if (window.location.href.includes("perchance.org/")) {
  const url = new URL(window.location.href);
  url.searchParams.delete("__generatorLastEditTime");
  url.searchParams.delete("__initWithDataFromParentWindow");
  history.replaceState(null, "", url);

  console.log("Location includes perchance.org/");
  if (window.location.href.includes(`perchance.org/${appName}`)) {
    // console.log(`Location includes perchance.org/${appName}`)
    const baseElement = document.querySelector("base");

    if (baseElement) {
      baseElement.href = `https://perchance.org/${appName}`;
      // console.log('Base element found', baseElement)
    } else {
      const baseElement = document.createElement("base");
      baseElement.href = `https://perchance.org/${appName}`;

      document.head.prepend(baseElement);
    }
  } else {
    // console.log(`Location does NOT include perchance.org/${appName}`)
    alert(
      `Project location invalid, opening original location:\nperchance.org/${appName}\n\nPlease visit the project GitHub page if you want to fork or contribute.`,
    );
    window.open(`https://perchance.org/${appName}`, "_self");
  }
}
