// Email deliverability guides: why mail lands in spam, the big mailbox providers' sender rules, and
// step-by-step SPF/DKIM/DMARC setup for the email services UK small businesses use. Each one links to the
// MX, SPF, DMARC and DKIM checkers so a reader can test as they go.

const P = ["/guides", "Guides"];
const TOOLS = `<p>Test as you go with the free <a href="/mx-lookup">MX lookup</a>, <a href="/spf-checker">SPF checker</a>, <a href="/dkim-checker">DKIM checker</a> and <a href="/dmarc-checker">DMARC checker</a>. DNS changes usually show within an hour, but can take up to a day.</p>`;

export const EMAIL_GUIDES = [
  {
    path: "/guides/why-are-my-emails-going-to-spam", crumb: "Why emails go to spam", parent: P, article: true,
    title: "Why Are My Emails Going to Spam? 10 Fixes for Businesses",
    desc: "Why your business emails land in spam or junk, and how to fix it: SPF, DKIM and DMARC, domain reputation, content and list mistakes, with free checkers.",
    h1: "Why are my emails going to spam?",
    lead: "When quotes, invoices and replies land in a customer's junk folder, you lose work without knowing it. Almost always the cause is one of a short list of fixable problems – and the most common one takes ten minutes to put right.",
    sections: `<h2>How do I know my emails are going to spam?</h2>
<p>Customers say they never got your quote, replies dry up, or a friend with a Gmail or Outlook address finds your message in Junk. To test it yourself, send a normal email from your business address to a personal Gmail and a personal Outlook.com account and see where it lands. In Gmail, open the message, choose the three dots and <strong>Show original</strong>: you'll see <strong>SPF</strong>, <strong>DKIM</strong> and <strong>DMARC</strong> each marked PASS or FAIL. Any FAIL is your first job.</p>
<h2>1. Your domain has no SPF record, or a broken one</h2>
<p>SPF is a line in your domain's DNS that lists which services are allowed to send email for you. Without it, or if it's missing the service you actually send through (your website, your invoicing software, your newsletter tool), mailbox providers can't tell your real emails from fakes. Common mistakes: two SPF records instead of one, more than 10 DNS lookups, and <code>+all</code> at the end, which lets anyone send as you. The <a href="/spf-checker">SPF checker</a> finds all three.</p>
<h2>2. Your emails aren't signed with DKIM</h2>
<p>DKIM adds a digital signature to every email so the receiver can check it really came from your domain and wasn't changed on the way. Microsoft 365 and Google Workspace both need you to switch it on – it isn't automatic for your own domain. See our step-by-step guides for <a href="/guides/spf-dkim-dmarc-microsoft-365">Microsoft 365</a> and <a href="/guides/spf-dkim-dmarc-google-workspace">Google Workspace</a>.</p>
<h2>3. You have no DMARC record</h2>
<p>DMARC tells mailbox providers what to do when an email fails SPF and DKIM, and sends you reports about who is sending as your domain. Gmail, Yahoo and Microsoft now expect it from anyone sending in volume, and it stops scammers sending fake invoices in your name. Start with a monitoring-only record and tighten it later – <a href="/guides/how-to-set-up-dmarc">how to set up DMARC</a> walks through it.</p>
<h2>4. Your website's contact form sends as your address</h2>
<p>Many website forms send emails "from" your own address through the web server, which isn't in your SPF record and isn't signed. They fail every check. Fix it by sending form emails through a proper email service (an SMTP plugin connected to Microsoft 365, Google Workspace or a transactional service such as Postmark or Brevo), and add that service to SPF and DKIM.</p>
<h2>5. Your domain or server is on a blocklist</h2>
<p>If spam was ever sent from your domain or your mail server's IP address – often through a hacked email account or website – it can be listed on blocklists such as Spamhaus. Change any compromised passwords, turn on two-step sign-in, then check the main blocklists and follow their removal steps.</p>
<h2>6. Your domain is brand new</h2>
<p>New domains have no sending history, so providers are cautious. Send normal one-to-one emails for a few weeks before any newsletter, and set up SPF, DKIM and DMARC from day one. The <a href="/domain-age-checker">domain age checker</a> shows exactly how old your domain is.</p>
<h2>7. People mark your emails as spam</h2>
<p>Every "Report spam" click hurts. Gmail asks bulk senders to keep complaints under 0.3% and ideally under 0.1%. Only email people who asked to hear from you, say who you are in the first line, and make unsubscribing easy. Never buy email lists – it's also against UK data protection and marketing law (PECR).</p>
<h2>8. Your content looks like spam</h2>
<p>Content matters less than authentication, but it still counts: a single big image with no text, link shorteners, ALL CAPS subject lines, lots of exclamation marks and attachments from unknown senders all raise flags. Write like a person: plain text with a clear subject, your name and your business details in the signature.</p>
<h2>9. Your links point to a website with problems</h2>
<p>Filters check the links in your email. If your website has been hacked, has an expired certificate or redirects strangely, your emails suffer too. Run the <a href="/">free SEO check</a> and the <a href="/ssl-checker">SSL checker</a> on your site.</p>
<h2>10. You send newsletters from your main address without warming up</h2>
<p>Sending hundreds of emails at once from an inbox that normally sends twenty a day looks like a hacked account. Use a newsletter service (Mailchimp, Brevo, MailerLite and so on), authenticate it on your domain with its DKIM records, and build up slowly. Read the <a href="/guides/gmail-yahoo-microsoft-sender-rules">Gmail, Yahoo and Microsoft sender rules</a> before you start.</p>
<h2>Check your email setup in two minutes</h2>
${TOOLS}`,
    faqs: [["Why do my emails go to spam in Outlook but not Gmail?", "Each provider uses its own filters. Outlook.com and Hotmail are strict about SPF, DKIM and DMARC and about sending reputation. Fix any authentication failures first; they're the usual cause."], ["Why are emails from my website going to spam?", "Website forms often send through the web server using your address, which fails SPF and DKIM. Send them through your email provider or a transactional email service instead."], ["How long until my emails stop going to spam?", "Authentication fixes work as soon as the DNS change is live, usually within an hour. Reputation problems, such as a blocklisting or a history of complaints, take days or weeks of good sending to recover."], ["Will a paid email address fix it?", "A proper business email service on your own domain helps a lot compared with a free address, but only once SPF, DKIM and DMARC are set up for it."]],
  },
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
    path: "/guides/spf-dkim-dmarc-microsoft-365", crumb: "SPF, DKIM and DMARC for Microsoft 365", parent: P, article: true,
    title: "SPF, DKIM & DMARC for Microsoft 365: Full Setup Guide",
    desc: "Set up SPF, DKIM and DMARC for Microsoft 365 on your own domain: the exact SPF record, switching on DKIM in Defender, and a safe DMARC record.",
    h1: "SPF, DKIM and DMARC for Microsoft 365",
    lead: "Microsoft 365 business email doesn't sign your emails with your own domain until you switch DKIM on, and it doesn't add DMARC at all. Here's the full setup, in order, for a domain you manage yourself.",
    sections: `<h2>Before you start</h2>
<p>You'll need to sign in to your <strong>Microsoft 365 admin centre</strong> as an admin, and to the place your domain's DNS is managed – often where you bought the domain (GoDaddy, 123 Reg, IONOS, Cloudflare and so on). Not sure where your DNS is? The <a href="/dns-lookup">DNS lookup</a> shows your name servers, which tell you.</p>
<h2>Step 1: the SPF record</h2>
<p>If Microsoft 365 is the only service that sends email as your domain, add one TXT record at your domain's root (often shown as <code>@</code>):</p>
<pre><code>v=spf1 include:spf.protection.outlook.com -all</code></pre>
<p>If other services send as you – your website, a newsletter tool, invoicing software – add their <code>include:</code> before <code>-all</code>, in the same single record. For example, with Mailchimp's transactional service and Xero you might have more than one include. You must only ever have <strong>one</strong> SPF record; two records make both fail. Keep the total under 10 DNS lookups – the <a href="/spf-checker">SPF checker</a> counts them for you.</p>
<h2>Step 2: switch on DKIM</h2>
<ol><li>Go to the <strong>Microsoft Defender portal</strong> (security.microsoft.com) and open <strong>Email &amp; collaboration → Policies &amp; rules → Threat policies → Email authentication settings</strong>, then the <strong>DKIM</strong> tab.</li><li>Select your domain. Microsoft shows <strong>two CNAME records</strong>, named <code>selector1._domainkey</code> and <code>selector2._domainkey</code>, each pointing to an address Microsoft gives you.</li><li>Add both CNAME records at your DNS host exactly as shown. Copy the values rather than typing them – Microsoft's format differs between tenants and has changed over the years.</li><li>Wait for the records to appear (the <a href="/dkim-checker">DKIM checker</a> with selector <code>selector1</code> will find them), then go back to the DKIM tab and switch <strong>Sign messages for this domain with DKIM signatures</strong> on.</li></ol>
<p>If the switch gives an error saying the CNAMEs can't be found, wait an hour and try again; DNS hasn't caught up yet.</p>
<h2>Step 3: add DMARC</h2>
<p>Add a TXT record named <code>_dmarc</code> with:</p>
<pre><code>v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.co.uk</code></pre>
<p>Replace the address with a mailbox you'll check (or a free DMARC report service). <code>p=none</code> only monitors; nothing is blocked. After a few weeks of reports showing all your real email passing, move to <code>p=quarantine</code> and later <code>p=reject</code>. Our <a href="/guides/how-to-set-up-dmarc">DMARC guide</a> explains each step.</p>
<h2>Step 4: check the MX record</h2>
<p>Your domain's MX record should point to <code>yourdomain-co-uk.mail.protection.outlook.com</code> (Microsoft shows the exact value under <strong>Settings → Domains</strong> in the admin centre). The <a href="/mx-lookup">MX lookup</a> confirms it and names the provider.</p>
<h2>Bought Microsoft 365 through GoDaddy or another reseller?</h2>
<p>Some resellers manage DNS for you and add SPF automatically, sometimes with their own include (GoDaddy's is <code>include:secureserver.net</code>). Check what's already there before adding anything, and edit the existing record rather than creating a second one.</p>
${TOOLS}`,
    faqs: [["Does Microsoft 365 set up DKIM automatically?", "It signs with your tenant's onmicrosoft.com domain by default, which doesn't align with your own domain for DMARC. You need to publish the two CNAME records and switch DKIM on for your own domain."], ["What is the SPF record for Outlook / Microsoft 365?", "v=spf1 include:spf.protection.outlook.com -all – plus an include for any other service that sends as your domain, all in one record."], ["Should I use -all or ~all?", "-all tells receivers to reject anything not listed; ~all says treat it with suspicion. With DMARC in place either works. Use ~all while you're still discovering which services send as you."]],
  },
  {
    path: "/guides/spf-dkim-dmarc-google-workspace", crumb: "SPF, DKIM and DMARC for Google Workspace", parent: P, article: true,
    title: "SPF, DKIM & DMARC Setup for Google Workspace",
    desc: "SPF, DKIM and DMARC for Google Workspace on your own domain: the SPF record, your DKIM key from the Admin console and a safe DMARC record.",
    h1: "SPF, DKIM and DMARC for Google Workspace",
    lead: "Google Workspace gives you Gmail on your own domain, but until you add SPF and DKIM to your DNS your emails are far more likely to be junked – especially by Outlook and Yahoo. This takes about fifteen minutes.",
    sections: `<h2>Before you start</h2>
<p>You'll need a <strong>super admin</strong> sign-in for the Google Admin console (admin.google.com) and access to your domain's DNS. If your domain was bought through Google when you signed up for Workspace, Google may have set up some of this already – check first with the free <a href="/spf-checker">SPF checker</a>.</p>
<h2>Step 1: the SPF record</h2>
<p>If Google Workspace is the only service sending as your domain, add one TXT record at your domain's root (<code>@</code>):</p>
<pre><code>v=spf1 include:_spf.google.com ~all</code></pre>
<p>Add an <code>include:</code> for every other service that sends as you – your website's email service, newsletter or booking tools – inside the same record. Never create a second SPF record, and keep under 10 DNS lookups.</p>
<h2>Step 2: generate and publish your DKIM key</h2>
<ol><li>In the Admin console, go to <strong>Apps → Google Workspace → Gmail → Authenticate email</strong>.</li><li>Choose your domain and select <strong>Generate new record</strong>. Pick a <strong>2048-bit</strong> key unless your DNS host can't accept long TXT records; keep the prefix (selector) as <code>google</code>.</li><li>Google shows a TXT record name, <code>google._domainkey</code>, and a long value starting <code>v=DKIM1; k=rsa; p=</code>. Add it at your DNS host exactly as shown.</li><li>After the record is live – the <a href="/dkim-checker">DKIM checker</a> with selector <code>google</code> will show it – return to the same page and select <strong>Start authentication</strong>.</li></ol>
<p>Some DNS hosts split long values into several quoted strings; that's normal and still works.</p>
<h2>Step 3: add DMARC</h2>
<p>Add a TXT record named <code>_dmarc</code>:</p>
<pre><code>v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.co.uk</code></pre>
<p>Start with <code>p=none</code> to monitor, read the reports for a few weeks, then move to <code>p=quarantine</code> and <code>p=reject</code>. Step-by-step: <a href="/guides/how-to-set-up-dmarc">how to set up DMARC</a>.</p>
<h2>Step 4: check your MX records</h2>
<p>New Workspace accounts use a single MX record, <code>smtp.google.com</code> with priority 1. Older accounts use five records (<code>aspmx.l.google.com</code> and the alt records) – both work. The <a href="/mx-lookup">MX lookup</a> shows yours and confirms the provider.</p>
<h2>Sending from your website or other tools</h2>
<p>Contact forms and online shops often send as your address. Connect them to Google's SMTP relay or a transactional email service and add that service to SPF and DKIM, otherwise those emails fail DMARC once you tighten your policy.</p>
${TOOLS}`,
    faqs: [["What is the SPF record for Google Workspace?", "v=spf1 include:_spf.google.com ~all, with an extra include for any other service that sends as your domain, in one record."], ["Where do I find the DKIM key for Google Workspace?", "Admin console → Apps → Google Workspace → Gmail → Authenticate email. Generate the record there, publish it as google._domainkey, then select Start authentication."], ["Why does Gmail say my email 'may not be from' my business?", "Usually because SPF or DKIM failed for your domain. Check both with the free checkers and make sure DKIM authentication is started in the Admin console."]],
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
<p>DMARC only works on top of SPF and DKIM. Set those up first for every service that sends as you. Guides: <a href="/guides/spf-dkim-dmarc-microsoft-365">Microsoft 365</a>, <a href="/guides/spf-dkim-dmarc-google-workspace">Google Workspace</a>. Check them with the <a href="/spf-checker">SPF checker</a> and <a href="/dkim-checker">DKIM checker</a>.</p>
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
