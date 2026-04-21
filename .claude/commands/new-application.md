---
allowed-tools: Bash(bun run tailor-server:*), Bash(mkdir:*), Bash(cp:*), BashOutput, Read, Write, Edit, Glob
description: Create a new job application based on ditio, start the tailor server | argument-hint company-name
---

# New Application — ditio-based fast track

Creates a complete job application for a new company by cloning the ditio resume as-is and writing a fresh cover letter. Only the PROFIL (summary) section of the resume is adapted to the new job.

## Usage

```
/new-application company-name

[Paste full job posting text below]
```

The `company-name` argument becomes the folder slug (e.g. `acme-corp` → `resume-data/tailor/acme-corp/`). If not provided as argument, derive it from the job posting.

---

## Step 1 — Check for existing folder

Before doing anything, check if `resume-data/tailor/[slug]/` already exists. If it does, warn the user:

> ⚠️ Folder `resume-data/tailor/[slug]/` already exists. Continuing will overwrite all files. Proceed?

Wait for confirmation before overwriting.

---

## Step 2 — Read base files

Read these files in full — they are the single source of truth for the resume:

- `resume-data/tailor/ditio/resume.yaml`
- `resume-data/tailor/ditio/cover_letter.yaml` (for structural reference — do NOT copy content)
- `resume-data/tailor/ditio/metadata.yaml` (for structural reference)
- `resume-data/tailor/ditio/job_analysis.yaml` (for structural reference)

---

## Step 3 — Parse the job posting

Extract from the job posting text:

| Field | Notes |
|-------|-------|
| `company` | Display name (e.g. "Acme Corp AS") |
| `slug` | Lowercase, hyphens (e.g. "acme-corp") |
| `position` | Job title as written in posting |
| `location` | City / address if present |
| `employment_type` | Fast / Kontrakt / etc. |
| `experience_level` | Junior / Mid / Senior |
| `language` | Norwegian if posting is in Norwegian, English if in English |
| `tech_stack` | List of technologies mentioned |
| `must_have_skills` | Skills listed as required |
| `nice_to_have_skills` | Skills listed as preferred |
| `team_context` | Team size, culture, reporting structure |
| `user_scale` | Company size / product scale if mentioned |

Today's date: use system date via `date` command for timestamps.

---

## Step 4 — Create the five files

Create `resume-data/tailor/[slug]/` and write all five files.

### 4a. `job_posting.md`

Save the raw job posting text verbatim, unmodified. No headers, no formatting changes.

### 4b. `job_analysis.yaml`

Write a structured analysis of the job posting. Follow the ditio structure exactly — same keys, same nesting. Adapt all values to the new job.

Required top-level structure:
```yaml
version: '2.0.0'
analysis_date: '[YYYY-MM-DD]'
source: '[Where the posting was found, or "Provided by user"]'

job_analysis:
  company: '[Display name]'
  position: '[Position title]'
  job_focus:
    - primary_area: '[engineer|product|data|design|qa|devops]'
      specialties: ['...']
      weight: 0.XX   # All weights must sum to 1.0
  location: '...'
  employment_type: '...'
  experience_level: '...'
  requirements:
    must_have_skills:
      - skill: '...'
        priority: N   # 1-10
    nice_to_have_skills:
      - skill: '...'
        priority: N
    soft_skills: ['...']
    experience_years: N
    education: '...'
  responsibilities:
    primary: ['...']
    secondary: ['...']
  role_context:
    department: '...'
    team_size: '...'
    key_points: ['...']
  candidate_alignment:
    strong_matches: ['...']
    gaps_to_address: ['...']
    transferable_skills: ['...']
    emphasis_strategy: '...'
  section_priorities:
    technical_expertise: ['...']
    experience_focus: '...'
    project_relevance: '...'
  optimization_actions:
    LEAD_WITH: ['...']
    EMPHASIZE: ['...']
    QUANTIFY: ['...']
    DOWNPLAY: ['...']
  ats_analysis:
    title_variations: ['...']
    critical_phrases: ['...']
  application_info:
    posting_url: ''
    posting_date: '[YYYY-MM-DD if known]'
    deadline: '[Deadline if mentioned, else "Snarest"]'
```

