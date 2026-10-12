<?php
/**
 * Plain-PHP tests for XKey SEO Fixer's string transforms (no WordPress needed).
 *
 * Run: php wordpress-plugin/test/run.php
 */

define( 'XKEY_SF_TESTING', true );

// Stand-ins for the two WordPress helpers transforms.php uses (same behaviour as core).
function wp_strip_all_tags( $text ) {
	$text = preg_replace( '@<(script|style)[^>]*?>.*?</\\1>@si', '', $text );
	return trim( strip_tags( $text ) );
}
function wp_parse_url( $url, $component = -1 ) {
	return parse_url( $url, $component );
}
require __DIR__ . '/../xkey-seo-fixer/includes/transforms.php';

$failures = 0;
$count    = 0;

function check( $name, $actual, $expected ) {
	global $failures, $count;
	++$count;
	if ( $actual === $expected ) {
		return;
	}
	++$failures;
	echo "FAIL: $name\n  expected: " . var_export( $expected, true ) . "\n  actual:   " . var_export( $actual, true ) . "\n";
}

// Alt text from attachment titles.
check( 'title hyphens', xkey_sf_alt_from_title( 'red-brick-house' ), 'Red brick house' );
check( 'title underscores + ext', xkey_sf_alt_from_title( 'blue_front_door.JPG' ), 'Blue front door' );
check( 'title size suffix', xkey_sf_alt_from_title( 'garden-path-1024x768' ), 'Garden path' );
check( 'title scaled', xkey_sf_alt_from_title( 'kitchen-scaled.jpeg' ), 'Kitchen' );
check( 'title IMG_1234', xkey_sf_alt_from_title( 'IMG_1234' ), '' );
check( 'title DSC0001', xkey_sf_alt_from_title( 'DSC0001.jpg' ), '' );
check( 'title PXL', xkey_sf_alt_from_title( 'PXL_20230101_123456789' ), '' );
check( 'title screenshot', xkey_sf_alt_from_title( 'Screenshot 2024-01-01 at 10.00.00' ), '' );
check( 'title whatsapp', xkey_sf_alt_from_title( 'WhatsApp Image 2024-03-02 at 14.22.01' ), '' );
check( 'title hash', xkey_sf_alt_from_title( 'a8f3e9c2b1d4' ), '' );
check( 'title untitled', xkey_sf_alt_from_title( 'Untitled design (3)' ), '' );
check( 'title already nice', xkey_sf_alt_from_title( 'Blackpool Tower at night' ), 'Blackpool Tower at night' );
check( 'title entities', xkey_sf_alt_from_title( 'fish &amp; chips' ), 'Fish & chips' );
check( 'title unicode', xkey_sf_alt_from_title( 'éclair-shop' ), 'Éclair shop' );

