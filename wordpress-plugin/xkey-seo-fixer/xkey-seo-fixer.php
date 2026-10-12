<?php
/**
 * Plugin Name:       XKey SEO Fixer
 * Plugin URI:        https://xkey.co.uk/
 * Description:       Finds common on-site SEO problems (missing alt text, missing meta descriptions, extra H1 headings, broken internal links) and fixes them when you click. Nothing changes without a click.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            XKey
 * Author URI:        https://xkey.co.uk/
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       xkey-seo-fixer
 *
 * @package XKey_SEO_Fixer
 */

defined( 'ABSPATH' ) || exit;

define( 'XKEY_SF_VERSION', '1.0.0' );

require_once __DIR__ . '/includes/transforms.php';
require_once __DIR__ . '/includes/class-xkey-seo-fixer.php';

/**
 * Records the installed version (removed again by uninstall.php).
 */
function xkey_sf_activate() {
	update_option( 'xkey_sf_version', XKEY_SF_VERSION, false );
}
register_activation_hook( __FILE__, 'xkey_sf_activate' );

add_action( 'plugins_loaded', array( 'XKey_SEO_Fixer', 'init' ) );
