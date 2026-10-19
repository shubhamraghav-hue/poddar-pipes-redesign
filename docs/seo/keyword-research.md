# Poddar Pipes: pre-launch SEO research (India)

**Research date:** 2026-10-19 (all sources accessed this date)
**Method and limits:** Read-only. Web search (a US-located search tool, not google.co.in), page fetches, `curl -I` header checks, and the public Google autocomplete endpoint with `gl=in`. **I could not observe live Google India SERPs.** That means SERP features (local pack, shopping ads, PAA boxes, video/image packs) and exact ranking positions were **not measured**. No keyword-volume tool (Keyword Planner, Ahrefs, Semrush) was available, and Google Trends returned HTTP 429. So this report has **no search-volume numbers**.

Labels: **[Verified]** = backed by the cited source. **[Third-party estimate]** = a number published by a third party. **[Observed SERP 2026-10-19]** = what the search tool or autocomplete returned today, which is a proxy for Google India, not the same thing. **[Unverified idea]** = a recommendation or inference.

---

## 1. Brand SERP and entity situation

### 1.1 What the live domain does today
- **[Verified]** `http://poddarpipes.com` returns 308 to `https://poddarpipes.com/`, which returns 308 to `https://www.poddarpipes.com/` (200, served by Vercel). The page is a "Poddar Pipes — Launching Soon" holding page. It carries `<meta name="robots" content="noindex">`, an Indiranagar/Domlur (Bengaluru 560008) address, hello@/HR/distributor emails, a "© 2026 Poddar Plumbing System Pvt. Ltd." line and social links. `/robots.txt` and `/sitemap.xml` both return 404. (curl + fetch of S1)
- **[Verified]** The preview `poddar-pipes-redesign.vercel.app` has robots.txt `Disallow: /`, a `noindex, nofollow` meta and canonical `https://www.poddarpipes.com`. A search for the preview hostname returned nothing, so it does not appear to be indexed. (curl, S2)
- **[Unverified idea]** At launch: remove `noindex` from production, ship a real robots.txt and sitemap.xml, and keep the preview blocked. With `Disallow: /`, Google never sees the preview's noindex. That is fine while the preview is not indexed, but if preview URLs ever get linked, use noindex without the Disallow, or put the preview behind auth.

### 1.2 Who ranks for the brand terms ("Poddar Pipes", "Poddar Plumbing", "Poddar Pipes products") [Observed SERP 2026-10-19]
- **No official Poddar Pipes page ranked** in the tool's results. That is expected, because the site is noindexed.
- **News about the right entity ranked:** Deccan Herald (AMP URL; the canonical returned 403 to my fetcher) and thepeoplemanagement.com cover Poddar Plumbing System Pvt Ltd. (S3, S4)
- **Conflicting "Poddar" entities ranked for "Poddar Pipes":**
  - **Poddar Enterprises, Nagpur** (IndiaMART + TradeIndia). A trader in GI/MS/DI/CPVC/uPVC pipes that lists its establishment year as 1972. It ranks prominently for "Poddar Pipes" and "Poddar Pipes products". **High brand-confusion risk.** (S5, S6)
  - **Orissa Plasto Pvt Ltd (Odisha).** A PVC pipe maker whose MD is Kaushal Poddar. It surfaced for "Poddar PVC pipes". (S7)
  - Unrelated noise also appeared: Wikipedia pages on Poddar family members, and US/UK plumbers named "PD/Power Plumbing".
- **[Verified] Ashirvad's own IndiaMART profile lists "Pawan Poddar, Managing Director" as the contact.** The profile shows a Bangarapet, Kolar district location and GST 29AABCA7061K1ZH. Searchers may therefore connect "Poddar" with Ashirvad, which is now owned by Aliaxis. (S8)
- **Autocomplete for "poddar pipes" (gl=in) [Observed 2026-10-19]:** bangalore, kolar, and fittings, logo, location, job vacancy, price list, website, careers. This shows **existing branded demand** (local, careers, price list and "website" intent) that the new site should answer with dedicated pages: contact/locations, careers, price-list/catalogue, plant. (S9)

