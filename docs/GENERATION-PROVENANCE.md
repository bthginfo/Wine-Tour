# Generated knowledge-image provenance

These first eleven assets were generated with the built-in `image_gen` tool, one image per prompt. The tool does not expose a model version in its result. Original PNG outputs are retained beside the optimized runtime JPEGs. The JPEGs were encoded from the PNGs with the existing Windows `System.Drawing` encoder (quality 82; `lesson-germany-origin` quality 78); no image-generation SDK or new dependency was added.

The full record inventory and current coverage states are in [`generated-knowledge-coverage.json`](./generated-knowledge-coverage.json). Prompts for future records are stored once as type-level templates there, with each record's ID and prompt context, rather than duplicating a long prompt hundreds of times.

## Generated assets

| Entity ID | Runtime image | Original | Notes |
| --- | --- | --- | --- |
| region `franschhoek` | `region-franschhoek-v1.jpg` | `region-franschhoek-v1.png` | Painterly landscape reconstruction; not a real estate photograph. |
| region `champagne` | `region-champagne-v1.jpg` | `region-champagne-v1.png` | Vineyard hills and chalk-country landscape; no map or boundaries. |
| region `napa-valley` | `region-napa-valley-v1.jpg` | `region-napa-valley-v1.png` | Valley landscape; no AVA boundaries or named estate. |
| region `rioja-alta` | `region-rioja-alta-v1.jpg` | `region-rioja-alta-v1.png` | Ebro-basin vineyard landscape; no appellation boundaries. |
| region `stellenbosch` | `region-stellenbosch-v1.jpg` | `region-stellenbosch-v1.png` | Cape foothill landscape; no named farm or estate. |
| grape `riesling` | `grape-riesling-aroma-v1.jpg` | `grape-riesling-aroma-v1.png` | Symbolic aroma still-life; not cultivar morphology. Existing PlantGrape photos remain. |
| grape `cabernet-sauvignon` | `grape-cabernet-sauvignon-aroma-v1.jpg` | `grape-cabernet-sauvignon-aroma-v1.png` | Symbolic aroma still-life; not cultivar morphology. Existing PlantGrape photos remain. |
| lesson `vine-anatomy` | `lesson-vine-anatomy-v1.jpg` | `lesson-vine-anatomy-v1.png` | Generic Vitis vinifera anatomy, not a named cultivar. |
| lesson `germany-origin` | `lesson-germany-origin-v1.jpg` | `lesson-germany-origin-v1.png` | River-valley vineyard inspiration; no map or appellation boundary. |
| lesson `fermentation` | `lesson-fermentation-v1.jpg` | `lesson-fermentation-v1.png` | Educational fermentation cutaway; no claim that bubbles alone prove completion. |
| guide `glassware-anatomy` | `guide-glassware-anatomy-v1.jpg` | `guide-glassware-anatomy-v1.png` | Supplemental illustration; the guide's existing dedicated image is retained. |

## Prompt records

### Region landscapes

The four prompts below were supplied verbatim by the regional-image agent. Sources were used as factual guardrails for broad landscape cues; the illustrations are not maps, property photographs, or official boundary depictions.

#### Champagne (`champagne`)

```text
Use case: stylized-concept; Asset type: wide landscape illustration for a premium educational wine-region atlas; Primary request: create an original, specific Champagne vineyard landscape, grounded in documented regional features; Scene/backdrop: gently rolling chalk-country hills in northeastern France, a broad hillside vineyard landscape, a modest river valley receding in the distance, wooded ridge lines above vine slopes; Subject: closely planted, orderly vineyard rows contouring sun-facing hillsides, chalky pale earth visible in a few eroded banks, small generic village forms far away with no recognizable estate or landmark; Style/medium: painterly editorial landscape in fine gouache, watercolor and restrained graphite on warm ivory archival paper; sophisticated, tactile, varied brushwork and subtle paper grain; calm, premium wine atlas art; Composition/framing: wide horizontal 3:2 landscape panorama; layered foreground, middle-ground and distant rolling hills; natural perspective, no diagram framing; Lighting/mood: cool northern spring light with soft breaks of sunshine; quiet, cultivated, lightly atmospheric; Color palette: warm cream paper, chalk white, soft green vines, muted sage and woodland green, pale blue-gray distance, restrained burgundy accents only in tiny natural details; Materials/textures: visible paper fibers, delicate dry-brush marks, finely observed vineyard lines, chalk and limestone textures; Constraints: the vineyard slopes should be the main subject; original illustration, not a literal map or a photo of a named estate; no text, no labels, no numerals, no borders, no logos, no watermark; Avoid: champagne bottles, glasses, corks, luxury-party imagery, famous winery buildings, invented landmarks, fake appellation boundaries, geographic labels, photorealism, copied publisher artwork, Wine Folly style.
```