// Image tags.
$img = '<img src="/a.jpg" class="alignnone size-full wp-image-42" width="10" height="10" />';
check( 'alt missing', xkey_sf_img_alt_state( $img ), 'missing' );
check( 'alt empty', xkey_sf_img_alt_state( '<img alt="" src="x">' ), 'empty' );
check( 'alt bare', xkey_sf_img_alt_state( '<img alt src="x">' ), 'empty' );
check( 'alt spaces', xkey_sf_img_alt_state( "<img src='x' alt=' '>" ), 'empty' );
check( 'alt present', xkey_sf_img_alt_state( '<img src="x" alt="Dog">' ), 'present' );
check( 'data-alt ignored', xkey_sf_img_alt_state( '<img data-alt="Dog" src="x">' ), 'missing' );
check( 'attachment id', xkey_sf_img_attachment_id( $img ), 42 );
check( 'no attachment id', xkey_sf_img_attachment_id( '<img src="x" class="wp-image-x">' ), 0 );
check( 'add alt', xkey_sf_set_attr( $img, 'alt', 'Red "brick" & house' ), '<img alt="Red &quot;brick&quot; &amp; house" src="/a.jpg" class="alignnone size-full wp-image-42" width="10" height="10" />' );
check( 'replace empty alt', xkey_sf_set_attr( '<img src="x" alt="" class="y">', 'alt', 'Dog' ), '<img src="x" alt="Dog" class="y">' );
check( 'replace bare alt', xkey_sf_set_attr( '<img src="x" alt>', 'alt', 'Dog' ), '<img src="x" alt="Dog">' );
check( 'replace single-quoted alt', xkey_sf_set_attr( "<img alt='' src='x'/>", 'alt', '$1 \\1 cat' ), "<img alt=\"$1 \\1 cat\" src='x'/>" );
$content = "<p>Hi</p>\n<!-- wp:image {\"id\":42} -->\n<figure class=\"wp-block-image\">$img</figure>\n<!-- /wp:image -->\n<img src=\"b.png\" alt=\"Kept\">";
check( 'find imgs', xkey_sf_find_img_tags( $content ), array( $img, '<img src="b.png" alt="Kept">' ) );
check( 'replace tag in content', str_replace( $img, xkey_sf_set_attr( $img, 'alt', 'House' ), $content ), str_replace( '<img src="/a.jpg"', '<img alt="House" src="/a.jpg"', $content ) );

// H1 to H2.
$classic = '<h1 class="big" id="top">Welcome</h1><p>x</p><H1>Two</H1 ><h10>not a heading</h10><h2>Keep</h2>';
check( 'count h1', xkey_sf_count_h1( $classic ), 2 );
check( 'h1 texts', xkey_sf_h1_texts( '<h1>A <em>b</em></h1><h1 class="x">C &amp; D</h1>' ), array( 'A b', 'C & D' ) );
check( 'demote classic', xkey_sf_demote_h1( $classic ), '<h2 class="big" id="top">Welcome</h2><p>x</p><h2>Two</h2 ><h10>not a heading</h10><h2>Keep</h2>' );
$block  = "<!-- wp:heading {\"level\":1,\"style\":{\"typography\":{\"fontSize\":\"40px\"}}} -->\n<h1 class=\"wp-block-heading\" style=\"font-size:40px\">Title</h1>\n<!-- /wp:heading -->\n\n<!-- wp:heading -->\n<h2 class=\"wp-block-heading\">Sub</h2>\n<!-- /wp:heading -->\n\n<!-- wp:heading {\"textAlign\":\"center\",\"level\":1} -->\n<h1 class=\"wp-block-heading has-text-align-center\">Centre</h1>\n<!-- /wp:heading -->\n<!-- wp:heading {\"level\":10} -->";
$expect = "<!-- wp:heading {\"level\":2,\"style\":{\"typography\":{\"fontSize\":\"40px\"}}} -->\n<h2 class=\"wp-block-heading\" style=\"font-size:40px\">Title</h2>\n<!-- /wp:heading -->\n\n<!-- wp:heading -->\n<h2 class=\"wp-block-heading\">Sub</h2>\n<!-- /wp:heading -->\n\n<!-- wp:heading {\"textAlign\":\"center\",\"level\":2} -->\n<h2 class=\"wp-block-heading has-text-align-center\">Centre</h2>\n<!-- /wp:heading -->\n<!-- wp:heading {\"level\":10} -->";
check( 'demote gutenberg', xkey_sf_demote_h1( $block ), $expect );
check( 'demote no-op', xkey_sf_demote_h1( '<p>none</p>' ), '<p>none</p>' );

