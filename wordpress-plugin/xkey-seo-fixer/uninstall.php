<?php
/**
 * Removes XKey SEO Fixer's own options when the plugin is deleted.
 *
 * Meta descriptions saved under _xkey_meta_description, alt text and content
 * fixes are deliberately kept: they are your site's content, not settings.
 *
 * @package XKey_SEO_Fixer
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

delete_option( 'xkey_sf_version' );

if ( is_multisite() ) {
	foreach ( get_sites(
		array(
			'fields' => 'ids',
			'number' => 0,
		)
	) as $xkey_sf_site_id ) {
		switch_to_blog( $xkey_sf_site_id );
		delete_option( 'xkey_sf_version' );
		restore_current_blog();
	}
}