### 1.3 News coverage (Verified, S3/S4; Deccan Herald canonical returned 403, so the facts come from the AMP listing snippet and thepeoplemanagement.com)
- Poddar Plumbing System Pvt Ltd raised its planned Karnataka investment from ₹492 cr to **₹758 cr**. The plant sits on **33 acres in Vemagal (spelled "Vemgal" in one source) Industrial Area Phase-2, Kolar**, on land acquired from KIADB. Reports targeted operations by **August 2026** and projected about 3,000 direct and 9,000 indirect jobs, plus a second unit proposed in **Vijayapura**. MD Deepak Poddar and Director Varun Poddar met Minister M.B. Patil.
- The coverage says the company was founded by the **former promoters of Ashirvad Pipes**, calling it the family's return to plumbing **after an eight-year break**. (S4)
- **I found no post-August-2026 report confirming that production has started.** Do not claim the plant is "operational" without confirming internally.
- **[Verified]** Tofler lists Deepak Poddar as a director. It gives a registration date of 20 July 2024, but that came from a search summary and should be treated as needing confirmation. (S10)

### 1.4 Heritage-claim sensitivity (important)
- **[Verified]** Aliaxis took 60% of Ashirvad in a 2013 JV, then 97% in 2018, then full ownership. Pawan Poddar stepped down as MD in 2018. (S11, S12)
- **[Observed]** Ashirvad's heritage is publicly described as "since 1975" (for example, a Bangalore-maker listing summary, S13). The new site's line "family active in PVC piping since 1975" therefore **overlaps a heritage claim a competitor also uses**.
- **[Unverified idea — needs legal/business sign-off]** Word any "since 1975" or legacy copy as a *family* history. Do not imply continuity with, or endorsement by, the Ashirvad brand. Do not use Ashirvad's name or marks without legal review, and check any non-compete or brand terms from the Aliaxis transaction.

---

## 2. Keyword clusters (India)

SERP-feature note: I **could not see** local packs, Shopping, PAA, video or image packs. The "page types" below come from the result lists the tool returned. "Demand signals" are Google autocomplete with `gl=in` (S9, S14–S22).