Sources: [Comité Champagne — topography](https://www.champagne.fr/en/about-champagne/the-champagne-terroir/champagne-and-its-topography), [region](https://www.champagne.fr/en/about-champagne/a-great-blended-wine/the-champagne-region), [soils](https://www.champagne.fr/en/about-champagne/the-champagne-terroir/champagne-and-its-soil).

#### Napa Valley (`napa-valley`)

```text
Use case: stylized-concept; Asset type: wide landscape illustration for a premium educational wine-region atlas; Primary request: create an original Napa Valley vineyard landscape, grounded in documented regional features; Scene/backdrop: a long, relatively narrow California wine valley between the wooded Mayacamas Mountains on one side and rugged Vaca Range on the other, with the Napa River threading through the valley floor and distant hills narrowing toward a mountain headland; Subject: a varied mosaic of vineyards across low alluvial valley-floor fans and foothills, a few rocky volcanic hillside patches, low marine fog lingering over the southern valley floor while upper slopes catch warm late-day light; Style/medium: painterly editorial landscape in fine gouache, watercolor and restrained graphite on warm ivory archival paper; sophisticated, tactile, varied brushwork and subtle paper grain; calm, premium wine atlas art; Composition/framing: wide horizontal 3:2 landscape panorama; layered foreground vines, broad central valley and enclosing mountain ranges; a natural vista rather than a postcard landmark view; Lighting/mood: clear Mediterranean late-afternoon light, cool fog in the low distance, gentle contrast and a sense of geographic variety; Color palette: warm cream paper, subdued sage and olive greens, muted golden grass, slate blue-gray mountains and a restrained burgundy accent; Materials/textures: visible paper fibers, delicate dry-brush, carefully observed vine rows, rocky soil and atmospheric haze; Constraints: valley topography and contrasting mountain walls should read clearly; original illustration, not a literal map or photo of any named estate; no text, labels, numerals, borders, logos, watermark; Avoid: bottles, glasses, luxury-party imagery, famous winery buildings, invented landmarks, fake AVA boundaries, geographic labels, photorealism, copied publisher artwork, Wine Folly style.
```

Sources: [Napa Valley Vintners — geography](https://napavintners.com/napa_valley/science/geography/), [climate](https://napavintners.com/napa_valley/science/climate/), [soils and geology](https://napavintners.com/napa_valley/science/soils-and-geology/).

#### Rioja Alta (`rioja-alta`)

```text
Use case: stylized-concept; Asset type: wide landscape illustration for a premium educational wine-region atlas; Primary request: create an original Rioja Alta vineyard landscape, grounded in documented regional features; Scene/backdrop: the western Rioja wine country in northern Spain, an open Ebro-basin landscape of low hills, natural terraces and broad alluvial plains, with a quiet river bend and the distant foothills of the Sierra de la Demanda; Subject: patchworked vineyard rows across gentle slopes and stepped river terraces, subtle differences between ochre clay-limestone ground and reddish ferrous-clay earth, scattered small groves and dry cultivated fields; no identifiable town or estate; Style/medium: painterly editorial landscape in fine gouache, watercolor and restrained graphite on warm ivory archival paper; sophisticated, tactile, varied brushwork and subtle paper grain; calm, premium wine atlas art; Composition/framing: wide horizontal 3:2 panorama; expansive foreground vineyard, mid-distance terraces and river, soft mountain foothills on the horizon; realistic low-relief valley view, not a map; Lighting/mood: clear late-season morning after a cool night, dry golden light, restrained atmospheric distance; Color palette: warm cream paper, muted olive and sage vines, sunlit ochre and clay reds, slate-blue distant foothills, restrained burgundy accents; Materials/textures: visible paper fibers, delicate dry-brush, fine vine-row marks, subtly varied earth and stony terrace edges; Constraints: show a varied but mostly open terrain rather than dramatic alpine peaks; original illustration, not a literal map or a photo of a named estate; no text, labels, numerals, borders, logos, watermark; Avoid: Rioja branding, bottles, glasses, famous winery buildings, invented landmarks, fake appellation boundaries, geographic labels, photorealism, copied publisher artwork, Wine Folly style.
```

Sources: [Rioja Wine — areas](https://riojawine.com/en-gb/blog/qdo-rioja-areas/), [geography and terroirs](https://riojawine.com/en-gb/blog/geography-and-terroirs-of-rioja/), [Rioja Alta](https://riojawine.com/en-us/production-areas/rioja-alta/).

#### Stellenbosch (`stellenbosch`)

```text
Use case: stylized-concept; Asset type: wide landscape illustration for a premium educational wine-region atlas; Primary request: create an original Stellenbosch vineyard landscape, grounded in documented regional features; Scene/backdrop: the Cape Winelands in South Africa around Stellenbosch, with vineyard hills at the foot of the folded Stellenbosch and Helderberg mountain ranges; distant coastal haze hints at nearby False Bay, without showing a specific landmark; Subject: vineyards draped over rolling foothills and mountain slopes, alternating red-brown weathered ground, muted granite and shale outcrops, a few scattered oak trees at the valley edge; no named farm, estate, manor or town; Style/medium: painterly editorial landscape in fine gouache, watercolor and restrained graphite on warm ivory archival paper; sophisticated, tactile, varied brushwork and subtle paper grain; calm, premium wine atlas art; Composition/framing: wide horizontal 3:2 panorama; textured vineyard foreground, layered rolling slopes and an embracing mountain amphitheatre; balanced natural vista, no postcard framing; Lighting/mood: bright, dry Mediterranean late-summer light softened by a subtle cool sea breeze haze; peaceful and cultivated; Color palette: warm cream paper, muted olive and sage vines, red-brown earth, smoky blue and mauve mountains, delicate pale coastal haze, small restrained burgundy accents; Materials/textures: visible paper fibers, fine brush marks, carefully observed vine rows, rock and weathered earth textures; Constraints: emphasize the mountainous terrain and varied foothill vineyards; original illustration, not a literal map or a photo of a named estate; no text, labels, numerals, borders, logos, watermark; Avoid: Cape Dutch manor houses or famous winery buildings, bottles, glasses, luxury-party imagery, invented landmarks, fake ward or appellation boundaries, geographic labels, photorealism, copied publisher artwork, Wine Folly style.
```

Sources: [Wines of South Africa — winelands](https://www.wosa.co.za/The-Industry/Winegrowing-Areas/Winelands-of-South-Africa/), [soil](https://www.wosa.co.za/The-Industry/Terrior/Soil/).

#### Franschhoek (`franschhoek`)

Owner-provided generation brief: original Cape Winelands valley with mountains, vine rows, native scrub and a small Cape Dutch farmstead; late-afternoon painterly landscape in a wide 3:2 composition. No real-estate or estate photograph, maps, labels, or snow-capped Andes. This brief is recorded as supplied to the task; the raw generation-call text was not returned separately.

Source: [Wines of South Africa — Winelands](https://www.wosa.co.za/The-Industry/Winegrowing-Areas/Winelands-of-South-Africa/).

### Grape aroma still-lifes

Owner-provided generation brief for `riesling`: warm-ivory-paper watercolor still-life with a pale straw wineglass and green apple, cut peach and lemon peel outside the glass as aroma references. No ingredients in the wine, text, grapes, leaves, or cultivar morphology.

Source: [Deutsches Weininstitut — Riesling](https://www.deutscheweine.de/rebsorte/105/riesling/).

Owner-provided generation brief for `cabernet-sauvignon`: a distinct watercolor still-life with a red-wine glass and separate blackcurrants, cut green pepper and liquorice root as aroma references. No grape bunches, leaves, oak, universal-aging claim, or text.

Source: [Deutsches Weininstitut — Cabernet Sauvignon](https://www.deutscheweine.de/rebsorte/86/cabernet-sauvignon/).

### Learning illustrations

The four prompts below were supplied verbatim by the learning-illustration agent. Existing guide art is retained; `glassware-anatomy` is a supplemental detail-page image.

#### Glassware guide (`glassware-anatomy`)

```text
Use case: scientific-educational
Asset type: premium editorial lesson illustration for a multilingual wine-learning app
Primary request: Show how wine-glass geometry changes headspace and aroma delivery without implying a quality ranking.
Scene/backdrop: A calm, warm ivory studio surface, subtle pale parchment background, very restrained cellar-studio atmosphere.
Subject: Three realistic, empty-handed clear stemmed wine glasses viewed at a gentle three-quarter angle, each with the same small measured pour of ruby wine: a narrow sparkling-wine tulip, a balanced versatile tulip with a bowl wider than its rim, and a broad Burgundy-style bowl that gently narrows toward its rim. Show anatomically plausible vessels: continuous thin rims, rounded bowl transitions, slender stems and stable feet; consistent glass scale.
Style/medium: refined painterly technical illustration, fine watercolor-and-gouache shading combined with crisp naturalistic contours, premium scientific textbook art, restrained and elegant, not photoreal product advertising.
Composition/framing: wide horizontal 3:2 composition; glasses spaced clearly in a left-to-right comparison, full silhouettes visible, eye-level slightly above the pour line; keep background uncluttered and leave modest quiet margins around the objects.
Lighting/mood: soft side light revealing transparent glass edges and wine surface, calm curious museum-study mood.
Color palette: warm ivory, pale stone, muted burgundy, subtle charcoal contours, restrained amber highlights.
Materials/textures: delicate transparent glass with accurate refraction and restrained reflections; wine remains a simple liquid surface, no garnish.
Constraints: accurate differences in bowl volume, rim diameter and headspace; same pour size and same wine in every glass; no one glass presented as best.
Avoid: all text, labels, letters, numbers, arrows, diagrams, logos, watermarks, hands, bottles, grapes, extra props, warped glass, impossible stems, thick cartoon outlines, dramatic colored liquid gradients.
```

Source: [AWRI — sensory evaluation considerations](https://www.awri.com.au/industry_support/winemaking_resources/sensory_assessment/considerations/).

#### Vine anatomy (`vine-anatomy`)

```text
Use case: scientific-educational
Asset type: premium editorial lesson illustration for a multilingual wine-learning app
Primary request: A botanically credible study of the anatomy of a common grapevine (Vitis vinifera), useful for teaching shoot, leaf, tendril, grape cluster and root structure without claiming to depict a particular cultivar.
Scene/backdrop: Clean warm ivory botanical-plate background with a faint natural-paper texture, no landscape scene.
Subject: One coherent grapevine specimen arranged as a living shoot connected to a mature trunk and a below-ground branching root system. Show alternate leaves with five-lobed, palmate grape-leaf silhouettes and clear radiating veins; slender green shoot with visible nodes and internodes; coiled tendrils opposite some leaves; a small inconspicuous flower cluster at one node and a separate compact cluster of ripe grape berries at a later node; woody cane and trunk leading to irregular fine branching roots in a shallow soil cutaway. Do not imply every node carries both a tendril and cluster.
Style/medium: sophisticated botanical scientific illustration rendered in luminous watercolor and precise ink, subtly painterly, fine botanical detail, modern wine-textbook quality.
Composition/framing: Wide horizontal 3:2 composition; full vine specimen visible from root structure through trunk and leafy shoot, balanced natural posture, generous negative space for optional app overlays; clean separation of green vine from pale background.
Lighting/mood: soft natural daylight, quiet observational study.
Color palette: layered leaf greens, muted warm brown wood and soil, tiny pale green flowers, dusky purple-red berries, ivory paper.
Materials/textures: delicate but accurate leaf veining, matte bark and fine roots, natural grapes with a light bloom.
Constraints: depict generic Vitis vinifera rather than a named cultivar; correct alternate leaves, tendrils, inflorescence/fruit cluster and branching roots; use no labels so localized UI can explain parts.
Avoid: all text, letters, numbers, arrows, lines connecting labels, logos, watermarks, decorative vineyard landscape, fantasy tendrils, invented leaf lobing, giant grape berries, roots shaped like a single carrot taproot, flowers and ripe fruit on the exact same cluster.
```

Sources: [Cornell — roots](https://cals.cornell.edu/news/2019/08/grapes-101-grapevine-roots), [Cornell — flowers](https://cals.cornell.edu/news/2018/11/grapes-101-grapevine-flowers), [Penn State — dormant cane and spur pruning](https://extension.psu.edu/dormant-cane-and-spur-pruning-in-bunch-grape-vineyards).

#### German wine origin (`germany-origin`)

```text
Use case: scientific-educational
Asset type: premium editorial lesson illustration for a multilingual wine-learning app about German wine origin
Primary request: Depict a German wine-growing landscape as a visual entry point to understanding how river, slope, exposure and site shape a regional origin, without turning scenery into a flavor claim or a national map.
Scene/backdrop: A cool-climate German river-valley vineyard, visually inspired by steep Mosel country but not presented as a named single vineyard or as all of Germany.
Subject: A sweeping natural river bend below steep, carefully terraced vineyard slopes; narrow vine rows follow the contours of sun-facing slate hillsides, with visible grey slate fragments and dry-stone terrace walls, a small quiet riverside village in the distance, and cool forested high ground beyond. Show the river as an important landscape feature moderating the nearby valley, not as a decorative blue stripe.
Style/medium: painterly technical landscape illustration for a sophisticated wine-learning textbook, expressive watercolor and gouache with fine topographic detail, naturalistic and grounded rather than postcard kitsch.
Composition/framing: Wide horizontal 3:2 landscape, layered view from the vineyard edge toward the river bend and opposite slopes; distinct readable layers of foreground vine rows, midground river and far hillside; generous calm sky and uncluttered visual reading.
Lighting/mood: clear soft late-afternoon light with cooler valley air, calm and observant.
Color palette: slate grey, river blue-grey, subdued vineyard greens, warm ivory sky, restrained autumn gold.
Materials/textures: clearly readable broken slate, terraced earth and stone, vine rows planted on steep gradients; atmospheric distance.
Constraints: portray a plausible steep German river-vineyard setting, not a literal or fabricated appellation map; show landscape diversity without asserting that every German region is steep or slate-rich; no labels so localized learning UI can explain origin and legal hierarchy.
Avoid: all text, labels, letters, numbers, map outlines, flags, wine bottles, castles, folklore clichés, exaggerated cliffs, impossible river geometry, vivid fantasy colors, logos, watermark.
```

Sources: [Wines of Germany — regions](https://www.winesofgermany.com/our-wine/wine-growing-regions), [quality standards](https://www.winesofgermany.com/our-wine/quality-standards), [wine law](https://www.winesofgermany.com/wine-industry/wine-law-and-regulations), [Prädikate](https://www.ch.deutscheweine.de/qualitaetstandard/449/pr%C3%A4dikate).

#### Fermentation (`fermentation`)

```text
Use case: scientific-educational
Asset type: premium editorial lesson illustration for a multilingual wine-learning app, alcoholic fermentation module
Primary request: Visually explain alcoholic fermentation as yeast converting fermentable grape sugars into ethanol, carbon dioxide and heat, with the tank shown as a living process rather than a simple bubbling prop.
Scene/backdrop: Quiet modern winery cellar, softened into a clean warm ivory educational plate with no brand identity.
Subject: A cutaway stainless-steel fermenter holding pale grape must, seen as one coherent vessel; show fine, restrained carbon-dioxide bubbles rising through the liquid into a small headspace and venting safely through the tank's top valve, a subtle warm tone around the active vessel to suggest generated heat, and a modest sample glass of young wine nearby. Include a separate small magnified circular inset of several microscopic oval wine-yeast cells (Saccharomyces cerevisiae), with a few visibly budding; the cells are only in the inset, not giant organisms inside the vat.
Style/medium: sophisticated painterly technical illustration, translucent watercolor and gouache with precise clean ink contours, modern scientific textbook art, inviting but not playful or cartoonish.
Composition/framing: wide horizontal 3:2 composition; fermenter centered as the main focus, readable liquid cross-section and tiny bubbles, inset small and discreet, sample glass secondary; uncluttered background and enough calm negative space for optional localized learning overlay.
Lighting/mood: soft cellar light, cool stainless steel balanced with gentle warm reflections from active fermentation, observational and clear.
Color palette: warm ivory, brushed silver-grey, pale straw must, restrained gold heat accent, tiny muted burgundy grape detail.
Materials/textures: brushed steel, clear liquid, fine gas bubbles, realistic transparent glass; yeast cells illustrated at microscope scale with simple oval budding morphology.
Constraints: ordinary alcoholic wine fermentation is the subject; show bubbles as carbon dioxide leaving the liquid, subtle heat without fire, and yeast as small budding cells only in a magnified inset; no text so localized UI can explain inputs, outputs and conditions.
Avoid: text, chemical formulae, labels, arrows, numbers, logos, watermarks, gigantic yeast, bacteria, mold, anthropomorphic microbes, foam explosion, flames, boiling liquid, grapes spontaneously becoming wine, wine being made in glass, implication that bubbles alone prove fermentation has completed.
```

Sources: [AWRI — wine fermentation](https://www.awri.com.au/industry_support/winemaking_resources/wine_fermentation/), [fermentation temperature](https://www.awri.com.au/industry_support/winemaking_resources/winemaking-practices/fermentation-temperature/), [yeast choice](https://www.awri.com.au/industry_support/winemaking_resources/winemaking-treatment-yeast-choice/), [Comité Champagne — second fermentation](https://www.champagne.fr/en/about-champagne/how-champagne-is-made/bottling-and-second-fermentation).
