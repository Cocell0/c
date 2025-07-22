/**
  - Adds all plugins to the global `window.plugin` object
  - This is used to ensure that plugins are available globally in the browser environment
*/
window.plugins = {}
$plugins.$allKeys.forEach(key => {
  window.plugin[key] = $plugin[key]
})
