# Club.House

The independent home base for clubs — find a club, start one, run it with free tools.

Static HTML/CSS/vanilla JS, hosted free on GitHub Pages from the `main` branch root. There is no build step: every page is fully assembled and `.nojekyll` is included.

- Monetization: Google AdSense Auto ads (publisher ca-pub-6620975821265271), `ads.txt` at the root.
- Lead generation: `get-matched.html` (3-step), `list-your-club.html`, and sponsorship and contact forms.
- Revenue and support: `support.html` (pledges), `advertise.html`, `contests.html`, `careers.html`.
- Form submissions go through FormSubmit to the site inbox. The address never appears in the HTML; it is assembled at runtime in `assets/js/main.js`. **The first submission triggers a one-time FormSubmit activation email, which you must confirm.**
- Every internal link is relative, so the site works at `https://webworksa1.github.io/club-house/` and on `https://club.house/`.

## Deploy (GitHub Pages, free)
1. Settings → Pages → *Deploy from a branch* → `main` / `(root)` → Save.
2. Custom domain: `club.house` (the `CNAME` file is already in the repo). At your DNS provider:
   - `A` @ → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - `CNAME` www → `webworksa1.github.io`
3. Tick **Enforce HTTPS** once the certificate is issued.
4. In AdSense, add the site `club.house`. `ads.txt` must be served at the domain root. Then enable Google's certified CMP under Privacy & messaging for EEA/UK/CH visitors.

## Trademark
Club.House is not affiliated with the Clubhouse app or any "Clubhouse"-named company. See `disclaimer.html`.

© Club.House. All rights reserved.