// Descriptions.
check( 'desc short', xkey_sf_make_description( '<p>Hello <strong>world</strong>.</p>' ), 'Hello world.' );
check( 'desc strips', xkey_sf_make_description( "<!-- wp:paragraph --><p>One&nbsp;two</p><!-- /wp:paragraph -->[gallery ids=\"1,2\"]<script>x()</script><style>p{}</style><h2>Three</h2>" ), 'One two Three' );
$long = '<p>We fit new boilers across Blackpool and the Fylde coast. Gas Safe engineers, fixed prices and a ten-year guarantee on every install. Call us today for a free quote and same-week fitting.</p>';
$d    = xkey_sf_make_description( $long );
check( 'desc sentences', $d, 'We fit new boilers across Blackpool and the Fylde coast. Gas Safe engineers, fixed prices and a ten-year guarantee on every install.' );
check( 'desc length', xkey_sf_strlen( $d ) <= 155, true );
$words = str_repeat( 'lorem ipsum dolor sit amet ', 20 );
$d     = xkey_sf_make_description( $words );
check( 'desc cut length', xkey_sf_strlen( $d ) <= 155, true );
check( 'desc cut ellipsis', substr( $d, -3 ), "\u{2026}" );
check( 'desc cut word boundary', (bool) preg_match( '/(lorem|ipsum|dolor|sit|amet)…$/u', $d ), true );
check( 'desc empty', xkey_sf_make_description( '<img src="x">' ), '' );
check( 'desc multibyte', xkey_sf_strlen( xkey_sf_make_description( str_repeat( 'café crème ', 40 ) ) ) <= 155, true );

// Links.
$host = 'example.co.uk';
check( 'internal absolute', xkey_sf_is_internal_url( 'https://example.co.uk/a/', $host ), true );
check( 'internal www', xkey_sf_is_internal_url( 'http://www.example.co.uk/a', $host ), true );
check( 'internal root-relative', xkey_sf_is_internal_url( '/about/', $host ), true );
check( 'protocol-relative', xkey_sf_is_internal_url( '//example.co.uk/x', $host ), true );
check( 'external', xkey_sf_is_internal_url( 'https://other.com/a', $host ), false );
check( 'lookalike host', xkey_sf_is_internal_url( 'https://example.co.uk.evil.com/', $host ), false );
check( 'mailto', xkey_sf_is_internal_url( 'mailto:a@example.co.uk', $host ), false );
check( 'anchor', xkey_sf_is_internal_url( '#top', $host ), false );
check( 'page-relative skipped', xkey_sf_is_internal_url( 'page.html', $host ), false );
check( 'slug', xkey_sf_slug_from_path( '/blog/old-post/' ), 'old-post' );
check( 'slug html', xkey_sf_slug_from_path( '/Old-Page.html' ), 'old-page' );
check( 'slug paged', xkey_sf_slug_from_path( '/category/news/page/2/' ), 'news' );
check( 'slug root', xkey_sf_slug_from_path( '/' ), '' );

$html = '<p><a href="/old-post/" class="x">Read</a> and <a class="y" href=\'/old-post/\'>again</a>, <a href="/old-post/2">other</a> <abbr href="/old-post/">no</abbr></p>';
check( 'find links', xkey_sf_find_links( $html ), array( '/old-post/', '/old-post/2' ) );
check(
	'replace href',
	xkey_sf_replace_href( $html, '/old-post/', 'https://example.co.uk/new-post/?a=1&b=2' ),
	'<p><a href="https://example.co.uk/new-post/?a=1&amp;b=2" class="x">Read</a> and <a class="y" href="https://example.co.uk/new-post/?a=1&amp;b=2">again</a>, <a href="/old-post/2">other</a> <abbr href="/old-post/">no</abbr></p>'
);
check( 'unlink', xkey_sf_unlink_href( $html, '/old-post/' ), '<p>Read and again, <a href="/old-post/2">other</a> <abbr href="/old-post/">no</abbr></p>' );
check( 'unlink multiline', xkey_sf_unlink_href( "<a\nhref=\"/x\">A\n<strong>B</strong></a>", '/x' ), "A\n<strong>B</strong>" );

echo $failures ? "\n$failures of $count checks failed.\n" : "All $count checks passed.\n";
exit( $failures ? 1 : 0 );