For `candidate_alignment`, genuinely assess how Elias's background maps to this job. Reference specific projects (Fondsoversikt, masteroppgave, Kystverket, militæret) where relevant.

### 4c. `metadata.yaml`

Same structure as ditio's metadata.yaml. Derive `primary_focus` from the top job_focus entry:
- Format: `[primary_area] + [specialties as comma-separated list in brackets]`
- Example: `engineer + [react, typescript, python]`

Set `active_template`:
- `classic` if posting language is Norwegian
- `modern` if posting language is English

```yaml
version: '2.0.0'
metadata:
  last_updated: '[Langevåg, [weekday] [DD]. [month] [YYYY]]'

company: '[Display name]'
position: '[Position title]'
active_template: classic   # or modern for English postings
primary_focus: '[primary_area] + [specialties]'
folder_path: 'resume-data/tailor/[slug]'
last_updated: '[YYYY-MM-DDT00:00:00.000Z]'
job_summary: >
  [2-3 sentence summary of the role. Max 100 words. Company context, what they're looking for, key tech.]

available_files:
  - metadata.yaml
  - resume.yaml
  - job_analysis.yaml
  - cover_letter.yaml
  - job_posting.md

job_details:
  company: '[Display name]'
  location: '...'
  experience_level: '...'
  employment_type: '...'
  user_scale: '...'
  must_have_skills:
    - '[top 5-6 skills from job_analysis]'
  nice_to_have_skills:
    - '[top 4-5 skills from job_analysis]'
  team_context: >
    [Team culture, structure, collaboration style. 1-2 sentences.]
```

### 4d. `resume.yaml`

**CRITICAL: Copy the entire `resume-data/tailor/ditio/resume.yaml` byte-for-byte — DO NOT change any field except `resume.summary`.**

Fields that must be identical to ditio (copy without modification):
- `resume.name`
- `resume.profile_picture`
- `resume.title`
- `resume.contact`
- `resume.skills`
- `resume.professional_experience` (entire section)
- `resume.independent_projects` (entire section)
- `resume.technical_expertise` (entire section)
- `resume.education` (entire section)
- `resume.military_service` (entire section, if present)
- `resume.locale` (if present)
- Any other fields not explicitly listed above

**Only `resume.summary` changes.** Write a new summary tailored to the specific job:

