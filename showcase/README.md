# showcase — BODH Landing and Demonstration Page

The showcase is the public entry point to the BODH project. It is a single-page web experience that introduces the system, demonstrates its components, and links visitors and evaluators directly to the live kiosk deployment and the project repositories.

---

## Parent Project

This component is part of **BODH — Bharat Organised Digital Heritage**.

Parent repository: [https://github.com/Utkarshaglitched/BODH](https://github.com/Utkarshaglitched/BODH)

---

## Purpose

The showcase serves several audiences simultaneously:

- **Judges and evaluators** — a concise, visual overview of what BODH is, what it does, and where to see it in action
- **Museum stakeholders** — a demonstration of how the kiosk experience looks and feels, with a direct link to the live deployment
- **Developers and contributors** — a clear entry point into the repository structure and individual components

---

## What the Showcase Contains

### Project Introduction

A hero section that names and frames BODH — Bharat Organised Digital Heritage — and its three-part mission: Discover, Understand, Experience.

### Conceptual Flow

A visual representation of the end-to-end BODH pipeline, showing how a digitised archival record moves through the system:

```
01 / APTBAS     — Digitisation
02 / BODH       — Intelligent retrieval
03 / SAHAYAK + KIOSKS  — Museum experience
```

### Live Demo

An embedded demonstration video showing BODH in action, linked to the project demo playlist.

### Navigation Links

Direct links to the four key entry points:

| Link | Destination |
|---|---|
| Experience Kiosks | [smarak.onrender.com](https://smarak.onrender.com/) — the deployed kiosk |
| Sahayak Demo | SAHAYAK component overview |
| End-to-End Flow | Full pipeline walkthrough |
| Repositories | [github.com/Utkarshaglitched/BODH](https://github.com/Utkarshaglitched/BODH) |

---

## Files

| File | Description |
|---|---|
| `index.html` | Single-page application shell and content |
| `styles.css` | Design system: typography, layout, colour palette |
| `script.js` | Interaction behaviour: navigation, demo video, animations |
| `ambedkar-archive.jpg` | Archival portrait used in the conceptual flow visualisation |

---

## Design Notes

The showcase uses a restrained typographic palette (Cormorant Garamond for display, Outfit for body) and a light neutral background to let the content lead. It is fully responsive and accessible, with skip-link navigation and ARIA labels on all interactive elements.

The page is intentionally static — no build step, no bundler, no framework dependency. It can be served from any static host or opened directly as a local file.

---

## Status

> **Deployed.** The showcase is the live public face of the BODH project and should reflect the current state of the system at all times.
