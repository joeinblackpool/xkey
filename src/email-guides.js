// Email deliverability guides that go deeper than the spam and SPF/DKIM/DMARC setup guides in guides-11.js:
// the big mailbox providers' sender rules, and rolling DMARC out from p=none to p=reject. Each links to the
// MX, SPF, DMARC and DKIM checkers so a reader can test as they go.

const P = ["/guides", "Guides"];
const TOOLS = `<p>Test as you go with the free <a href="/mx-lookup">MX lookup</a>, <a href="/spf-checker">SPF checker</a>, <a href="/dkim-checker">DKIM checker</a> and <a href="/dmarc-checker">DMARC checker</a>. DNS changes usually show within an hour, but can take up to a day.</p>`;

export const EMAIL_GUIDES = [
  {
    path: "/guides/gmail-yahoo-microsoft-sender-rules", crumb: "Gmail, Yahoo and Microsoft sender rules", parent: P, article: true,
    title: "Gmail, Yahoo & Microsoft Email Sender Rules Explained",
    desc: "The sender rules Gmail, Yahoo and Outlook enforce: SPF, DKIM, DMARC, one-click unsubscribe and spam rates, in plain English for small businesses.",
    h1: "Gmail, Yahoo and Microsoft sender rules",
    lead: "Since 2024 Gmail and Yahoo, and since 2025 Microsoft's Outlook.com, reject or junk email from senders who don't meet their rules. If you send newsletters, booking confirmations or invoices to customers' personal addresses, here's what they ask for.",
    sections: `<h2>Who do the rules apply to?</h2>
<p>There are two levels. <strong>Every sender</strong> to a Gmail, Yahoo or Outlook.com address must meet the basic rules. <strong>Bulk senders</strong> – roughly 5,000 or more emails a day to one provider's users – must meet the stricter ones as well. Most small businesses aren't bulk senders, but the basic rules still apply, and newsletter tools usually expect you to meet the bulk rules anyway.</p>
<h2>The rules for every sender</h2>
<ul><li><strong>SPF or DKIM</strong> must pass for your domain. Set up both – it costs nothing. Check with the <a href="/spf-checker">SPF checker</a> and <a href="/dkim-checker">DKIM checker</a>.</li><li><strong>Valid reverse DNS</strong> for the sending server – your email provider handles this if you use Microsoft 365, Google Workspace or a reputable newsletter service.</li><li><strong>A secure connection (TLS)</strong> when sending – again handled by any modern provider.</li><li><strong>Low spam complaints</strong> – Gmail asks you to stay below 0.3% of messages reported as spam, and recommends below 0.1%.</li><li><strong>Properly formatted messages</strong> that follow the email standards, and no pretending to be someone else, such as sending "from" a Gmail address through another service.</li></ul>
<h2>The extra rules for bulk senders</h2>
<ul><li><strong>SPF and DKIM both</strong> set up for your domain.</li><li><strong>A DMARC record</strong> – at least <code>p=none</code> (monitoring only). See <a href="/guides/how-to-set-up-dmarc">how to set up DMARC</a> and test it with the <a href="/dmarc-checker">DMARC checker</a>.</li><li><strong>Alignment</strong> – the domain in your visible From address must match the domain that passes SPF or DKIM. If your newsletter tool signs with its own domain rather than yours, you're not aligned: add its DKIM records to your domain.</li><li><strong>One-click unsubscribe</strong> for marketing emails – the List-Unsubscribe header that puts an "Unsubscribe" link next to your name in Gmail and Yahoo – and a visible unsubscribe link in the email. Requests must be honoured within two days.</li></ul>
<h2>What changed at Microsoft?</h2>
<p>From May 2025, Microsoft began applying similar rules to Outlook.com, Hotmail and Live addresses for domains sending more than 5,000 emails a day: SPF, DKIM and DMARC (at least <code>p=none</code>, aligned with SPF or DKIM) are required, and email that doesn't comply is junked and then rejected. Microsoft also recommends a working unsubscribe link and a real reply-to address.</p>
<h2>What happens if I don't comply?</h2>
<p>Emails are first delayed or sent to spam, then rejected with an error that names the rule you broke – for example a bounce mentioning "5.7.26" from Gmail means authentication failed. Your newsletter tool's reports will show a jump in bounces.</p>
<h2>A simple checklist for small businesses</h2>
<ol><li>Set up SPF listing every service that sends as your domain.</li><li>Turn on DKIM in your email service and in every newsletter or invoicing tool, using your own domain.</li><li>Add a DMARC record with <code>p=none</code> and an address to receive reports.</li><li>Send marketing only to people who opted in, with one-click unsubscribe switched on in your newsletter tool.</li><li>Watch complaints in <strong>Google Postmaster Tools</strong> if you send to many Gmail users.</li></ol>
${TOOLS}`,
    faqs: [["I only send a few emails a day. Do these rules affect me?", "The basic rules do: SPF or DKIM must pass, and complaint rates must be low. The bulk rules apply above about 5,000 emails a day, but setting up SPF, DKIM and DMARC anyway is free and protects you from scammers using your name."], ["Does my newsletter tool handle this for me?", "Partly. Mailchimp, Brevo, MailerLite and others add one-click unsubscribe and sign your emails, but you still need to add their DKIM records to your domain so the signature matches your From address."], ["What is a 5.7.26 bounce?", "It's Gmail rejecting a message because it failed authentication: SPF and DKIM didn't pass for the From domain under its DMARC rules. Fix SPF and DKIM for the service that sent it."]],
  },
  {
    path: "/guides/how-to-set-up-dmarc", crumb: "How to set up DMARC", parent: P, article: true,
    title: "How to Set Up DMARC: From p=none to p=reject Safely",
    desc: "Set up DMARC step by step: what to put in the record, how to read the reports, and when to move from p=none to quarantine and reject safely.",
    h1: "How to set up DMARC, step by step",
    lead: "DMARC stops scammers sending emails that pretend to be from your business, and helps your real emails reach the inbox. Set it up in stages so you never block your own mail.",
    sections: `<h2>What does DMARC do?</h2>
<p>When an email claims to come from your domain, the receiving server checks SPF and DKIM. DMARC is a short TXT record that tells it what to do if <strong>neither</strong> passes for your domain: let it through (<code>none</code>), put it in spam (<code>quarantine</code>) or refuse it (<code>reject</code>). It also asks receivers to send you daily reports listing every server that sent email using your domain – so you find forgotten tools and spot spoofing.</p>
<h2>Before you start: SPF and DKIM</h2>
<p>DMARC only works on top of SPF and DKIM. Set those up first for every service that sends as you. Check them with the <a href="/spf-checker">SPF checker</a> and <a href="/dkim-checker">DKIM checker</a>.</p>
<h2>Stage 1: monitor (p=none)</h2>
<p>Add a TXT record named <code>_dmarc</code> at your domain:</p>
<pre><code>v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.co.uk</code></pre>
<p>Nothing is blocked. Reports start arriving within a day or two as zipped XML files – hard to read by hand, so many people use a free DMARC report service, which turns them into a simple list of senders and pass rates. Leave this running for two to four weeks.</p>
<h2>Stage 2: read the reports</h2>
<p>Look for every service sending as your domain. Each should show SPF or DKIM <strong>passing and aligned</strong> (the domain that passed matches your From address). Typical finds: the website contact form, an old newsletter account, invoicing or booking software, a scanner or printer that emails documents. Fix each one by adding it to SPF or setting up its DKIM records – or stop it sending as your domain.</p>
<h2>Stage 3: quarantine</h2>
<p>When your real email passes, change the record to:</p>
<pre><code>v=DMARC1; p=quarantine; pct=25; rua=mailto:dmarc-reports@yourdomain.co.uk</code></pre>
<p><code>pct=25</code> applies the policy to a quarter of failing mail at first. Raise it to 50, then 100, over a couple of weeks while watching the reports.</p>
<h2>Stage 4: reject</h2>
<pre><code>v=DMARC1; p=reject; rua=mailto:dmarc-reports@yourdomain.co.uk</code></pre>
<p>Now fake emails using your domain are refused outright. This is the strongest protection against invoice fraud in your name, and the level banks and government sites use.</p>
<h2>What the other tags mean</h2>
<ul><li><code>sp=</code> – the policy for subdomains (defaults to the same as <code>p</code>).</li><li><code>adkim=s</code> / <code>aspf=s</code> – strict alignment; leave them out (relaxed) unless you know you need them.</li><li><code>ruf=</code> – forensic reports about single failures; few providers send them, and they can contain personal data.</li><li><code>fo=1</code> – ask for failure reports when either check fails.</li></ul>
<h2>Domains that never send email</h2>
<p>For a domain you own but never send from, publish <code>v=DMARC1; p=reject</code> straight away along with an SPF record of <code>v=spf1 -all</code>, so nobody can use it for fake emails.</p>
<p>Check your record at any stage with the <a href="/dmarc-checker">DMARC checker</a>. It reads your policy, explains each tag and warns about mistakes.</p>`,
    faqs: [["Will DMARC stop my emails being delivered?", "Not at p=none, which only monitors. Problems only start if you move to quarantine or reject before every service that sends as you passes SPF or DKIM – which is why you read the reports first."], ["Is DMARC required?", "Gmail, Yahoo and Microsoft require at least p=none from bulk senders, and recommend it for everyone. For a small business it's free and protects customers from fake invoices in your name."], ["Where do DMARC reports go?", "To the address in the rua tag. Use a dedicated mailbox or a DMARC report service, because a busy domain can receive dozens of reports a day."]],
  },
];
