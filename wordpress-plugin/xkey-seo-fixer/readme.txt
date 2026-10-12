=== XKey SEO Fixer ===
Contributors: joeinblackpool
Tags: seo, alt text, meta description, broken links, headings
Requires at least: 6.0
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Finds common on-site SEO problems and fixes them when you click: missing alt text, missing meta descriptions, extra H1s and broken internal links.

== Description ==

The free checker at [xkey.co.uk](https://xkey.co.uk/) tells you what to fix on your site. This plugin fixes the most common of those problems inside WordPress.

Go to **Tools → XKey SEO Fixer**. The plugin looks through your published posts, pages and products (and any other public post type) and lists what it finds, with the fix it proposes for each item. Tick the items you want and click **Fix selected**, or click **Fix all of this type**. Nothing on your site changes until you click.

What it finds and fixes:

* **Images missing alt text.** Media library images with no alt text get alt text made from the image title (for example "red-brick-house.jpg" becomes "Red brick house"). Images in your content with no alt text get the alt text of the matching media library image. Camera-style names such as IMG_1234 or DSC0001 are marked "needs a human", because only a person can describe the picture.
* **Missing meta descriptions.** The plugin writes one from the post's excerpt, or from the first sentences of the content, kept to 155 characters. It saves it where your SEO plugin reads it (Yoast SEO, Rank Math or SEOPress). With no SEO plugin, it adds the description to the page itself. If All in One SEO is active, use its own bulk editor instead; this plugin does not write to its tables.
* **Extra H1 headings.** Most themes already show the post title as the H1, so any H1 inside the content is changed to an H2. Both classic content and block editor heading blocks are handled.
* **Broken internal links.** Links to your own site that don't lead to any post, page, archive or uploaded file. If a published post has the same slug (for example after a page was moved), the link can be pointed to it. Otherwise it is marked "needs a human", and you can remove the link while keeping its text.

Big sites are checked in batches of 200 items so the page doesn't time out. Use the Next batch button to move on.

Page titles are not handled; use your SEO plugin or theme for those.

Privacy: the plugin makes no requests to other servers, collects nothing and sends nothing anywhere. The "Check your site on XKey" button is an ordinary link that opens xkey.co.uk in a new tab only if you click it.

== Installation ==

1. Upload the `xkey-seo-fixer` folder to `/wp-content/plugins/`, or install it from Plugins → Add New.
2. Activate it.
3. Go to Tools → XKey SEO Fixer.

You need to be an administrator to use it.

== Frequently Asked Questions ==

= Can I undo a change? =

Changes to post content (alt text in content, headings, links) are saved the normal WordPress way, so a revision is kept and you can restore the earlier version from the post's Revisions screen. This only works for post types that keep revisions: posts and pages do, WooCommerce products don't by default. Alt text in the media library and meta descriptions are not revisioned; you can change them by hand as usual. Taking a backup before a large run is still a good idea.

= Will it change anything without asking? =

No. The page only lists problems. Changes happen only when you click a fix button.

= Why are some items marked "needs a human"? =

Because a guess would be worse than nothing. An image called IMG_1234 says nothing about what is in it, and a link to a page that no longer exists may need a different target or no link at all.

= Does it work with page builders? =

Posts built with Elementor keep their content outside the normal post content, so the plugin skips them for alt text in content, headings and links. Other builders that store content in their own format may not be fully covered.

= Will my modified dates change? =

Fixes to post content are saved with wp_update_post, so WordPress updates the post's modified date as it does for any edit. Alt text and meta descriptions don't change the post's modified date.

= Does it check external links? =

No. It only checks links to your own site, and it does this from your database and files without loading any pages.

= What happens when I delete the plugin? =

Its own settings are removed. Fixes you made stay, because they are part of your content. Meta descriptions it saved itself (when no SEO plugin was active) stay in the database but are no longer shown on your pages.

== Changelog ==

= 1.0.0 =
* First release.
