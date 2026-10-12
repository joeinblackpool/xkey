<?php
/**
 * Admin page, scanning and fixing for XKey SEO Fixer.
 *
 * @package XKey_SEO_Fixer
 */

defined( 'ABSPATH' ) || exit;

/**
 * Main plugin class. Everything is static: there is no state to keep.
 */
class XKey_SEO_Fixer {

	const PER_BATCH = 200;
	const PAGE_SLUG = 'xkey-seo-fixer';
	const OWN_META  = '_xkey_meta_description';
	const TYPES     = array( 'images', 'descriptions', 'headings', 'links' );

	/**
	 * Per-request cache of internal link checks.
	 *
	 * @var array
	 */
	private static $link_cache = array();

	/**
	 * Hooks.
	 */
	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'add_page' ) );
		add_action( 'admin_post_xkey_sf_fix', array( __CLASS__, 'handle_fix' ) );
		add_action( 'wp_head', array( __CLASS__, 'output_meta_description' ), 1 );
	}

	/**
	 * Tools → XKey SEO Fixer.
	 */
	public static function add_page() {
		add_management_page(
			__( 'XKey SEO Fixer', 'xkey-seo-fixer' ),
			__( 'XKey SEO Fixer', 'xkey-seo-fixer' ),
			'manage_options',
			self::PAGE_SLUG,
			array( __CLASS__, 'render_page' )
		);
	}

	/**
	 * Active SEO plugin: yoast, rankmath, seopress, aioseo or '' for none.
	 *
	 * @return string
	 */
	public static function seo_plugin() {
		if ( defined( 'WPSEO_VERSION' ) ) {
			return 'yoast';
		}
		if ( defined( 'RANK_MATH_VERSION' ) || class_exists( 'RankMath' ) ) {
			return 'rankmath';
		}
		if ( defined( 'SEOPRESS_VERSION' ) ) {
			return 'seopress';
		}
		if ( defined( 'AIOSEO_VERSION' ) || function_exists( 'aioseo' ) ) {
			return 'aioseo';
		}
		return '';
	}

	/**
	 * Meta key holding the description for an SEO plugin ('' = do not write).
	 *
	 * @param string $plugin Value from seo_plugin().
	 * @return string
	 */
	private static function description_key( $plugin ) {
		$keys = array(
			'yoast'    => '_yoast_wpseo_metadesc',
			'rankmath' => 'rank_math_description',
			'seopress' => '_seopress_titles_desc',
			''         => self::OWN_META,
		);
		return isset( $keys[ $plugin ] ) ? $keys[ $plugin ] : '';
	}

	/**
	 * Prints our own meta description, only when no SEO plugin is active.
	 */
	public static function output_meta_description() {
		static $done = false;
		if ( $done || ! is_singular() || '' !== self::seo_plugin() ) {
			return;
		}
		$desc = trim( (string) get_post_meta( get_queried_object_id(), self::OWN_META, true ) );
		if ( '' === $desc ) {
			return;
		}
		$done = true;
		echo '<meta name="description" content="' . esc_attr( $desc ) . '" />' . "\n";
	}

	/**
	 * Public post types except attachments.
	 *
	 * @return string[]
	 */
	private static function post_types() {
		$types = get_post_types( array( 'public' => true ) );
		unset( $types['attachment'] );
		return array_values( $types );
	}

	/**
	 * Scans one batch of published content (and media library images).
	 *
	 * @param int    $batch Batch number, from 1.
	 * @param string $only  Limit to one issue type.
	 * @return array
	 */
	private static function scan( $batch, $only = '' ) {
		$posts = new WP_Query(
			array(
				'post_type'              => self::post_types(),
				'post_status'            => 'publish',
				'posts_per_page'         => self::PER_BATCH,
				'paged'                  => $batch,
				'orderby'                => 'ID',
				'order'                  => 'ASC',
				'ignore_sticky_posts'    => true,
				'update_post_term_cache' => false,
			)
		);
		$issues = array_fill_keys( self::TYPES, array() );
		$pages  = (int) $posts->max_num_pages;

		if ( ! $only || 'images' === $only ) {
			$atts = new WP_Query(
				array(
					'post_type'      => 'attachment',
					'post_status'    => 'inherit',
					'post_mime_type' => 'image',
					'posts_per_page' => self::PER_BATCH,
					'paged'          => $batch,
					'orderby'        => 'ID',
					'order'          => 'ASC',
					'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
						'relation' => 'OR',
						array(
							'key'     => '_wp_attachment_image_alt',
							'compare' => 'NOT EXISTS',
						),
						array(
							'key'   => '_wp_attachment_image_alt',
							'value' => '',
						),
					),
				)
			);
			$pages            = max( $pages, (int) $atts->max_num_pages );
			$issues['images'] = array_merge( self::scan_attachments( $atts->posts ), self::scan_content_images( self::editable( $posts->posts ) ) );
		}
		foreach ( array( 'descriptions', 'headings', 'links' ) as $type ) {
			if ( ! $only || $type === $only ) {
				$list            = 'descriptions' === $type ? $posts->posts : self::editable( $posts->posts );
				$issues[ $type ] = call_user_func( array( __CLASS__, 'scan_' . $type ), $list );
			}
		}
		return array(
			'issues' => $issues,
			'pages'  => max( 1, $pages ),
			'total'  => (int) $posts->found_posts,
		);
	}

	/**
	 * Posts whose content is kept by a page builder (Elementor) rather than
	 * post_content; editing post_content there would have no visible effect.
	 *
	 * @param WP_Post[] $posts Posts.
	 * @return WP_Post[]
	 */
	private static function editable( $posts ) {
		return array_filter(
			$posts,
			function ( $post ) {
				return 'builder' !== get_post_meta( $post->ID, '_elementor_edit_mode', true );
			}
		);
	}

	/**
	 * One issue row.
	 *
	 * @param string  $key      Unique key used by the checkboxes.
	 * @param WP_Post $post     Post or attachment.
	 * @param string  $problem  What is wrong (plain text).
	 * @param string  $proposed Proposed fix ('' = needs a human).
	 * @param array   $data     Data the fix needs.
	 * @return array
	 */
	private static function issue( $key, $post, $problem, $proposed, $data = array() ) {
		$title = get_the_title( $post );
		return array(
			'key'      => $key,
			'post_id'  => $post->ID,
			'title'    => '' !== $title ? $title : __( '(no title)', 'xkey-seo-fixer' ),
			'edit'     => get_edit_post_link( $post->ID, 'raw' ),
			'problem'  => $problem,
			'proposed' => $proposed,
			'fixable'  => '' !== $proposed,
			'data'     => $data,
		);
	}

	/**
	 * Media library images with no alt text.
	 *
	 * @param WP_Post[] $atts Attachments.
	 * @return array
	 */
	private static function scan_attachments( $atts ) {
		$out = array();
		foreach ( $atts as $att ) {
			$alt   = xkey_sf_alt_from_title( $att->post_title );
			$out[] = self::issue( 'att:' . $att->ID, $att, __( 'Media library image with no alt text', 'xkey-seo-fixer' ), $alt, array( 'alt' => $alt ) );
		}
		return $out;
	}

	/**
	 * <img> tags in content with a missing or empty alt attribute.
	 *
	 * @param WP_Post[] $posts Posts.
	 * @return array
	 */
	private static function scan_content_images( $posts ) {
		$out = array();
		foreach ( $posts as $post ) {
			foreach ( xkey_sf_find_img_tags( $post->post_content ) as $tag ) {
				if ( 'present' === xkey_sf_img_alt_state( $tag ) ) {
					continue;
				}
				$alt    = '';
				$att_id = xkey_sf_img_attachment_id( $tag );
				if ( $att_id && 'attachment' === get_post_type( $att_id ) ) {
					$alt = trim( (string) get_post_meta( $att_id, '_wp_attachment_image_alt', true ) );
					if ( '' === $alt ) {
						$alt = xkey_sf_alt_from_title( get_post_field( 'post_title', $att_id, 'raw' ) );
					}
				}
				/* translators: %s: image file name */
				$problem = sprintf( __( 'Image in content with no alt text: %s', 'xkey-seo-fixer' ), wp_basename( (string) xkey_sf_get_attr( $tag, 'src' ) ) );
				$out[]   = self::issue( 'img:' . $post->ID . ':' . md5( $tag ), $post, $problem, $alt, array( 'tag' => $tag, 'alt' => $alt ) );
			}
		}
		return $out;
	}

	/**
	 * Published content with no meta description.
	 *
	 * @param WP_Post[] $posts Posts.
	 * @return array
	 */
	private static function scan_descriptions( $posts ) {
		$key = self::description_key( self::seo_plugin() );
		$out = array();
		if ( '' === $key ) {
			return $out;
		}
		foreach ( $posts as $post ) {
			if ( '' !== trim( (string) get_post_meta( $post->ID, $key, true ) ) ) {
				continue;
			}
			$source = '' !== trim( $post->post_excerpt ) ? $post->post_excerpt : $post->post_content;
			$desc   = xkey_sf_make_description( strip_shortcodes( $source ) );
			if ( xkey_sf_strlen( $desc ) < 50 ) {
				$desc = ''; // Too little text to write a useful description from.
			}
			$out[] = self::issue( 'desc:' . $post->ID, $post, __( 'No meta description', 'xkey-seo-fixer' ), $desc, array( 'desc' => $desc ) );
		}
		return $out;
	}

	/**
	 * Content containing <h1> headings.
	 *
	 * @param WP_Post[] $posts Posts.
	 * @return array
	 */
	private static function scan_headings( $posts ) {
		$out = array();
		foreach ( $posts as $post ) {
			$count = xkey_sf_count_h1( $post->post_content );
			if ( ! $count ) {
				continue;
			}
			/* translators: 1: number of H1 headings, 2: their text */
			$problem = sprintf( _n( '%1$d H1 in content: %2$s', '%1$d H1s in content: %2$s', $count, 'xkey-seo-fixer' ), $count, implode( ' | ', xkey_sf_h1_texts( $post->post_content ) ) );
			$out[]   = self::issue( 'h1:' . $post->ID, $post, $problem, __( 'Change to H2 (the theme already shows the title as the H1)', 'xkey-seo-fixer' ) );
		}
		return $out;
	}

	/**
	 * Internal links that do not resolve to anything on the site.
	 *
	 * @param WP_Post[] $posts Posts.
	 * @return array
	 */
	private static function scan_links( $posts ) {
		$host = (string) wp_parse_url( home_url(), PHP_URL_HOST );
		$out  = array();
		foreach ( $posts as $post ) {
			foreach ( xkey_sf_find_links( $post->post_content ) as $href ) {
				if ( ! xkey_sf_is_internal_url( $href, $host ) ) {
					continue;
				}
				$result = self::check_link( $href );
				if ( true === $result ) {
					continue;
				}
				/* translators: %s: link address */
				$problem = sprintf( __( 'Broken internal link: %s', 'xkey-seo-fixer' ), $href );
				$out[]   = self::issue( 'link:' . $post->ID . ':' . md5( $href ), $post, $problem, $result, array( 'href' => $href, 'new' => $result ) );
			}
		}
		return $out;
	}

	/**
	 * Checks an internal link without any HTTP request.
	 *
	 * @param string $href Raw href.
	 * @return true|string True when it resolves, otherwise a suggested URL or ''.
	 */
	private static function check_link( $href ) {
		if ( isset( self::$link_cache[ $href ] ) ) {
			return self::$link_cache[ $href ];
		}
		self::$link_cache[ $href ] = self::resolve_link( $href );
		return self::$link_cache[ $href ];
	}

	/**
	 * Does the work for check_link().
	 *
	 * @param string $href Raw href.
	 * @return true|string
	 */
	private static function resolve_link( $href ) {
		$url  = html_entity_decode( trim( $href ), ENT_QUOTES, 'UTF-8' );
		$home = wp_parse_url( home_url() );
		if ( 0 === strpos( $url, '//' ) ) {
			$url = $home['scheme'] . ':' . $url;
		} elseif ( '/' === $url[0] ) {
			$url = $home['scheme'] . '://' . $home['host'] . ( isset( $home['port'] ) ? ':' . $home['port'] : '' ) . $url;
		}
		$path = rawurldecode( (string) wp_parse_url( $url, PHP_URL_PATH ) );

		// Files on disk: uploads first, then the rest of wp-content.
		$uploads = wp_upload_dir( null, false );
		foreach ( array( array( $uploads['baseurl'], $uploads['basedir'] ), array( content_url(), WP_CONTENT_DIR ) ) as $map ) {
			$base = untrailingslashit( (string) wp_parse_url( $map[0], PHP_URL_PATH ) );
			if ( '' !== $base && 0 === strpos( $path, $base . '/' ) ) {
				$file = realpath( $map[1] . substr( $path, strlen( $base ) ) );
				$root = realpath( $map[1] );
				return ( $file && $root && 0 === strpos( $file, $root ) && is_file( $file ) ) ? true : '';
			}
		}

		$home_path = untrailingslashit( isset( $home['path'] ) ? $home['path'] : '' );
		$rel       = ( '' !== $home_path && 0 === strpos( $path, $home_path ) ) ? substr( $path, strlen( $home_path ) ) : $path;
		$rel       = preg_replace( '#/(?:page/\d+|comment-page-\d+|feed|amp|embed|trackback)/?$#', '', '/' . trim( $rel, '/' ) );
		$rel       = '/' . trim( $rel, '/' );

		if ( '/' === $rel || preg_match( '#^/(?:wp-admin|wp-login\.php|wp-json|wp-includes|wp-sitemap|xmlrpc\.php|feed|comments)(?:/|$)#', $rel ) ) {
			return true;
		}
		if ( url_to_postid( $url ) ) {
			return true;
		}
		if ( preg_match( '#^/\d{4}(?:/\d{2}){0,2}$#', $rel ) ) {
			return true; // Date archive.
		}
		if ( preg_match( '/\.([a-z0-9]{2,5})$/i', $rel, $ext ) && ! in_array( strtolower( $ext[1] ), array( 'html', 'htm', 'php' ), true ) ) {
			// A file outside wp-content: exists on disk, or a virtual file such as robots.txt or a sitemap.
			return ( is_file( ABSPATH . ltrim( $rel, '/' ) ) || in_array( strtolower( $ext[1] ), array( 'xml', 'txt' ), true ) ) ? true : '';
		}

		$segments = explode( '/', trim( $rel, '/' ) );
		$last     = end( $segments );
		foreach ( get_taxonomies( array( 'public' => true ), 'objects' ) as $tax ) {
			$slug = ( is_array( $tax->rewrite ) && ! empty( $tax->rewrite['slug'] ) ) ? trim( $tax->rewrite['slug'], '/' ) : '';
			if ( '' !== $slug && 0 === strpos( trim( $rel, '/' ), $slug . '/' ) && term_exists( $last, $tax->name ) ) {
				return true;
			}
		}
		global $wp_rewrite;
		$author_base = ( $wp_rewrite && $wp_rewrite->author_base ) ? $wp_rewrite->author_base : 'author';
		if ( 2 === count( $segments ) && $author_base === $segments[0] && get_user_by( 'slug', $segments[1] ) ) {
			return true;
		}
		foreach ( get_post_types( array( 'public' => true, '_builtin' => false ) ) as $type ) {
			$link = get_post_type_archive_link( $type );
			if ( $link && untrailingslashit( (string) wp_parse_url( $link, PHP_URL_PATH ) ) === untrailingslashit( $path ) ) {
				return true;
			}
		}
		if ( get_page_by_path( trim( $rel, '/' ), OBJECT, self::post_types() ) ) {
			return true;
		}

		// Broken. Suggest a published post with the same slug, if there is one.
		$slug = sanitize_title( xkey_sf_slug_from_path( $rel ) );
		if ( '' !== $slug ) {
			$found = get_posts(
				array(
					'name'        => $slug,
					'post_type'   => self::post_types(),
					'post_status' => 'publish',
					'numberposts' => 1,
					'fields'      => 'ids',
				)
			);
			if ( $found ) {
				return (string) get_permalink( $found[0] );
			}
		}
		return '';
	}

	/**
	 * Handles the fix forms (admin-post.php?action=xkey_sf_fix).
	 */
	public static function handle_fix() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Sorry, you are not allowed to do that.', 'xkey-seo-fixer' ), 403 );
		}
		check_admin_referer( 'xkey_sf_fix' );

		$type     = isset( $_POST['xkey_sf_type'] ) ? sanitize_key( wp_unslash( $_POST['xkey_sf_type'] ) ) : '';
		$mode     = isset( $_POST['xkey_sf_mode'] ) ? sanitize_key( wp_unslash( $_POST['xkey_sf_mode'] ) ) : '';
		$batch    = isset( $_POST['xkey_sf_batch'] ) ? max( 1, absint( $_POST['xkey_sf_batch'] ) ) : 1;
		$selected = isset( $_POST['xkey_sf_items'] ) ? array_map( 'sanitize_text_field', (array) wp_unslash( $_POST['xkey_sf_items'] ) ) : array();
		if ( ! in_array( $type, self::TYPES, true ) || ! in_array( $mode, array( 'selected', 'all', 'unlink' ), true ) ) {
			wp_die( esc_html__( 'Unknown request.', 'xkey-seo-fixer' ), 400 );
		}

		$scan = self::scan( $batch, $type );
		$todo = array();
		foreach ( $scan['issues'][ $type ] as $issue ) {
			if ( 'all' === $mode ? $issue['fixable'] : in_array( $issue['key'], $selected, true ) ) {
				$todo[] = $issue;
			}
		}
		$result = self::apply( $type, $todo, 'unlink' === $mode );

		wp_safe_redirect(
			add_query_arg(
				array(
					'page'            => self::PAGE_SLUG,
					'batch'           => $batch,
					'xkey_sf_fixed'   => $result[0],
					'xkey_sf_skipped' => $result[1],
				),
				admin_url( 'tools.php' )
			) . '#xkey-sf-' . $type
		);
		exit;
	}

	/**
	 * Applies fixes. Content edits are grouped so each post is saved once.
	 *
	 * @param string $type   Issue type.
	 * @param array  $issues Issues to fix.
	 * @param bool   $unlink Remove the links instead of replacing them.
	 * @return int[] Fixed count, skipped count.
	 */
	private static function apply( $type, $issues, $unlink ) {
		$fixed     = 0;
		$skipped   = 0;
		$originals = array();
		$contents  = array();
		$changes   = array();
		$meta_key  = self::description_key( self::seo_plugin() );

		foreach ( $issues as $issue ) {
			$id = $issue['post_id'];
			$d  = $issue['data'];
			if ( ( ! $issue['fixable'] && ! ( $unlink && 'links' === $type ) ) || ! current_user_can( 'edit_post', $id ) ) {
				++$skipped;
				continue;
			}
			if ( 0 === strpos( $issue['key'], 'att:' ) ) {
				update_post_meta( $id, '_wp_attachment_image_alt', wp_slash( $d['alt'] ) );
				++$fixed;
				continue;
			}
			if ( 'descriptions' === $type ) {
				if ( '' === $meta_key ) {
					++$skipped;
					continue;
				}
				update_post_meta( $id, $meta_key, wp_slash( $d['desc'] ) );
				++$fixed;
				continue;
			}
			if ( ! isset( $contents[ $id ] ) ) {
				$originals[ $id ] = (string) get_post_field( 'post_content', $id, 'raw' );
				$contents[ $id ]  = $originals[ $id ];
			}
			$before = $contents[ $id ];
			if ( 'images' === $type ) {
				$contents[ $id ] = str_replace( $d['tag'], xkey_sf_set_attr( $d['tag'], 'alt', $d['alt'] ), $before );
			} elseif ( 'headings' === $type ) {
				$contents[ $id ] = xkey_sf_demote_h1( $before );
			} elseif ( 'links' === $type ) {
				$contents[ $id ] = $unlink ? xkey_sf_unlink_href( $before, $d['href'] ) : xkey_sf_replace_href( $before, $d['href'], $d['new'] );
			}
			if ( $contents[ $id ] !== $before ) {
				++$fixed;
				$changes[ $id ] = isset( $changes[ $id ] ) ? $changes[ $id ] + 1 : 1;
			} else {
				++$skipped;
			}
		}

		foreach ( $contents as $id => $content ) {
			if ( $content !== $originals[ $id ] && ! self::save_content( $id, $content ) ) {
				$fixed   -= $changes[ $id ];
				$skipped += $changes[ $id ];
			}
		}
		return array( $fixed, $skipped );
	}

	/**
	 * Saves post content through wp_update_post so WordPress keeps a revision.
	 *
	 * @param int    $id      Post ID.
	 * @param string $content New content.
	 * @return bool
	 */
	private static function save_content( $id, $content ) {
		// Make sure the current version is stored as a revision before we change it
		// (does nothing if it already is, or if the post type has no revisions).
		wp_save_post_revision( $id );

		// The content is already-saved content plus our escaped edits. Turn the
		// HTML filter off for this one save so it cannot strip anything else.
		$kses = false !== has_filter( 'content_save_pre', 'wp_filter_post_kses' );
		if ( $kses ) {
			kses_remove_filters();
		}
		$result = wp_update_post(
			wp_slash(
				array(
					'ID'           => $id,
					'post_content' => $content,
				)
			),
			true
		);
		if ( $kses ) {
			kses_init_filters();
		}
		return ! is_wp_error( $result ) && $result;
	}

	/**
	 * Labels for each issue type.
	 *
	 * @return array
	 */
	private static function labels() {
		return array(
			'images'       => __( 'Images missing alt text', 'xkey-seo-fixer' ),
			'descriptions' => __( 'Missing meta descriptions', 'xkey-seo-fixer' ),
			'headings'     => __( 'Extra H1 headings in content', 'xkey-seo-fixer' ),
			'links'        => __( 'Broken internal links', 'xkey-seo-fixer' ),
		);
	}

	/**
	 * Renders Tools → XKey SEO Fixer.
	 */
	public static function render_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		// phpcs:disable WordPress.Security.NonceVerification.Recommended -- Read-only display values.
		$batch   = isset( $_GET['batch'] ) ? max( 1, absint( $_GET['batch'] ) ) : 1;
		$fixed   = isset( $_GET['xkey_sf_fixed'] ) ? absint( $_GET['xkey_sf_fixed'] ) : null;
		$skipped = isset( $_GET['xkey_sf_skipped'] ) ? absint( $_GET['xkey_sf_skipped'] ) : 0;
		// phpcs:enable
		$scan   = self::scan( $batch );
		$labels = self::labels();
		$plugin = self::seo_plugin();
		$names  = array(
			'yoast'    => 'Yoast SEO',
			'rankmath' => 'Rank Math',
			'seopress' => 'SEOPress',
			'aioseo'   => 'All in One SEO',
		);
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'XKey SEO Fixer', 'xkey-seo-fixer' ); ?></h1>
			<?php if ( null !== $fixed ) : ?>
				<div class="notice notice-success is-dismissible"><p>
					<?php
					/* translators: 1: number fixed, 2: number skipped */
					echo esc_html( sprintf( __( 'Fixed: %1$d. Skipped: %2$d.', 'xkey-seo-fixer' ), $fixed, $skipped ) );
					?>
				</p></div>
			<?php endif; ?>
			<p><?php esc_html_e( 'This page finds common on-site SEO problems in your published content and offers a fix for each one. Nothing changes until you tick items and click a button. Items marked "needs a human" are listed so you can fix them yourself.', 'xkey-seo-fixer' ); ?></p>
			<p><a class="button" href="<?php echo esc_url( 'https://xkey.co.uk/?url=' . rawurlencode( home_url( '/' ) ) ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'Check your site on XKey', 'xkey-seo-fixer' ); ?></a></p>
			<p><?php esc_html_e( 'WordPress keeps a revision of every post this plugin changes, so you can undo a change from the post\'s Revisions screen. Alt text and meta descriptions are not part of revisions; you can edit them as normal.', 'xkey-seo-fixer' ); ?></p>
			<?php if ( defined( 'WP_POST_REVISIONS' ) && ! WP_POST_REVISIONS ) : ?>
				<div class="notice notice-warning inline"><p><?php esc_html_e( 'Revisions are turned off on this site (WP_POST_REVISIONS), so content changes cannot be undone from the Revisions screen. Take a backup first.', 'xkey-seo-fixer' ); ?></p></div>
			<?php endif; ?>
			<p>
				<?php
				echo esc_html(
					'' === $plugin
						? __( 'No SEO plugin detected: meta descriptions are saved by this plugin and added to the page head.', 'xkey-seo-fixer' )
						/* translators: %s: SEO plugin name */
						: sprintf( __( 'SEO plugin detected: %s.', 'xkey-seo-fixer' ), $names[ $plugin ] )
				);
				?>
			</p>

			<h2><?php esc_html_e( 'Summary', 'xkey-seo-fixer' ); ?></h2>
			<p>
				<?php
				/* translators: 1: batch number, 2: number of batches, 3: batch size, 4: total published items */
				echo esc_html( sprintf( __( 'Batch %1$d of %2$d: up to %3$d of your %4$d published items, plus up to %3$d media library images without alt text.', 'xkey-seo-fixer' ), $batch, $scan['pages'], self::PER_BATCH, $scan['total'] ) );
				?>
			</p>
			<table class="widefat striped" style="max-width:640px">
				<thead><tr><th><?php esc_html_e( 'Issue', 'xkey-seo-fixer' ); ?></th><th><?php esc_html_e( 'Can fix', 'xkey-seo-fixer' ); ?></th><th><?php esc_html_e( 'Needs a human', 'xkey-seo-fixer' ); ?></th></tr></thead>
				<tbody>
				<?php foreach ( $labels as $type => $label ) : ?>
					<?php $can = count( wp_list_filter( $scan['issues'][ $type ], array( 'fixable' => true ) ) ); ?>
					<tr>
						<td><a href="#xkey-sf-<?php echo esc_attr( $type ); ?>"><?php echo esc_html( $label ); ?></a></td>
						<td><?php echo esc_html( number_format_i18n( $can ) ); ?></td>
						<td><?php echo esc_html( number_format_i18n( count( $scan['issues'][ $type ] ) - $can ) ); ?></td>
					</tr>
				<?php endforeach; ?>
				</tbody>
			</table>
			<?php
			self::render_pagination( $batch, $scan['pages'] );
			foreach ( $labels as $type => $label ) {
				self::render_section( $type, $label, $scan['issues'][ $type ], $batch, $plugin );
			}
			self::render_pagination( $batch, $scan['pages'] );
			?>
		</div>
		<?php
	}

	/**
	 * Previous / next batch links.
	 *
	 * @param int $batch Current batch.
	 * @param int $pages Number of batches.
	 */
	private static function render_pagination( $batch, $pages ) {
		if ( $pages < 2 ) {
			return;
		}
		$url = admin_url( 'tools.php?page=' . self::PAGE_SLUG );
		echo '<p class="tablenav-pages">';
		if ( $batch > 1 ) {
			echo '<a class="button" href="' . esc_url( add_query_arg( 'batch', $batch - 1, $url ) ) . '">' . esc_html__( '« Previous batch', 'xkey-seo-fixer' ) . '</a> ';
		}
		if ( $batch < $pages ) {
			echo '<a class="button" href="' . esc_url( add_query_arg( 'batch', $batch + 1, $url ) ) . '">' . esc_html__( 'Next batch »', 'xkey-seo-fixer' ) . '</a>';
		}
		echo '</p>';
	}

	/**
	 * One issue table with its buttons.
	 *
	 * @param string $type   Issue type.
	 * @param string $label  Heading.
	 * @param array  $issues Issues.
	 * @param int    $batch  Batch number.
	 * @param string $plugin Active SEO plugin.
	 */
	private static function render_section( $type, $label, $issues, $batch, $plugin ) {
		echo '<h2 id="xkey-sf-' . esc_attr( $type ) . '">' . esc_html( $label ) . '</h2>';
		if ( 'descriptions' === $type && 'aioseo' === $plugin ) {
			echo '<p>' . esc_html__( 'All in One SEO is active. Please use its own bulk editor (All in One SEO → Search Appearance) to add meta descriptions; this plugin does not write to its tables.', 'xkey-seo-fixer' ) . '</p>';
			return;
		}
		if ( ! $issues ) {
			echo '<p>' . esc_html__( 'Nothing found in this batch.', 'xkey-seo-fixer' ) . '</p>';
			return;
		}
		$confirm = esc_js( __( 'Apply this fix to every fixable item of this type in this batch?', 'xkey-seo-fixer' ) );
		?>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<input type="hidden" name="action" value="xkey_sf_fix" />
			<input type="hidden" name="xkey_sf_type" value="<?php echo esc_attr( $type ); ?>" />
			<input type="hidden" name="xkey_sf_batch" value="<?php echo esc_attr( $batch ); ?>" />
			<?php wp_nonce_field( 'xkey_sf_fix' ); ?>
			<table class="wp-list-table widefat fixed striped">
				<thead><tr>
					<td class="manage-column column-cb check-column"><input type="checkbox" aria-label="<?php esc_attr_e( 'Select all', 'xkey-seo-fixer' ); ?>" /></td>
					<th style="width:22%"><?php esc_html_e( 'Item', 'xkey-seo-fixer' ); ?></th>
					<th><?php esc_html_e( 'Problem', 'xkey-seo-fixer' ); ?></th>
					<th><?php esc_html_e( 'Proposed fix', 'xkey-seo-fixer' ); ?></th>
				</tr></thead>
				<tbody>
				<?php foreach ( $issues as $issue ) : ?>
					<tr>
						<th scope="row" class="check-column">
							<?php if ( $issue['fixable'] || 'links' === $type ) : ?>
								<input type="checkbox" name="xkey_sf_items[]" value="<?php echo esc_attr( $issue['key'] ); ?>" />
							<?php endif; ?>
						</th>
						<td>
							<?php if ( $issue['edit'] ) : ?>
								<a href="<?php echo esc_url( $issue['edit'] ); ?>"><?php echo esc_html( $issue['title'] ); ?></a>
							<?php else : ?>
								<?php echo esc_html( $issue['title'] ); ?>
							<?php endif; ?>
						</td>
						<td><?php echo esc_html( $issue['problem'] ); ?></td>
						<td>
							<?php
							if ( ! $issue['fixable'] ) {
								echo '<em>' . esc_html__( 'Needs a human', 'xkey-seo-fixer' ) . '</em>';
							} elseif ( 'descriptions' === $type ) {
								/* translators: %d: number of characters */
								echo esc_html( $issue['proposed'] ) . ' <span class="description">(' . esc_html( sprintf( __( '%d characters', 'xkey-seo-fixer' ), xkey_sf_strlen( $issue['proposed'] ) ) ) . ')</span>';
							} elseif ( 'images' === $type ) {
								echo 'alt="' . esc_html( $issue['proposed'] ) . '"';
							} elseif ( 'links' === $type ) {
								/* translators: %s: new link address */
								echo esc_html( sprintf( __( 'Point the link to %s', 'xkey-seo-fixer' ), $issue['proposed'] ) );
							} else {
								echo esc_html( $issue['proposed'] );
							}
							?>
						</td>
					</tr>
				<?php endforeach; ?>
				</tbody>
			</table>
			<p>
				<button type="submit" name="xkey_sf_mode" value="selected" class="button button-primary"><?php esc_html_e( 'Fix selected', 'xkey-seo-fixer' ); ?></button>
				<button type="submit" name="xkey_sf_mode" value="all" class="button" onclick="return confirm('<?php echo $confirm; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped with esc_js above. ?>');"><?php esc_html_e( 'Fix all of this type', 'xkey-seo-fixer' ); ?></button>
				<?php if ( 'links' === $type ) : ?>
					<button type="submit" name="xkey_sf_mode" value="unlink" class="button"><?php esc_html_e( 'Unlink selected, keep text', 'xkey-seo-fixer' ); ?></button>
				<?php endif; ?>
			</p>
		</form>
		<?php
	}
}
