<?php
/**
 * Pure string transforms used by XKey SEO Fixer.
 *
 * Nothing in this file depends on WordPress, so it can be tested with plain PHP
 * (see wordpress-plugin/test/run.php). Every function changes only the exact
 * tag or attribute it targets and leaves the rest of the content byte-for-byte.
 *
 * @package XKey_SEO_Fixer
 */

if ( ! defined( 'ABSPATH' ) && ! defined( 'XKEY_SF_TESTING' ) ) {
	exit;
}

/**
 * Multibyte-safe string length.
 *
 * @param string $s String.
 * @return int
 */
function xkey_sf_strlen( $s ) {
	return function_exists( 'mb_strlen' ) ? mb_strlen( $s, 'UTF-8' ) : strlen( $s );
}

/**
 * Multibyte-safe substring.
 *
 * @param string $s      String.
 * @param int    $start  Start.
 * @param int    $length Length.
 * @return string
 */
function xkey_sf_substr( $s, $start, $length ) {
	return function_exists( 'mb_substr' ) ? mb_substr( $s, $start, $length, 'UTF-8' ) : substr( $s, $start, $length );
}

/**
 * Reads an attribute value from a single HTML opening tag.
 *
 * @param string $tag  Opening tag, e.g. <img ...>.
 * @param string $name Attribute name.
 * @return string|null Raw value, '' for a bare attribute, null when absent.
 */
function xkey_sf_get_attr( $tag, $name ) {
	$n = preg_quote( $name, '/' );
	if ( preg_match( '/\s' . $n . '\s*=\s*(?:"([^"]*)"|\'([^\']*)\'|([^\s"\'>]+))/i', $tag, $m ) ) {
		return isset( $m[3] ) ? $m[3] : ( isset( $m[2] ) && '' !== $m[2] ? $m[2] : $m[1] );
	}
	if ( preg_match( '/\s' . $n . '(?=[\s\/>])/i', $tag ) ) {
		return '';
	}
	return null;
}

/**
 * Sets (or adds) an attribute on a single HTML opening tag, touching nothing else.
 *
 * @param string $tag   Opening tag.
 * @param string $name  Attribute name.
 * @param string $value Unescaped value.
 * @return string
 */
function xkey_sf_set_attr( $tag, $name, $value ) {
	$attr = ' ' . $name . '="' . htmlspecialchars( $value, ENT_QUOTES, 'UTF-8' ) . '"';
	$n    = preg_quote( $name, '/' );
	$re   = '/\s' . $n . '(?:\s*=\s*(?:"[^"]*"|\'[^\']*\'|[^\s"\'>]+))?(?=[\s\/>])/i';
	if ( preg_match( $re, $tag ) ) {
		return preg_replace_callback(
			$re,
			function () use ( $attr ) {
				return $attr;
			},
			$tag,
			1
		);
	}
	return preg_replace_callback(
		'/^<[a-z0-9]+/i',
		function ( $m ) use ( $attr ) {
			return $m[0] . $attr;
		},
		$tag,
		1
	);
}

/**
 * Returns every distinct <img> tag in some content.
 *
 * @param string $content HTML.
 * @return string[]
 */
function xkey_sf_find_img_tags( $content ) {
	preg_match_all( '/<img\b[^>]*>/i', $content, $m );
	return array_values( array_unique( $m[0] ) );
}

/**
 * Alt text state of an <img> tag.
 *
 * @param string $tag Image tag.
 * @return string 'missing', 'empty' or 'present'.
 */
function xkey_sf_img_alt_state( $tag ) {
	$alt = xkey_sf_get_attr( $tag, 'alt' );
	if ( null === $alt ) {
		return 'missing';
	}
	return '' === trim( html_entity_decode( $alt, ENT_QUOTES, 'UTF-8' ) ) ? 'empty' : 'present';
}

/**
 * Attachment ID from the wp-image-123 class WordPress adds to inserted images.
 *
 * @param string $tag Image tag.
 * @return int 0 when unknown.
 */
function xkey_sf_img_attachment_id( $tag ) {
	$class = (string) xkey_sf_get_attr( $tag, 'class' );
	return preg_match( '/(?:^|\s)wp-image-(\d+)(?:\s|$)/', $class, $m ) ? (int) $m[1] : 0;
}

/**
 * Turns an attachment title into usable alt text.
 *
 * Returns '' when the title looks like a camera, phone or screenshot file name
 * (IMG_1234, DSC0001, PXL_2023..., "Screenshot 2024-01-01 at 10.00") or a hash,
 * because those need a human to describe the picture.
 *
 * @param string $title Attachment title.
 * @return string
 */
