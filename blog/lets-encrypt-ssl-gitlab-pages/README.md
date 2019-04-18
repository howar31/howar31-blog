---
title: Secure GitLab Pages with Let's Encrypt Wildcard Certificate
date: 2019-03-23
description: Secure the GitLab Pages with a free SSL/TSL wildcard certificate by Let's Encrypt once for all
categories:
  - Dev Notes
tags:
  - gitlab pages
  - https
---

# Secure GitLab Pages with Let's Encrypt Wildcard Certificate

Using SSL to secure your website is not only for safety, but also [tell browser not show your website as not secure](https://blog.chromium.org/2017/04/next-steps-toward-more-connection.html).  **Let's Encrypt** provides free SSL/TSL cerfiticates as long as you remember to renew them once in a while.  And wildcard certificates can be applied to all the subdomains.

In this article, I will show you how to apply a wildcard certificate on Let's Encrypt, and set it on GitLab Pages.

## Environment & Requirements

Environment for following instructions:

- macOS Mojave, 10.14.3
- Homebrew 2.0.5
  - Homebrew/homebrew-core (git revision 528fa; last commit 2019-03-22)
  - Homebrew/homebrew-cask (git revision f9c58; last commit 2019-03-16)
- certbot 0.32.0

Of course, you have to own a domain before you can apply for a wildcard certificate.

## Obtaining a Wildcard Certificate on Let's Encrypt

We will use **certbot**, a tool provided by Let's Encrypt, to request a certificate.

First, install certbot:

```bash
brew install certbot
```

and request a certificate:

```bash
sudo certbot certonly -a manual -d *.example.com --email your@email.com
```

remember to change the `*.example.com` and `your@email.com` to your own.  Note that `*.` before your domain is **required** for requesting a wildcard certificate.

Now the certbot will ask you soome question and provide the verification instruction:

```
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator manual, Installer None

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Please read the Terms of Service at
https://letsencrypt.org/documents/LE-SA-v1.2-November-15-2017.pdf. You must
agree in order to register with the ACME server at
https://acme-v02.api.letsencrypt.org/directory
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(A)gree/(C)ancel: a
```

press `a` to agree the terms.

```
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Would you be willing to share your email address with the Electronic Frontier
Foundation, a founding partner of the Let's Encrypt project and the non-profit
organization that develops Certbot? We'd like to send you email about our work
encrypting the web, EFF news, campaigns, and ways to support digital freedom.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(Y)es/(N)o: n
```

press `n` if you don't want to subscribe the EFF news letter.

```
Obtaining a new certificate
Performing the following challenges:
http-01 challenge for example.com

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
NOTE: The IP of this machine will be publicly logged as having requested this
certificate. If you're running certbot in manual mode on a machine that is not
your server, please ensure you're okay with that.

Are you OK with your IP being logged?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(Y)es/(N)o: y
```

press `y` to agree the IP logging.

```
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Please deploy a DNS TXT record under the name
_acme-challenge.example.com with the following value:

sdfa81NrRvsI3afw8jFeULwefi81723n98FHEfwf813elwf

Before continuing, verify the record is deployed.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Press Enter to Continue
Waiting for verification...
```

**DO NOT PRESS ENTER** for now, Let's Encrypt will have to verify you own the domain.  So you have to create a `TXT` record with name `_acme-challenge.example.com` and value `sdfa81NrRvsI3afw8jFeULwefi81723n98FHEfwf813elwf` (your value may vary) in your DNS. (I assume you know how to do that since you own a domain)

After creating the record, you may use some online tools to see the `TXT` record is properly set or not.  Then get back to your terminal and press **ENTER** to continue.

If Let's Encrypt successfully verified your record, the certbot will say:

```
Cleaning up challenges

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/example.com-0001/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/example.com-0001/privkey.pem
   Your cert will expire on 20xx-xx-xx. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot
   again. To non-interactively renew *all* of your certificates, run
   "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```

as the message said, your wildcard certificate is now stored as `fullchain.pem` and `privkey.pem`.  Please keep the files if you need to put it on your own web server.

For setting the certificate on GitLab Pages, please read on.

## Set the Certificate on GitLab Pages

Open your GitLab project and go to **Settings > Pages**.  Find your own domain and click **Details > Edit**.

Copy your `fillchain.pem` to clipboard:

```bash
sudo cat /etc/letsencrypt/live/example.com-0001/fullchain.pem | pbcopy
```

and paste it into the first field **Certificate (PEM)**.

Then copy your `privkey.pem` to clipboard:

```bash
sudo cat /etc/letsencrypt/live/example.com-0001/privkey.pem | pbcopy
```

and paste it into the second field **Key (PEM)**.

Click **Save Changes**, and wait for about 10 minutes for DNS propagation.

You may also enable **Force domains with SSL certificates to use HTTPS** in **Settings > Pages**.