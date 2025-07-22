/**
  * - Adds all plugins to the global `window.plugin` object
  * - This is used to ensure that plugins are available globally in the browser environment
*/
window.plugins = {}
$plugins.$allKeys.forEach(key => {
  window.plugin[key] = $plugin[key]
})

/**
 * When running on Perchance, it removes the `__generatorLastEditTime` and `__initWithDataFromParentWindow` parameters
 */
if (window.location.href.includes('perchance.org/')) {
  const url = new URL(window.location.href);
  url.searchParams.delete('__generatorLastEditTime');
  url.searchParams.delete('__initWithDataFromParentWindow');
  history.replaceState(null, '', url);
}