function xkey_sf_alt_from_title( $title ) {
	$t = trim( html_entity_decode( (string) $title, ENT_QUOTES, 'UTF-8' ) );
	$t = preg_replace( '/\.(jpe?g|png|gif|webp|avif|svg|bmp|tiff?|heic|heif)$/i', '', $t );
	$t = preg_replace( '/(?:-scaled|-rotated|-e\d{10,}|-\d+x\d+)+$/i', '', $t );
	$t = trim( preg_replace( '/[\s_\-]+/u', ' ', $t ) );
	if ( '' === $t || preg_match( '/^untitled\b/i', $t ) ) {
		return '';
	}
	$camera = array( 'img', 'image', 'images', 'dsc', 'dscn', 'dscf', 'dcim', 'pxl', 'mvimg', 'gopr', 'dji', 'photo', 'pic', 'picture', 'screenshot', 'screen', 'shot', 'whatsapp', 'scan', 'copy', 'edited', 'final', 'at', 'am', 'pm', 'wa', 'jpg', 'jpeg', 'png' );
	$useful = false;
	foreach ( explode( ' ', $t ) as $word ) {
		if ( preg_match( '/^\p{L}{3,}$/u', $word ) && ! in_array( strtolower( $word ), $camera, true ) ) {
			$useful = true;
			break;
		}
	}
	if ( ! $useful ) {
		return '';
	}
	return function_exists( 'mb_strtoupper' ) ? mb_strtoupper( xkey_sf_substr( $t, 0, 1 ), 'UTF-8' ) . xkey_sf_substr( $t, 1, xkey_sf_strlen( $t ) ) : ucfirst( $t );
}

/**
 * Number of <h1> tags in some content.
 *
 * @param string $content HTML.
 * @return int
 */
function xkey_sf_count_h1( $content ) {
	return (int) preg_match_all( '/<h1(?=[\s>\/])/i', $content );
}

/**
 * Plain text of every <h1> in some content, for previews.
 *
 * @param string $content HTML.
 * @return string[]
 */
function xkey_sf_h1_texts( $content ) {
	preg_match_all( '/<h1(?=[\s>\/])[^>]*>(.*?)<\/h1\s*>/is', $content, $m );
	return array_map(
		function ( $html ) {
			return trim( html_entity_decode( strip_tags( $html ), ENT_QUOTES, 'UTF-8' ) );
		},
		$m[1]
	);
}

/**
 * Changes every <h1> in content to <h2>, including Gutenberg heading blocks.
 *
 * Attributes on the tag are kept. For blocks, "level":1 in the block comment
 * becomes "level":2 so the block still validates in the editor.
 *
 * @param string $content HTML.
 * @return string
 */
function xkey_sf_demote_h1( $content ) {
	$content = preg_replace( '/(<!--\s+wp:heading\s+\{(?:(?!-->).)*?"level"\s*:\s*)1(?=\s*[,}])/s', '${1}2', $content );
	$content = preg_replace( '/<h1(?=[\s>\/])/i', '<h2', $content );
	return preg_replace( '/<\/h1(\s*)>/i', '</h2$1>', $content );
}

/**
 * Plain text from HTML: drops comments, scripts, styles and shortcodes.
 *
 * @param string $html HTML.
 * @return string
 */
function xkey_sf_text_from_html( $html ) {
	$s = preg_replace( '/<!--.*?-->/s', ' ', (string) $html );
	$s = preg_replace( '/<(script|style)\b[^>]*>.*?<\/\1\s*>/is', ' ', $s );
	$s = preg_replace( '/\[\/?[a-zA-Z][\w-]*(?:\s[^\]]*)?\/?\]/', ' ', $s );
	$s = preg_replace( '/<(?:br|\/(?:p|h[1-6]|li|div|td|th|blockquote|figcaption))\b[^>]*>/i', '$0 ', $s );
	$s = html_entity_decode( strip_tags( $s ), ENT_QUOTES, 'UTF-8' );
	return trim( preg_replace( '/[\s\x{00A0}]+/u', ' ', $s ) );
}

/**
 * Builds a meta description: whole sentences up to $max characters, or the
 * text cut at a word boundary with an ellipsis.
 *
 * @param string $html Excerpt or post content.
 * @param int    $max  Maximum characters.
 * @return string
 */