| Cluster | Dominant ranking page types [Observed SERP 2026-10-19] | Representative rankers | Autocomplete / demand signals [Observed] |
|---|---|---|---|
| CPVC pipes / CPVC pipe manufacturer | Manufacturer blogs and listicles ("why X is a leading CPVC maker", "top 10 CPVC companies"), plus manufacturer product pages and city landing pages | Astral (blog), Utkarsh, Prayag (listicles), APL Apollo (Ahmedabad city page), GlobalLinker | cpvc pipe price, hsn code, full form, sizes, length, 1 inch price, price 20 feet, fittings, cutter; "best cpvc pipe in india/brands/company/for hot water" |
| CPVC pipes price | Price aggregators (infralens.in city pages; third-party, April 2026 data) and marketplaces (TradeIndia) | infralens.in, TradeIndia | strong price intent at the size level (1", 20 ft) |
| uPVC pipes / manufacturer | Mid-tier manufacturer product pages and B2B directories (enggpro, GlobalLinker), plus Prince | Utkarsh, Prince, Ori-Plast, Prakash, directories | upvc pipe price, full form, 1 inch / 3/4 inch / 20 ft price, hsn code, fittings |
| SWR / SWR drainage | Manufacturer product pages and **PDF brochures** (Finolex SWR PDFs rank), plus e-commerce (L&T SuFin) | Hindware, Finolex, Utkarsh, Prakash PDF, L&T SuFin | swr pipe full form, fittings (name list), price, size, 4 inch price, meaning, hsn code, image |
| Agricultural / column pipe | Manufacturer product pages (Finolex Selfit/Ringfit, Vectus, Ashirvad, Apollo), catalogue PDFs | Finolex, Vectus, Ashirvad, Apollo | agriculture pipe 2/2.5/3/4 inch price, **subsidy**, shop near me; column pipe for borewell / submersible pump (price), adaptor, **"column pipe vs hdpe"**, "column pipe ashirvad" |
| UGD / underground drainage | BIS documents, Ashirvad UGD pages and blog, BSI/EN 13476 pages | services.bis.gov.in, Ashirvad | ugd pipe full form, price (per meter), price list, **standard / is code**, manufacturers, fittings |
| Water tanks / 4-layer / triple layer | Manufacturer blogs (Astral, Prince, Prayag), retailer guides, Vectus range pages, IndiaMART category pages, GeM catalogue | Astral, Prince, Prayag, Vectus, IndiaMART, studiomatrx | 4 layer water tank 500/750/1000/1500/2000 ltr price, "price supreme"; generic "water tank" autocomplete is dominated by **local Bangalore intent** (water tank bangalore, koramangala, near me, cleaning) |
| Pipe manufacturer in India | Listicles (Tofler, enggpro, Prayag, Ori-Plast), ensun directory | Finolex, Astral, Supreme, Apollo, Prince named most often | "pipe manufacturers in **bangalore**" is the #1 completion; "in karnataka" also appears |
| PVC pipe manufacturer Karnataka/Bangalore | **APL Apollo city template pages** (no Bangalore address on the page), IndiaMART (Avon Plastic, Ashirvad), TradeIndia, dial4trade, a SourcifyChina listicle | APL Apollo, Ashirvad, Avon Plastic (Bajajplast) | as above |
| CPVC vs uPVC (informational) | Manufacturer blogs dominate (Astral holds several URLs, including a web story; Ashirvad, Utkarsh, Plasto) | Astral, Ashirvad, Utkarsh, Plasto | cpvc vs upvc / pvc / ppr; **price difference**; **"in hindi"** |
| SWR vs UGD | **Weak SERP.** No result directly compared them; only SWR explainers ranked | Ori-Plast, Apollo, Vectus blog, Astral | thin coverage, so **an open content gap** |
| IS standards | BIS (services.bis.gov.in), law.resource.org / archive.org scans, GeM catalogues, infralens.in (third-party, unreliable), certification consultants | BIS, GeM, alephindia, infralens | "ugd pipes standard", "ugd pipe is code" |

Standards facts useful for spec pages (verify against the purchased BIS text before publishing):
- **IS 15778:2007 (CPVC, hot/cold potable)** **[Verified]**: the BIS scope says service up to 82°C, three SDRs, reviewed 2022, four amendments, *voluntary* certification per the BIS listing. Manufacturers market "93°C", and Astral's page itself mixes 82°C and 93°C. A third-party "2023 edition" claim was not confirmed. (S23, S24)
- **IS 4985 (uPVC pressure / agri)**: brands cite both **2000** and **2021** editions. Finolex now cites 2021. (S25)
- **IS 13592 (SWR)** with fittings under **IS 14735**. Type A covers rainwater/vent, Type B covers soil/waste, 2013 revision. (S26, S27)
- **IS 16098 (structured-wall non-pressure drains/sewers)** **[Verified]**: Part 1 = smooth external surface. Part 2 = non-smooth external / smooth internal, and the BIS summary describes it for **PE/PP** at 75–1200 mm. **Flag:** if Poddar's UGD pipe is a uPVC smooth-OD (foam-core or solid-wall) product, citing **IS 16098-2** may be wrong; Part 1 is the likely fit. **This needs confirming with the product team.** Ashirvad cites Part 1 for its UGD. (S28, S29)
- **IS 12701:1996 (rotomoulded PE water tanks)** **[Verified]**: reaffirmed 2006. An amendment allows single- or double-layer construction. The standard does **not** define "3-layer / 4-layer"; layer counts are marketing. (S30, S31)

---

## 3. Search demand
- **No volume numbers.** I could not access Keyword Planner, Ahrefs, Semrush or Google Trends (429). I found no credible public third-party volume estimates for these terms.
- **Third-party estimate (price, not volume):** infralens.in lists ½" CPVC at about ₹50–59/m by city and 20 mm branded at about ₹72–81/m, with an April 2026 header. Some figures are self-described as "inferred". (S32)
- **Qualitative signals [Observed 2026-10-19]:**
  - Product queries are dominated by **price at size level**, **"full form"**, **"hsn code"** (a B2B/GST intent), **sizes/length** and **fittings name lists**.
  - **Agri: "subsidy"** and borewell/submersible use cases.
  - **Tanks: capacity × layer × price**, and "near me" local intent.
  - **Brand:** "poddar pipes" already has location, careers, price-list and website completions.
  - **Hindi** comparison demand ("cpvc vs upvc in hindi"), which suggests value in the Hindi locale and possibly Kannada.
- **Not measured:** absolute volumes, seasonality, CTR, SERP features and ranking difficulty.

---

## 4. Competitor site architecture (observed 2026-10-19)

| Competitor | Architecture | Product-page pattern | Tools / resources |
|---|---|---|---|
| **Ashirvad (Aliaxis)** (S33, S34) | Audience-first navigation (For Individuals / For Businesses), then use case ("Bringing water into your home", "Managing wastewater"), then `/solution/<product-system>/`, then `/product/<sku>/` | Title: "CPVC Pipe for Hot Water \| Best CPVC Pipe Company in India - Ashirvad". H1 is the brand-system name plus benefit. Tabs: Products (filterable, ~70 items, "680+ SKUs"), Features, Applications, Resources (1 brochure PDF), **Installation (4 steps)**, **Do's & Don'ts**, FAQ. Standards shown only as logos (IS 15778, NSF 61, UPC); no spec table. About 1.5–2.5k words. | Dealer locator, **Calculator tools**, Design spec & installation support, **BIM library**, Plumbing School, blog, case studies, UGD technical manual PDF |
| **Astral** (S35, S36) | Products mega-menu of 12 categories, each listing sub-brands (CPVC PRO, Drain Pro, Foamcore, Underground…), with tank models down to per-capacity pages | Title: "CPVC Pipes & Fittings \| Best CPVC Pipe in India \| Astral Pipes". H1 is the sub-brand. Sections: features, applications, **Standards & Specifications (IS/ASTM)**, sizes (CTS/IPS), ~12 FAQs, **pressure-rating table**, handling/storage, **6-step installation**, gated catalogue. 3–4k words with heavy duplication and inconsistent temperature claims. | Catalogue page, Piping Guidelines, Become Dealer/Distributor, large blog plus **web stories**; very strong on informational SERPs |
| **Finolex** (S27, S37) | Category (Plumbing / Agriculture), then system (SWR), then variant (Ringfit / Selfit), with breadcrumbs | Title: "SWR Ringfit PVC Pipes Fitting \| Finolex Pipes". H1 is descriptive. Short prose overview (~170 words) plus **full dimension tables** (OD, wall min/max, socket dims, material codes, lengths), cut-length tables, **batch-number decoding**, 1 related product, enquiry form (state/city/pincode). No FAQ on the page. **Brochure PDFs rank on their own.** | Dealer locator, blog, WhatsApp, dealer registration |
| **Prince Pipes** (S38) | Product Range of 9 categories (Plumbing, Sewerage, Agri & Borewell, Underground, Water Tanks…) | (product page not sampled) | **2026 catalogue PDF + pan-India price-list flipbook**, Guides & Catalogues, blog, Become a Distributor, WhatsApp |
| **Supreme** (S39) | Corporate multi-business site; piping lives under `/pipe` | (not sampled) | Find a store, Become a dealer, brochures page, tagged blog |
| **Vectus (tanks + pipes)** (S40) | Tanks grouped by sub-brand (Vectus / Ganga / Waterwell), then model, with layer count (3–10) and capacity range | Title: "Best Overhead Plastic Water Tank in India \| Vectus". H1 "Water Tanks". Warranty wording is inconsistent across sections. | Channel-partner list, enquiry form with query type (Retail/Dealership/Project…), downloads |
| **APL Apollo (local SEO pattern)** (S41) | Programmatic city pages (`/pvc-pipe-manufacturer-in-bangalore`, `-in-karnataka`, `-in-ahmedabad`) | Keyword-stuffed template with no local address, specs or certifications; only Noida/Delhi addresses. **Ranks anyway**, which shows how weak the local "manufacturer in Bangalore" SERP is. | — |

**Schema:** JSON-LD is not visible through my fetch tool, which returns rendered text only, so **schema types were not verified** for any competitor.

---

## 5. Content gaps and differentiation (all [Unverified idea])
1. **IS-standard hub pages** (IS 15778, IS 4985, IS 13592/14735, IS 16098-1/-2, IS 12701). They should explain scope, edition, what the ISI mark means, and how to verify a CM/L licence. The current SERP is BIS PDFs, consultant pages and an unreliable aggregator. *Requires:* confirmed edition numbers, Poddar's actual BIS CM/L licence numbers (do not publish until the licences are issued and searchable), and IS 16098 Part 1 vs Part 2 for the UGD product.
2. **Real spec tables per SKU family**: OD, wall thickness, SDR/class, pressure at temperature, lengths, in a Finolex-style table without Astral's duplication. Mark up as `Product` + `Organization` schema. *Requires:* the final dimension data.
3. **SWR vs UGD explainer**: almost no competitor answers this directly. Cover where each is used, standards, stiffness, jointing and cost. Also a "column pipe vs HDPE" explainer, which is an autocomplete demand.
4. **Query-shaped FAQ blocks** answering "full form", "HSN code", "sizes", "fittings name list" and "which pipe for hot water". *Requires:* HSN codes confirmed by finance.
5. **Price-intent pages.** Competitors publish price lists (Prince flipbook). A downloadable MRP list or "get dealer price" page can capture "poddar pipes price list". *Requires:* a commercial decision.
6. **Layer explainer for tanks** stating honestly that IS 12701 does not define layers. Add capacity × layer pages (500/750/1000/1500/2000 L) to match autocomplete. *Requires:* the real tank range and certifications.
7. **Agri subsidy and borewell content**, such as state scheme explainers for Karnataka. *Requires:* checking current scheme facts.
8. **Genuine local pages** for Bengaluru (office) and Kolar/Vemagal (plant) with real NAP, photos and maps. This beats template city pages. Avoid publishing fake "manufacturer in <city>" pages for cities with no presence.
9. **Installation guides + Do's & Don'ts + calculators** (pipe sizing, tank capacity), which are table stakes at Ashirvad and Astral.
10. **Hindi (and possibly Kannada) versions** of the comparison explainers, given the "in hindi" demand.
11. **Branded-intent pages:** careers (job vacancy), plant location, "become a distributor", logo/press kit.

---

## 6. India-specific visibility levers
- **Google Business Profile [Verified guidelines, S42–S44]:** an eligible profile needs in-person customer contact during stated hours. Sales/leasing offices are eligible, while online-only businesses and lead-gen businesses are not. Service-area businesses must hide their address. *[Unverified idea]* The Bengaluru office qualifies only if it is staffed with signage and receives customers (distributors/dealers) during hours. The Vemagal plant can get its own profile only if it receives visitors or buyers in person. Use one profile per real location, not virtual offices.
- **B2B marketplaces (observed only):**
  - Ashirvad runs an IndiaMART manufacturer profile (S8).
  - Supreme-brand IndiaMART results are almost all **resellers**, not the manufacturer (S45).
  - IndiaMART and TradeIndia category pages rank for tanks and Bangalore pipe queries (S46).
  - Poddar Enterprises' IndiaMART/TradeIndia pages currently rank for "Poddar Pipes" (S5, S6).
  - I found **no Justdial** results for the brands I searched (not exhaustive).
  - *[Unverified idea]* A verified Poddar Plumbing System IndiaMART/TradeIndia profile linking to the official site would help disambiguate the brand. Claiming any listing or account requires the client's own action.
- **Associations/directories [Verified existence]:**
  - **Indian Plastics Institute** (ipiindia.org; professional body, 1985, Mumbai) (S47).
  - **PlastIndia Foundation** (sits on BIS CED 50 Plastic Piping Sectional Committee) (S48).
  - **Indian Pipe Manufacturing Association, New Delhi** (in the BIS Connect directory) (S49).
  - **All Kerala Small Scale PVC Pipe Manufacturers** (S48).
  - I did not verify membership terms or fees.
- **BIS licence lookup [Verified]:** BIS's portal is **manakonline.in** (S50). Third-party guides describe licence verification by CM/L number on the portal or in the **BIS Care app**, plus QR codes on licences (S51). *[Unverified idea]* Publish each IS licence's CM/L number on the spec pages with a "verify on BIS" instruction once the licences are issued.
- **Government procurement:** GeM catalogues reference IS 15778 and IS 12701 (S24, S31). A GeM seller presence could be relevant for institutional demand. *Requires:* a business decision.

---

## Sources (all accessed 2026-10-19)
- S1 https://www.poddarpipes.com/ (and https://poddarpipes.com/, http://poddarpipes.com, /robots.txt, /sitemap.xml via curl)
- S2 https://poddar-pipes-redesign.vercel.app/ and /robots.txt (curl)
- S3 https://www.deccanherald.com/amp/story/business%2Fcompanies%2Fpoddar-plumbing-to-invest-rs-758-crore-on-new-pipe-factory-in-karnatakas-vemagal-3654744 (canonical https://www.deccanherald.com/business/companies/poddar-plumbing-to-invest-rs-758-crore-on-new-pipe-factory-in-karnatakas-vemagal-3654744 returned 403)
- S4 https://thepeoplemanagement.com/poddar-plumbing-to-create-12000-new-jobs-through-an-investment-of-%e2%82%b9758-cr-in-karnataka/
- S5 https://m.indiamart.com/poddarenterprises/profile.html ; https://m.indiamart.com/poddarenterprises
- S6 https://www.tradeindia.com/products/upvc-pipes-1912528.html ; https://www.tradeindia.com/products/di-pipes-1912563.html
- S7 https://www.orissapost.com/be-up-to-date-with-changing-needs-of-market-poddar/amp/
- S8 https://m.indiamart.com/ashirvad-pip
- S9 https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=in&q=poddar%20pipes
- S10 https://www.tofler.in/deepak-poddar/director/00038685
- S11 https://www.ashirvad.com/?p=49161 ; https://www.epcworld.in/aliaxis-to-acquire-full-ownership-of-ashirvad-pipe/
- S12 https://lawyer-monthly.com/2018/09/aliaxis-group-acquires-a-stake-in-ashirvad-pipes ; https://www.crisil.com/mnt/winshare/Ratings/RatingList/RatingDocs/Ashirvad_Pipes_Private_Limited_July_16_2018_RR.html ; https://www.iflr1000.com/Deal/Profile/18045
- S13 Search-result summary of the "PVC pipe manufacturers in Bangalore Karnataka" SERP (Ashirvad "since 1975" listing) — https://m.indiamart.com/ashirvad-pip
- S14 https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=in&q=cpvc%20pipe
- S15 …&q=upvc%20pipe
- S16 …&q=swr%20pipe
- S17 …&q=ugd%20pipe
- S18 …&q=agriculture%20pipe
- S19 …&q=column%20pipe
- S20 …&q=4%20layer%20water%20tank ; …&q=water%20tank%20
- S21 …&q=cpvc%20vs ; …&q=best%20cpvc%20pipe
- S22 …&q=pipe%20manufacturers%20in%20
- S23 https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/Indian_standards/isdetails_mnd/7976 ; https://services.bis.gov.in/tmp/SR15778.pdf
- S24 https://bidplus.gem.gov.in/bidding/bid/showCatalogue/z2V8qgPabryBaEMIPhq6RP5yvmJBH0IRXFQAT4qOEho ; https://infralens.in/code/IS-15778-2023
- S25 https://www.finolexpipes.com/agriculture-pipes-fittings/ringfit-pvc-u-fit ; https://www.vectus.in/pipes-fittings/agriculture-bore-well/agri-piping-system ; https://ashirvad.com/?p=15586 ; https://www.apollopipes.com/public/single-product?id=3
- S26 https://hindware.com/swr-plumbing-system ; https://www.finolexpipes.com/site/assets/files/1045/SWR-BROCHURE.pdf
- S27 https://www.finolexpipes.com/plumbing-products/swr-pipes-fittings/swr-ringfit-pvc-pipes/
- S28 https://services.bis.gov.in/tmp/SR16098_2.pdf ; https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/Indian_standards/isdetails/MjMx
- S29 https://www.ashirvad.com/blog-filter/ugd-piping-system ; https://www.ashirvad.com/?p=48960 ; https://www.ashirvad.com/wp-content/uploads/2026/01/Ashirvad-UGD-Solutions-2.pdf
- S30 https://law.resource.org/pub/in/bis/S03/is.12701.1996.pdf
- S31 https://bidplus.gem.gov.in/bidding/bid/showCatalogue/W_6FUnQqa3psukA8Ol82uY5KjVCY86IN9f3DnXjyRIo ; https://www.studiomatrx.org/guides/plastic-water-tanks-india ; https://www.astralpipes.com/blogs/how-4-layer-water-tank-keep-your-water-fresh-and-safe/ ; https://www.princepipes.com/blogs/different-types-of-layered-water-tanks/ ; https://prayagindia.com/comparing-3-layer-vs-4-layer-prayag-storage-tanks-which-right-you
- S32 https://infralens.in/prices/plumbing ; https://www.tradeindia.com/manufacturers/cpvc-pipe.html
- S33 https://www.ashirvad.com/
- S34 https://www.ashirvad.com/solution/ashirvad-flowguard-plus-cpvc-piping-system/
- S35 https://www.astralpipes.com/
- S36 https://www.astralpipes.com/plumbing-pipes-fittings/cpvc-pro-pipes/
- S37 https://www.finolexpipes.com/swr-pipes-fittings
- S38 https://www.princepipes.com/
- S39 https://www.supreme.co.in/
- S40 https://www.vectus.in/water-storage-tanks
- S41 https://www.apollopipes.com/pvc-pipe-manufacturer-in-bangalore ; https://www.apollopipes.com/pvc-pipe-manufacturer-in-karnataka
- S42 https://support.google.com/business/answer/13763036?hl=en
- S43 https://support.google.com/business/answer/3038177?hl=en
- S44 https://support.google.com/business/answer/9157481?hl=en
- S45 https://dir.indiamart.com/impcat/supreme-pvc-pipes.html ; https://m.indiamart.com/impcat/supreme-swr-pipe.html
- S46 https://m.indiamart.com/impcat/water-storage-tanks.html ; https://m.indiamart.com/avonplastic-industries
- S47 https://www.ipiindia.org/about
- S48 https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/dgdashboard/committee_sso/composition/217/2 ; https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/dgdashboard/committee_sso/composition/274/4
- S49 https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/organizations/ActiveOrganization/index/3800
- S50 https://www.bis.gov.in/product-certification/product-certification-faq/?lang=en
- S51 https://www.registerkaro.in/post/how-to-check-bis-certificate-status-online ; https://www.psrcompliance.com/blog/how-to-check-bis-certificate-online
- Other SERP results consulted: https://www.astralpipes.com/blogs/why-astral-is-among-the-leading-cpvc-pipe-manufacturers-in-india/ ; https://prayagindia.com/top-10-cpvc-pipe-companies-in-india ; https://www.apollopipes.com/leading-cpvc-pipe-manufacturer-in-ahmedabad ; https://utkarshindia.in/products/pipes ; https://www.tofler.in/blog/?p=4485 ; https://www.enggpro.com/blogs/?p=951 ; https://www.ashirvad.com/blog/difference-between-cpvc-upvc-pipes ; https://www.astralpipes.com/blogs/what-is-the-difference-between-cpvc-and-upvc/ ; https://www.apollopipes.com/blog/what-are-swr-drainage-pipes-and-how-do-they-work ; https://www.vectus.in/vectuslanding ; https://okcredit.in/blog/water-tank-manufacturers-in-india ; https://www.astralpipes.com/wp-content/uploads/2022/12/cpvc-pro.pdf
