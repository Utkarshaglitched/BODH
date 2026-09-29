# APTBS — Automated Page-Turning Book Scanning System

APTBS is the digitisation hardware and processing pipeline that sits at the entry point of the BODH system. It converts physical books, manuscripts, and archival documents into structured digital packages that the BODH Knowledge Core can ingest, index, and serve.

---

## Parent Project

This component is part of **BODH — Bharat Organised Digital Heritage**.

Parent repository: [https://github.com/Utkarshaglitched/BODH](https://github.com/Utkarshaglitched/BODH)

## Reference Repository

This component takes reference from:

[https://github.com/vinayakagga/APTBAS](https://github.com/vinayakagga/APTBAS)

The BODH implementation is adapted for the BODH architecture and the specific digitisation requirements of Indian heritage material.

---

## Role in BODH

BODH cannot serve knowledge it has never seen. The vast majority of culturally significant Indian heritage — speeches, writings, letters, manuscripts, gazetteers, court proceedings — exists only as physical print. APTBS is the bridge between a physical book and a machine-readable digital archive. Every document that enters the BODH Knowledge Core begins its journey here.

```
APTBS (this component)
    ↓
Produces structured page images + extracted text
    ↓
BODH Knowledge Core
    ↓
SAHAYAK / Kiosk interfaces
```

---

## Problem

India's archival wealth is fragile, unevenly distributed, and largely inaccessible to intelligent systems. Manual scanning is slow, error-prone, and produces inconsistent results. Libraries and museums rarely have the resources to digitise collections at scale, and even when they do, the output is often an unindexed pile of image files rather than a searchable, structured document.

APTBS addresses this by automating the most labour-intensive parts of the digitisation process: page turning, image capture, quality verification, and text extraction — producing consistent, high-quality output that can feed directly into a knowledge pipeline.

---

## How It Works

The system processes one book at a time through a sequential pipeline. A robotic page-turning mechanism advances each page. A camera or imaging unit captures the exposed page. The captured image is then assessed for quality before being passed to OCR for text extraction. The resulting text and images are packaged together as a structured digital document.

The pipeline is designed to be non-destructive: books are never damaged, and original page images are always preserved alongside extracted text so that researchers can verify the source.

---

## Pipeline

```
Physical Book
    ↓
Automated Page Turning  (ROBOTIC_arm)
    ↓
Page Capture            (camera / imaging unit)
    ↓
Image Quality Check     (blur · skew · brightness · blank page detection)
    ↓
OCR / Text Extraction   (OCR sub-component)
    ↓
Page Structuring        (page number · heading · body text)
    ↓
Digital Archive Package (images + text + metadata)
    ↓
BODH Knowledge Core
```

```mermaid
flowchart LR
    A[Physical Book] --> B[Automated Page Turning]
    B --> C[Page Capture]
    C --> D[Image Quality Check]
    D --> E[OCR / Text Extraction]
    E --> F[Page Structuring]
    F --> G[Digital Archive Package]
    G --> H[BODH Knowledge Core]
```

---

## Sub-components

| Sub-folder | Description |
|---|---|
| `ROBOTIC_arm/` | Mechanical page-turning unit — hardware design and control logic |
| `OCR/` | Text extraction layer — converts captured page images to machine-readable text |

---

## Image Quality Checks

Before a page image is passed to OCR, it is evaluated for a set of quality conditions. Pages that fail a check are flagged for re-capture rather than silently producing bad output.

| Check | Purpose |
|---|---|
| Blur detection | Identifies motion blur or focus issues that would degrade OCR accuracy |
| Skew correction | Detects and corrects page tilt so text lines are horizontal |
| Brightness / contrast | Ensures the image is neither under- nor over-exposed |
| Blank page detection | Skips genuinely empty pages to keep the archive clean |
| Incomplete page detection | Flags pages where the turning mechanism did not fully expose the page |

---

## Outputs

A completed APTBS run for a single book produces:

- **Page images** — archival-quality image for every page, preserved as the canonical source record
- **Extracted text** — OCR output per page, structured into logical sections where possible
- **Metadata** — title, estimated page count, language, scan timestamp, quality flags
- **Archive package** — a structured bundle ready for ingestion into the BODH Knowledge Core

---

## Relationship with OCR

OCR is a dedicated sub-component of APTBS. It receives the quality-checked page images produced by the capture stage and returns structured text. The separation allows the OCR component to be updated or replaced independently — for example, moving from a general-purpose engine to a specialised model trained on historical Indian-language typography — without changing the rest of the pipeline.

See [`OCR/README.md`](./OCR/README.md) for details.

---

## Future Expansion

- Support for bound manuscripts, palm-leaf documents, and loose-leaf archival material
- Multi-language and script support (Devanagari, Tamil, Bengali, Urdu, and others)
- Handwritten Text Recognition (HTR) for pre-print manuscripts
- Automated metadata extraction from title pages, colophons, and covers
- Integration with national digital library standards (NDLI / Dublin Core)
- Multi-camera capture for curved-page geometry correction

---

## Status

> **Prototype stage.** The robotic arm mechanism and OCR sub-component are under active development. Hardware specifications will be documented once the design is finalised.