function xkey_sf_make_description( $html, $max = 155 ) {
	$text = xkey_sf_text_from_html( $html );
	if ( xkey_sf_strlen( $text ) <= $max ) {
		return $text;
	}
	$out = '';
	foreach ( preg_split( '/(?<=[.!?])\s+/u', $text ) as $sentence ) {
		$try = '' === $out ? $sentence : $out . ' ' . $sentence;
		if ( xkey_sf_strlen( $try ) > $max ) {
			break;
		}
		$out = $try;
	}
	if ( xkey_sf_strlen( $out ) >= 70 ) {
		return $out;
	}
	$cut   = xkey_sf_substr( $text, 0, $max );
	$space = function_exists( 'mb_strrpos' ) ? mb_strrpos( $cut, ' ', 0, 'UTF-8' ) : strrpos( $cut, ' ' );
	if ( $space > 0 ) {
		$cut = xkey_sf_substr( $cut, 0, $space );
	}
	$cut = preg_replace( '/[\s,;:\-\x{2013}\x{2014}]+$/u', '', $cut );
	return preg_match( '/[.!?]$/', $cut ) ? $cut : $cut . "\u{2026}";
}

/**
 * Every distinct href in <a> tags.
 *
 * @param string $content HTML.
 * @return string[]
 */
function xkey_sf_find_links( $content ) {
	preg_match_all( '/<a\b[^>]*>/i', $content, $m );
	$hrefs = array();
	foreach ( $m[0] as $tag ) {
		$href = xkey_sf_get_attr( $tag, 'href' );
		if ( null !== $href && '' !== trim( $href ) ) {
			$hrefs[] = $href;
		}
	}
	return array_values( array_unique( $hrefs ) );
}

/**
 * Whether an href points at the given host (www. ignored). Root-relative
 * paths count as internal; page-relative ones ("page.html") are skipped.
 *
 * @param string $href Raw href.
 * @param string $host Site host.
 * @return bool
 */
function xkey_sf_is_internal_url( $href, $host ) {
	$href = trim( html_entity_decode( $href, ENT_QUOTES, 'UTF-8' ) );
	if ( '' === $href || '#' === $href[0] || '?' === $href[0] ) {
		return false;
	}
	if ( '/' === $href[0] && ( ! isset( $href[1] ) || '/' !== $href[1] ) ) {
		return true;
	}
	if ( 0 === strpos( $href, '//' ) ) {
		$href = 'http:' . $href;
	}
	$parts = parse_url( $href );
	if ( empty( $parts['host'] ) || empty( $parts['scheme'] ) || ! in_array( strtolower( $parts['scheme'] ), array( 'http', 'https' ), true ) ) {
		return false;
	}
	$strip = function ( $h ) {
		return preg_replace( '/^www\./', '', strtolower( $h ) );
	};
	return $strip( $parts['host'] ) === $strip( $host );
}

/**
 * Last path segment of a URL path, as a slug (extension like .html removed).
 *
 * @param string $path URL path.
 * @return string
 */
function xkey_sf_slug_from_path( $path ) {
	$path = preg_replace( '#/(?:page/\d+|feed|amp)/?$#', '', (string) $path );
	$segs = array_filter( explode( '/', trim( $path, '/' ) ), 'strlen' );
	if ( ! $segs ) {
		return '';
	}
	$slug = rawurldecode( end( $segs ) );
	return strtolower( preg_replace( '/\.(html?|php|aspx?)$/i', '', $slug ) );
}

/**
 * Applies $callback to every <a ...> opening tag whose href equals $href.
 *
 * @param string   $content  HTML.
 * @param string   $href     Exact raw href to match.
 * @param callable $callback Receives (opening tag, rest-of-match array) and returns a replacement.
 * @param bool     $whole    Match the whole element (<a>…</a>) instead of the opening tag.
 * @return string
 */
function xkey_sf_map_links( $content, $href, $callback, $whole = false ) {
	$re = $whole ? '/(<a\b[^>]*>)(.*?)<\/a\s*>/is' : '/(<a\b[^>]*>)/i';
	return preg_replace_callback(
		$re,
		function ( $m ) use ( $href, $callback ) {
			return xkey_sf_get_attr( $m[1], 'href' ) === $href ? $callback( $m ) : $m[0];
		},
		$content
	);
}

/**
 * Replaces one href value with another in matching links only.
 *
 * @param string $content HTML.
 * @param string $old     Exact raw href.
 * @param string $new     New URL.
 * @return string
 */
function xkey_sf_replace_href( $content, $old, $new ) {
	return xkey_sf_map_links(
		$content,
		$old,
		function ( $m ) use ( $new ) {
			return xkey_sf_set_attr( $m[1], 'href', $new );
		}
	);
}

/**
 * Removes links with the given href but keeps their text.
 *
 * @param string $content HTML.
 * @param string $href    Exact raw href.
 * @return string
 */
function xkey_sf_unlink_href( $content, $href ) {
	return xkey_sf_map_links(
		$content,
		$href,
		function ( $m ) {
			return $m[2];
		},
		true
	);
}