Summary rules:
- 3-5 sentences, paragraph form (not bullets)
- Match the language of the job posting
- Sentence 1: Identity + degree (can reuse ditio's opener, adapted)
- Sentence 2-3: Connect specific skills/experience to what the job asks for — reference the actual tech stack or domain from the posting
- Sentence 4-5: Signal on approach, work style, or a relevant strength
- Do NOT exaggerate. Do NOT claim experience that doesn't exist in ditio's resume
- Do NOT use em dash (—). Use comma or period instead
- Tone: direct, confident, not corporate

### 4e. `cover_letter.yaml`

Write a fresh cover letter. Do NOT copy ditio's cover letter content — only reuse the structural schema.

Schema:
```yaml
version: '2.0.0'
analysis_date: '[YYYY-MM-DD]'

cover_letter:
  name: 'Elias Lerheim Birkeland'
  company: '[Display name]'
  position: '[Position title]'
  primary_focus: '[primary_area from job_analysis]'
  date: '[DD. month YYYY in Norwegian, or Month DD, YYYY in English]'

  personal_info:
    address: 'Stadsnesvegen 41, 6030 Langevåg'
    email: 'birkeland.elias@outlook.com'
    phone: '94164312'
    linkedin: 'https://www.linkedin.com/in/elias-lerheim-birkeland/'
    github: 'https://github.com/elibir'

  content:
    letter_title: '[Søknadsbrev – Position Title | Cover Letter – Position Title]'
    opening_line: ''
    body:
      - '[Paragraph 1]'
      - '[Paragraph 2]'
      - '[Paragraph 3]'
      - '[Paragraph 4 — optional]'
    signature: |
      Med vennlig hilsen,
      Elias Lerheim Birkeland
```

**Cover letter content rules:**

Tone: Direct and confident. Sounds like a person who has thought about why they want this job, not a template filled in with company names.

Structure (3-4 paragraphs):
1. Why this company/role specifically — what caught your eye in the posting. One dry/self-aware humor beat goes here or in paragraph 2 (see below).
2. What you bring — reference 1-2 concrete projects (Fondsoversikt, masteroppgave, Kystverket, militæret) that connect to what the job needs. Be specific: tech used, what you built or learned.
3. A second concrete angle — either a different project, or a skill/approach that's particularly relevant to this job.
4. (Optional) Short closing — genuine interest, not filler. Conversational.

**Humor rule:** Include exactly ONE dry/self-aware line. Place it naturally — don't force it. The line should feel like a real person acknowledging something slightly awkward or amusing about the situation, then moving on. Calibrate it to 2026: the AI moment, being a new grad, etc.

Good reference tone (adapt to context, don't copy verbatim):
> "Jeg er riktignok nyutdannet, men jeg har allerede lært det viktigste: å lime inn feilmeldingen i en chatbot og trykke enter."

The humor should be self-aware but not self-deprecating in a way that undermines the application. One line. Then continue normally.

**Banned constructs — NEVER use these:**
- Em dash `—` (use comma or period instead)
- "Jeg søker herved"
- "Til [firma] AS" as an opening body line
- "leverage", "seamlessly", "delve", "spearhead", "synergy"
- "I am passionate about"
- "in today's fast-paced [world/landscape/environment]"
- "Det er med stor glede"
- "I am writing to express my interest"
- "jeg er en sterk kandidat"
- "jeg vil være en verdifull ressurs"
- Bullet points inside body paragraphs
- Any sentence starting with "I thrive in..."
- Overuse of "genuint" / "genuine" (once max per letter)

**Language auto-detection:**
- Norwegian job posting → Write letter in Norwegian. Signature: "Med vennlig hilsen,"
- English job posting → Write letter in English. Signature: "Best regards," or "Kind regards,"

---

## Step 5 — Start the tailor server

After all files are written and validated, run the tailor server:

```
/tailor [slug]
```

Wait for `✅ Tailor server ready` in the logs before confirming to the user.

Confirm setup:
```
✅ Application created for [Company Name]
🌐 Dev server running at http://localhost:3000
📁 resume-data/tailor/[slug]/
📄 5 files created: metadata, job_analysis, resume, cover_letter, job_posting

Resume: ditio base with new PROFIL section
Cover letter: fresh, [Norwegian|English], [template] template

What would you like to refine? I can adjust the summary, cover letter tone, or any other section.
```

---

## Step 6 — PDF save (on demand)

When the user says "save to pdf", "lagre som pdf", "generer pdf", or similar:

1. Run `/generate-pdf [slug] both`
2. Create `~/Downloads/[slug]/` if it doesn't exist
3. Copy the generated PDFs there

Confirm with the exact file paths where PDFs were saved.

---

## Notes

- **Conservative approach**: When in doubt about the summary, under-claim rather than over-claim. The resume content (experience, projects) already speaks for itself.
- **Slug format**: lowercase, hyphens for spaces, no special characters. "Acme Corp AS" → "acme-corp"
- **Template**: `classic` for Norwegian postings, `modern` for English postings. User can override in tailor mode.
- **The humor beat**: If the job posting is clearly from a very conservative/formal context (law firm, government, finance), include the humor beat anyway but make it subtler. It's one line — it won't sink the application, and it's what makes the letter sound like a human wrote it.
