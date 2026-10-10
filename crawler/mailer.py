"""
mailer.py - sends email through any SMTP service (Brevo, Mailgun, SendGrid,
Amazon SES, Gmail with an app password, ...). Set on the host:

    SMTP_HOST, SMTP_PORT (587 = STARTTLS, 465 = SSL), SMTP_USER,
    SMTP_PASSWORD, MAIL_FROM (e.g. "XKey <crawler@xkey.co.uk>")

Without SMTP_HOST and MAIL_FROM, email features stay switched off.
"""

import mimetypes
import os
import smtplib
from email.message import EmailMessage


def configured():
    return bool(os.environ.get("SMTP_HOST") and os.environ.get("MAIL_FROM"))


def send(to, subject, body, attachment=None, max_attachment_mb=5):
    """Send a plain-text email. Returns True on success, False otherwise."""
    if not configured():
        return False
    msg = EmailMessage()
    msg["From"] = os.environ["MAIL_FROM"]
    msg["To"] = to
    msg["Subject"] = subject
    msg.set_content(body)
    if attachment and os.path.exists(attachment) \
            and os.path.getsize(attachment) <= max_attachment_mb * 1024 * 1024:
        ctype = mimetypes.guess_type(attachment)[0] or "application/octet-stream"
        maintype, subtype = ctype.split("/", 1)
        with open(attachment, "rb") as f:
            msg.add_attachment(f.read(), maintype=maintype, subtype=subtype,
                               filename=os.path.basename(attachment))
    host = os.environ["SMTP_HOST"]
    port = int(os.environ.get("SMTP_PORT", "587"))
    user, password = os.environ.get("SMTP_USER"), os.environ.get("SMTP_PASSWORD")
    try:
        if port == 465:
            server = smtplib.SMTP_SSL(host, port, timeout=30)
        else:
            server = smtplib.SMTP(host, port, timeout=30)
            server.starttls()
        with server:
            if user:
                server.login(user, password or "")
            server.send_message(msg)
        return True
    except (smtplib.SMTPException, OSError) as exc:
        print(f"Email to {to} failed: {exc}", flush=True)
        return False
