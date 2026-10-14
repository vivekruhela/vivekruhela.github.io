# Vivek Ruhela · academic site

A single-page site that reads like a genome browser: career as a chromosome, work as a Manhattan plot,
thinking as a pipeline, ambitions as open hypotheses, and ⌘K search over all of it.
Built with [Astro](https://astro.build). No database, no CMS: every word lives in a Markdown or YAML file.

## Updating the site

You can do all of this in the GitHub web editor (press `.` on the repo page). Every commit to `main` redeploys.

| To change… | Edit |
|---|---|
| Headline, intro, contact, links, the "how I think" pipeline and principles | `src/data/site.yaml` |
| Ambitions / open hypotheses | `src/data/ambitions.yaml` |
| A career chapter (a band on the chromosome) | `src/content/journey/*.md` |
| A patent, paper, preprint, abstract, talk or software release (a point on the plot) | `src/content/work/*.md` |
| A notebook (blog) post | `src/content/blog/*.md` (copy `_template.md`) |
| A tool card | `src/content/tools/*.md` |
| CV PDF | replace `public/files/Vivek_Ruhela_CV.pdf` |
| Private beta on/off | `beta:` in `src/data/site.yaml` |

### Add a paper or talk

Create `src/content/work/2026-11-02-short-name.md`:

```markdown
---
title: "Your paper title"
kind: journal        # patent | journal | preprint | abstract | talk | tool
date: 2026-11-02
venue: "Nature Genetics"
link: "https://doi.org/..."   # optional
impact_factor: 9.4            # optional, journals only
if_year: 2025                 # optional, JCR year of that impact factor
featured: true                # optional, shows it as a large Spotlight card
---

One or two plain-language sentences. This shows when someone taps the point.
```

The plot, the full list and search pick it up automatically. Journal articles sit above the
"genome-wide significance" line.

Impact factors size the journal points on the plot, appear as badges, and feed the highlights strip
(highest and cumulative impact factor). The current values are approximate; check them against JCR.

### Add a patent

```markdown
---
title: "Method for ..."
kind: patent
date: 2027-01-10
venue: "Indian Patent Office"   # or USPTO, WIPO
status: "Filed"                 # Filed | Published | Granted
number: "202711000123"          # optional
link: "https://..."             # optional
featured: true
---

One sentence on what it protects and why it matters.
```

Patents sit at the top of the plot as diamonds, get their own count in the highlights strip, and
`featured: true` puts them in the Spotlight.

### Write a notebook post

Copy `src/content/blog/_template.md` to something like `2026-11-02-my-idea.md`. Pick a `type`
(`paper` for a paper explained, `method`, `idea` or `note`), write in Markdown, and set `draft: false`.
Set `paper:` to a work file name (without `.md`) to link the post to that paper. Images go next to the
post file. The three newest posts show on the home page, and all of them at `/blog/`.

### Add a career chapter

```markdown
---
title: "Assistant Professor"
label: "Lab PI"          # short text under the chromosome band
from: 2027
# to: 2030             # leave out while ongoing
where: "Your university"
tags: ["Alzheimer's", "Multi-omics"]
---

What you built there and what it taught you.
```

`pivot: true` on one chapter draws the chromosome's centromere at its start (currently the PhD).

## Run locally (optional)

```bash
npm install
npm run dev      # http://localhost:4321
```

## Hosting

Live at **https://vivekruhela.github.io**, on GitHub Pages (free). Every push to `master` runs
`.github/workflows/deploy.yml`, which builds this site and publishes it.

- **Previous site:** the old Jekyll (AcademicPages) site is kept on the `academicpages-archive` branch and
  rebuilt into **/archive/** on every deploy. Old links such as `/publication/...` or `/talks/...` forward
  there automatically, old top-level pages (`/publications/`, `/cv/`, …) forward to the matching section
  here, and every PDF under `/files/` keeps its address.
- **Private previews:** `worker/` and `wrangler.jsonc` let the same code run on Cloudflare Workers behind a
  password (`BETA_PASSWORD` secret), if you ever want a private preview again.
