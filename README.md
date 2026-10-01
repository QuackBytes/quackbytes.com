# QuackBytes

Independent software studio. Software for oddly specific problems.

Three-page Next.js site built around the original pixel duck, warm paper colors, editorial typography and a custom pixel-water animation. All fonts and artwork are local.

## Run

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For production, run `npm run build` then `npm start`. Code checks: `npm run lint`.

## Pages

- `/` — positioning, interactive duck pond, Quick Bites and keyboard-accessible service tabs.
- `/studio` — the name, principles and collaboration process.
- `/contact` — a project introduction addressed to `hello@quackbytes.com`.

The contact form validates the brief and prepares a reviewable email draft. Visitors send it using their email client or copy it into webmail. There is no server submission, database or email provider. Connect a server endpoint and an email service before offering direct form delivery.

Service examples are explicitly illustrative. There are no invented client, case-study or performance claims.

## Design and behavior

- Original logo: `public/brand/qblogo.svg`.
- Layout and design tokens: `src/app/globals.css`.
- Local fonts and licenses: `fonts/`.
- On the first home-page visit, one ripple plays under the centered duck. The water fades out before takeoff; only the original duck moves into the hero. A fresh ripple begins on touchdown and becomes the gentle ambient water motion. Resizing, scrolling, navigating or pressing Escape safely finishes the introduction. Replay from any page returns home and plays it again.
- Reduced-motion preferences skip the automatic intro and stop ambient water movement. Choosing “Replay the little duck” explicitly previews the full motion, without changing system settings.
- The intro has a stable mounted overlay, an early first-paint guard and one continuous composited flight. The veil is hidden before animation cleanup to prevent a white flash. Repeated replay input does not restart an active flight. The pixel rings use three precomputed SVG paths. Font/image preparation and playback both have fail-open timeouts.
- The duck responds to mouse, touch and keyboard activation. Deep ocean-blue click ripples run on four reusable surfaces, independently of the ambient water, so repeated clicks never restart or truncate a visible wave. Each pulse expands outward and fades to a transparent resting state. Reduced-motion visitors get a short stationary fade unless they explicitly preview the full intro.
- Contact drafts stay in component memory and clear on navigation. Nothing from the form is stored or transmitted by this site.
- Production origin: `https://quackbytes.com`.
- Brand preview assets can be regenerated with `node scripts/generate-brand-assets.mjs`.

The pre-existing QuackElements files are retained for future use. Public pages use a small set of purpose-built components.

## Verification

Production build and ESLint, plus browser checks of desktop and narrow mobile layouts, service selection and arrow-key navigation, contact topic preselection, required-field validation, draft generation and the copy fallback. No test email is sent.
