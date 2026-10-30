# Club.House

The independent home base for clubs — find a club, start one, run it with free tools.

- Static HTML/CSS/JS, no build step required to host. Deployed on GitHub Pages from `main` (root).
- Monetization: Google AdSense auto ads (publisher ca-pub-6620975821265271), `ads.txt` included.
- Lead generation: `get-matched.html` (multi-step), `list-your-club.html`, sponsorship and contact forms.
- Revenue/support: `support.html` (pledges), `advertise.html` (sponsorship), `contests.html`, `careers.html`.
- Forms post via FormSubmit AJAX to a private inbox assembled at runtime (never in page markup).

## Custom domain
To serve on club.house: add a `CNAME` file containing `club.house`, then point DNS (A records to GitHub Pages IPs, or CNAME `www` to `webworksa1.github.io`). Enable "Enforce HTTPS".

## Trademark
Club.House is not affiliated with the Clubhouse app or any "Clubhouse"-named company. See `disclaimer.html`.

© Club.House. All rights reserved.
