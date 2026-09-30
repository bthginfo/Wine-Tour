$ErrorActionPreference = 'Stop'

$manifestPath = Join-Path (Get-Location) 'docs/media/commons-photo-completion.json'
$coveragePath = Join-Path (Get-Location) 'docs/generated-knowledge-coverage.json'
$manifest = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
$coverage = Get-Content -LiteralPath $coveragePath -Raw -Encoding UTF8 | ConvertFrom-Json

# Older sync runs under Windows PowerShell 5.1 repeatedly read UTF-8 JSON as
# the active ANSI code page. Reverse only strings that round-trip cleanly from
# Windows-1252 bytes back to UTF-8, stopping as soon as the mojibake markers
# disappear. Strict encodings leave ambiguous/non-reversible strings untouched.
$mojibakePattern = '[\u00C3\u00C2]|\u00E2\u20AC|\u00F0\u0178|\u00EF\u00BF\u00BD'
$windows1252 = [System.Text.Encoding]::GetEncoding(1252, [System.Text.EncoderFallback]::ExceptionFallback, [System.Text.DecoderFallback]::ExceptionFallback)
$strictUtf8 = [System.Text.UTF8Encoding]::new($false, $true)
$replacementCharacter = [char]0xFFFD
foreach ($region in $manifest.regions) {
  foreach ($property in $region.PSObject.Properties) {
    if ($property.Value -isnot [string] -or -not [System.Text.RegularExpressions.Regex]::IsMatch($property.Value, $mojibakePattern)) {
      continue
    }
    $candidate = $property.Value
    for ($pass = 0; $pass -lt 12 -and [System.Text.RegularExpressions.Regex]::IsMatch($candidate, $mojibakePattern); $pass++) {
      try {
        $next = $strictUtf8.GetString($windows1252.GetBytes($candidate))
      } catch {
        break
      }
      $candidate = $next
    }
    if (-not [System.Text.RegularExpressions.Regex]::IsMatch($candidate, $mojibakePattern) -and -not $candidate.Contains($replacementCharacter)) {
      $property.Value = $candidate
    }
  }
}

$coverageById = @{}
foreach ($region in $coverage.records.regions) {
  $coverageById[$region.id] = $region.status
}

# Exact source metadata for recently integrated candidates. Keep this compact
# map here so the completion manifest can be mechanically refreshed from the
# generated coverage file without losing source-page and attribution details.
$sourceMetadata = @{
  'mantinia' = @{
    fileTitle = 'Mantinea Arcadia Peloponnese Greece.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Mantinea_Arcadia_Peloponnese_Greece.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Mantinea_Arcadia_Peloponnese_Greece.jpg/1280px-Mantinea_Arcadia_Peloponnese_Greece.jpg'
    author = 'ulrichstill'
    license = 'CC BY-SA 3.0 DE'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/3.0/de/deed.en'
    caption = 'Agricultural landscape on the Mantineia plateau near Milea, Arcadia, Greece.'
    geographyEvidence = 'Commons identifies the agricultural landscape on the Mantineia plateau near Milea in Arcadia, Peloponnese, Greece.'
    visualEvidence = 'Integrator preview-checked the wide agricultural plateau landscape.'
    previewDimensions = '1280 x 853'
  }
  'naoussa' = @{
    fileTitle = [System.Uri]::UnescapeDataString('%D0%9A%D0%B0%D1%80%D0%B0%D0%BA%D0%B0%D0%BC%D0%B5%D0%BD_%D0%9F%D0%BB%D0%B0%D0%BD%D0%B8%D0%BD%D0%B0_(%D0%9D%D0%B5%D0%B3%D1%83%D1%88%D0%BA%D0%BE).jpg').Replace('_', ' ')
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:%D0%9A%D0%B0%D1%80%D0%B0%D0%BA%D0%B0%D0%BC%D0%B5%D0%BD_%D0%9F%D0%BB%D0%B0%D0%BD%D0%B8%D0%BD%D0%B0_(%D0%9D%D0%B5%D0%B3%D1%83%D1%88%D0%BA%D0%BE).jpg'
    directThumbnailUrl = 'https://upload.wikimedia.org/wikipedia/commons/8/89/%D0%9A%D0%B0%D1%80%D0%B0%D0%BA%D0%B0%D0%BC%D0%B5%D0%BD_%D0%9F%D0%BB%D0%B0%D0%BD%D0%B8%D0%BD%D0%B0_%28%D0%9D%D0%B5%D0%B3%D1%83%D1%88%D0%BA%D0%BE%29.jpg'
    author = [System.Uri]::UnescapeDataString('%D0%9C%D0%B0%D0%BA%D0%B5%D0%B4%D0%BE%D0%BD%D0%B5%D1%86')
    license = 'CC BY-SA 4.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/4.0/'
    caption = 'Mount Vermio viewed from Kopanos in the Naoussa area of Greece.'
    geographyEvidence = 'Commons file title and categories identify Mount Vermio, Kopanos (Naousa), and landscapes of Naousa.'
    visualEvidence = 'Integrator preview-checked the broad mountain landscape.'
    previewDimensions = '1280 x 960'
  }
  'posavje' = @{
    fileTitle = 'Bizeljsko iz Vidove poti.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Bizeljsko_iz_Vidove_poti.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a7/Bizeljsko_iz_Vidove_poti.jpg/1280px-Bizeljsko_iz_Vidove_poti.jpg'
    author = 'Janezdrilc'
    license = 'CC0 1.0'
    licenseUrl = 'https://creativecommons.org/publicdomain/zero/1.0/deed.en'
    caption = "View over Bizeljsko from the Vitus Way in Slovenia's Posavje wine region."
    geographyEvidence = "Commons title identifies Bizeljsko and the Vitus Way; the location is in Slovenia's Posavje wine region."
    visualEvidence = 'Integrator preview-checked a wide view over the valley, settlements, fields, and visible vineyards.'
    previewDimensions = '1280 x 960'
  }
  'imereti' = @{
    fileTitle = '25 - Vineyard east of Kutaisi.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:25_-_Vineyard_east_of_Kutaisi.jpg'
    directThumbnailUrl = 'https://upload.wikimedia.org/wikipedia/commons/f/ff/25_-_Vineyard_east_of_Kutaisi.jpg'
    author = 'Jacques Dupakiers'
    license = 'CC BY 2.0'
    licenseUrl = 'https://creativecommons.org/licenses/by/2.0/'
    caption = 'A vineyard east of Kutaisi in Imereti, photographed in 1964.'
    geographyEvidence = "Commons title and archive description locate the vineyard east of Kutaisi, in Georgia's Imereti region."
    visualEvidence = 'Integrator preview-checked the archival image; vineyard rows and a Georgian vineyard sign are visible.'
    previewDimensions = '1280 x 859'
  }
  'ningxia' = @{
    fileTitle = 'Helan Montains at Baisikou A.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Helan_Montains_at_Baisikou_A.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Helan_Montains_at_Baisikou_A.jpg/1280px-Helan_Montains_at_Baisikou_A.jpg'
    author = 'BabelStone'
    license = 'CC BY-SA 3.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/3.0/'
    caption = 'Helan Mountains viewed from Baisikou near Yinchuan, Ningxia.'
    geographyEvidence = 'Commons file description identifies the Helan Mountains view from Baisikou near Yinchuan in Ningxia.'
    visualEvidence = 'Integrator preview-checked a wide mountain landscape; caption describes the scenery without implying vineyards.'
    previewDimensions = '1280 x 960'
  }
  'thrace' = @{
    fileTitle = [System.Uri]::UnescapeDataString('Tekirda%C4%9F Kartaltepe Natural Park.jpg')
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Tekirda%C4%9F_Kartaltepe_Natural_Park.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/Tekirda%C4%9F_Kartaltepe_Natural_Park.jpg/1280px-Tekirda%C4%9F_Kartaltepe_Natural_Park.jpg'
    author = 'Gamerlad88'
    license = 'CC BY-SA 4.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/4.0/'
    caption = [System.Uri]::UnescapeDataString('Coastal hills near Tekirda%C4%9F in Turkish Thrace.')
    geographyEvidence = [System.Uri]::UnescapeDataString('Commons identifies Kartaltepe Natural Park near Tekirda%C4%9F, in Turkish Thrace.')
    visualEvidence = 'Integrator preview-checked the coastal hills; caption remains geographic rather than claiming vineyard content.'
    previewDimensions = '1280 x 853'
  }
  'shandong' = @{
    fileTitle = 'Yantai Coastal View.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Yantai_Coastal_View.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Yantai_Coastal_View.jpg/1280px-Yantai_Coastal_View.jpg'
    author = 'S. T. Fullerton'
    license = 'Copyrighted free use'
    licenseUrl = 'https://commons.wikimedia.org/wiki/Template:Copyrighted_free_use'
    caption = 'Yantai shorefront on the coast of Shandong, China.'
    geographyEvidence = 'Commons title and description identify the Yantai coast in Shandong, China.'
    visualEvidence = 'Integrator preview-checked the shorefront landscape; caption does not imply vineyard content.'
    previewDimensions = '1280 x 960'
  }
  'cappadocia' = @{
    fileTitle = 'Cappadocia Aktepe Panorama.JPG'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Cappadocia_Aktepe_Panorama.JPG'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Cappadocia_Aktepe_Panorama.JPG/1280px-Cappadocia_Aktepe_Panorama.JPG'
    author = [System.Uri]::UnescapeDataString('Bj%C3%B8rn Christian T%C3%B8rrissen')
    license = 'CC BY-SA 3.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/3.0/'
    caption = [System.Uri]::UnescapeDataString('Aktepe Hill above Rose Valley near G%C3%B6reme, Cappadocia.')
    geographyEvidence = [System.Uri]::UnescapeDataString('Commons file title identifies the Cappadocia panorama; description locates Aktepe Hill above Rose Valley near G%C3%B6reme.')
    visualEvidence = 'Integrator preview-checked the wide, distinctive Cappadocian landscape.'
    previewDimensions = '1280 x 483'
  }
  'commandaria-troodos' = @{
    fileTitle = 'Vista de los montes de Troodos desde el observatorio Rojo, Chipre, 2021-12-13, DD 01.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Vista_de_los_montes_de_Troodos_desde_el_observatorio_Rojo,_Chipre,_2021-12-13,_DD_01.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/Vista_de_los_montes_de_Troodos_desde_el_observatorio_Rojo%2C_Chipre%2C_2021-12-13%2C_DD_01.jpg/1280px-Vista_de_los_montes_de_Troodos_desde_el_observatorio_Rojo%2C_Chipre%2C_2021-12-13%2C_DD_01.jpg'
    author = 'Diego Delso (delso.photo)'
    license = 'CC BY-SA 4.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/4.0/'
    caption = 'Troodos Mountains from the Red Observation Platform, Cyprus.'
    geographyEvidence = 'Commons file title and description identify the Troodos Mountains viewed from the Red Observation Platform in Cyprus.'
    visualEvidence = 'Integrator preview-checked the wide mountain panorama; caption remains geographic rather than claiming vineyard content.'
    previewDimensions = '1280 x 622'
  }
  'aegean' = @{
    fileTitle = [System.Uri]::UnescapeDataString('%C5%9Eirince, visible city.jpg')
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:%C5%9Eirince,_visible_city.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/%C5%9Eirince%2C_visible_city.jpg/1280px-%C5%9Eirince%2C_visible_city.jpg'
    author = 'Helen Owl'
    license = 'CC BY-SA 4.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/4.0/'
    caption = [System.Uri]::UnescapeDataString('The village of %C5%9Eirince in %C4%B0zmir Province, Turkey''s Aegean Region.')
    geographyEvidence = [System.Uri]::UnescapeDataString('Commons identifies %C5%9Eirince in %C4%B0zmir Province; this is in Turkey''s Aegean Region.')
    visualEvidence = 'Integrator preview-checked the village landscape; caption does not imply vineyards.'
    previewDimensions = '1280 x 964'
  }
  'rivera' = @{
    fileTitle = 'Verde por naturaleza en Valle del Lunarejo, Rivera.JPG'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Verde_por_naturaleza_en_Valle_del_Lunarejo,_Rivera.JPG'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/Verde_por_naturaleza_en_Valle_del_Lunarejo%2C_Rivera.JPG/1280px-Verde_por_naturaleza_en_Valle_del_Lunarejo%2C_Rivera.JPG'
    author = [System.Uri]::UnescapeDataString('Anal%C3%ADa Mosqueira')
    license = 'CC BY-SA 3.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/3.0/'
    caption = 'Landscape of Valle del Lunarejo in Rivera, Uruguay.'
    geographyEvidence = 'Commons file title and description locate the landscape in Valle del Lunarejo, Rivera, Uruguay.'
    visualEvidence = 'Integrator preview-checked the wide regional landscape.'
    previewDimensions = '1280 x 772'
  }
  'maldonado' = @{
    fileTitle = 'Las Flores Landscape Maldonado Uruguay.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Las_Flores_Landscape_Maldonado_Uruguay.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Las_Flores_Landscape_Maldonado_Uruguay.jpg/1280px-Las_Flores_Landscape_Maldonado_Uruguay.jpg'
    author = 'Arturettenberger'
    license = 'CC BY-SA 4.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/4.0/'
    caption = 'Coastal landscape near Las Flores, Maldonado, Uruguay.'
    geographyEvidence = 'Commons file title identifies the landscape at Las Flores in Maldonado, Uruguay.'
    visualEvidence = 'Integrator preview-checked the broad coastal landscape.'
    previewDimensions = '1280 x 956'
  }
  'gisborne' = @{
    fileTitle = 'View over Poverty Bay from Kaiti Hill lookout.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:View_over_Poverty_Bay_from_Kaiti_Hill_lookout.jpg'
    directThumbnailUrl = 'https://upload.wikimedia.org/wikipedia/commons/2/2d/View_over_Poverty_Bay_from_Kaiti_Hill_lookout.jpg'
    author = 'Pseudopanax'
    license = 'Public domain (PD-self)'
    licenseUrl = 'https://commons.wikimedia.org/wiki/Template:PD-self'
    caption = 'Poverty Bay from the Kaiti Hill lookout in Gisborne, New Zealand.'
    geographyEvidence = 'Commons file title identifies Poverty Bay and the Kaiti Hill lookout in Gisborne, New Zealand.'
    visualEvidence = 'Integrator preview-checked the bay and surrounding landscape.'
    previewDimensions = '1024 x 768'
  }
  'nelson' = @{
    fileTitle = 'Richmond And Nelson From Southeast.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Richmond_And_Nelson_From_Southeast.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3d/Richmond_And_Nelson_From_Southeast.jpg/1280px-Richmond_And_Nelson_From_Southeast.jpg'
    author = 'Ingolfson'
    license = 'Public domain (PD-self)'
    licenseUrl = 'https://commons.wikimedia.org/wiki/Template:PD-self'
    caption = 'Richmond and Nelson viewed from the southeast, New Zealand.'
    geographyEvidence = 'Commons file title identifies Richmond and Nelson, New Zealand, viewed from the southeast.'
    visualEvidence = 'Integrator preview-checked the regional city-and-landscape panorama.'
    previewDimensions = '1280 x 960'
  }
  'umpqua-valley' = @{
    fileTitle = 'South Umpqua River, Roseburg - DPLA - cbed6372e39ece0b85f523f634c8922a.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:South_Umpqua_River,_Roseburg_-_DPLA_-_cbed6372e39ece0b85f523f634c8922a.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/South_Umpqua_River%2C_Roseburg_-_DPLA_-_cbed6372e39ece0b85f523f634c8922a.jpg/1280px-South_Umpqua_River%2C_Roseburg_-_DPLA_-_cbed6372e39ece0b85f523f634c8922a.jpg'
    author = 'Gary Halvorson, Oregon State Archives'
    license = 'CC BY 4.0'
    licenseUrl = 'https://creativecommons.org/licenses/by/4.0/'
    caption = "South Umpqua River at Roseburg in Oregon's Umpqua Valley."
    geographyEvidence = "Commons identifies the South Umpqua River at Roseburg; Roseburg lies in Oregon's Umpqua Valley."
    visualEvidence = 'Integrator preview-checked the river and surrounding regional landscape.'
    previewDimensions = '1280 x 854'
  }
  'itata' = @{
    fileTitle = 'Nipas y rio Itata.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Nipas_y_rio_Itata.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Nipas_y_rio_Itata.jpg/1280px-Nipas_y_rio_Itata.jpg'
    author = 'Farisori'
    license = 'CC BY-SA 3.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/3.0/'
    caption = [System.Uri]::UnescapeDataString('%C3%91ipas and the Itata River in Chile''s Itata Province.')
    geographyEvidence = [System.Uri]::UnescapeDataString('Commons description locates %C3%91ipas in R%C3%A1nquil commune, Itata Province, %C3%91uble Region and identifies the Itata River.')
    visualEvidence = 'Integrator preview-checked the town-and-river landscape.'
    previewDimensions = '1280 x 960'
  }
  'batroun' = @{
    fileTitle = 'Bijdarfel - Batroun (2309089114).jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Bijdarfel_-_Batroun_(2309089114).jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Bijdarfel_-_Batroun_%282309089114%29.jpg/1280px-Bijdarfel_-_Batroun_%282309089114%29.jpg'
    author = 'Serge Melki'
    license = 'CC BY 2.0'
    licenseUrl = 'https://creativecommons.org/licenses/by/2.0/'
    caption = 'Olive orchards above Bijdarfel-Batroun in northern Lebanon.'
    geographyEvidence = 'Commons description places the olive orchards above Bijdarfel in the Batroun District of northern Lebanon.'
    visualEvidence = 'Integrator preview-checked the image; it clearly shows terraced olive orchards.'
    previewDimensions = '1280 x 960'
  }
  'judean-hills' = @{
    fileTitle = 'Vineyard in the Judean Mountains.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Vineyard_in_the_Judean_Mountains.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/Vineyard_in_the_Judean_Mountains.jpg/1280px-Vineyard_in_the_Judean_Mountains.jpg'
    author = 'Davidbena'
    license = 'CC BY-SA 4.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/4.0/'
    caption = 'Early-spring vineyard near Moshav Mata in the Judean Mountains, Israel.'
    geographyEvidence = 'Commons description identifies the vineyard near Moshav Mata in the Judean Mountains, Israel.'
    visualEvidence = 'Integrator preview-checked vineyard rows against wooded hills.'
    previewDimensions = '1280 x 960'
  }
  'nandi-hills' = @{
    fileTitle = 'Nandi Hills, Bengaluru.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Nandi_Hills,_Bengaluru.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/Nandi_Hills%2C_Bengaluru.jpg/1280px-Nandi_Hills%2C_Bengaluru.jpg'
    author = 'Sidhant Soni'
    license = 'CC BY-SA 4.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/4.0/'
    caption = 'Sunrise above the clouds at Nandi Hills near Bengaluru, India.'
    geographyEvidence = 'Commons title and description identify Nandi Hills near Bengaluru, India.'
    visualEvidence = 'Integrator preview-checked the sunrise panorama above the cloud layer.'
    previewDimensions = '1280 x 960'
  }
  'somlo' = @{
    fileTitle = [System.Uri]::UnescapeDataString('Soml%C3%B3 hill - panoramio.jpg')
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Soml%C3%B3_hill_-_panoramio.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Soml%C3%B3_hill_-_panoramio.jpg/1280px-Soml%C3%B3_hill_-_panoramio.jpg'
    author = 'fabiolah'
    license = 'CC BY 3.0'
    licenseUrl = 'https://creativecommons.org/licenses/by/3.0/'
    caption = [System.Uri]::UnescapeDataString('Soml%C3%B3 Hill above the vineyards in Hungary.')
    geographyEvidence = 'Commons file title identifies Soml%C3%B3 Hill and the source is categorized with the Soml%C3%B3 wine region.'
    visualEvidence = 'Integrator preview-checked the broad hill landscape with vineyards below.'
    previewDimensions = '1280 x 546'
  }
  'crete' = @{
    fileTitle = 'Lake Kournas - panoramio.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Lake_Kournas_-_panoramio.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Lake_Kournas_-_panoramio.jpg/1280px-Lake_Kournas_-_panoramio.jpg'
    author = 'Tanya Dedyukhina'
    license = 'CC BY 3.0'
    licenseUrl = 'https://creativecommons.org/licenses/by/3.0/'
    caption = 'Lake Kournas and its mountain shore on Crete, Greece.'
    geographyEvidence = 'Commons file title identifies Lake Kournas on Crete, Greece.'
    visualEvidence = 'Integrator preview-checked the lake and surrounding mountain shore.'
    previewDimensions = '1280 x 960'
  }
  'podravje' = @{
    fileTitle = 'Vinograd pri Hrastju (3).jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Vinograd_pri_Hrastju_(3).jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Vinograd_pri_Hrastju_%283%29.jpg/1280px-Vinograd_pri_Hrastju_%283%29.jpg'
    author = 'breki74'
    license = 'CC BY-SA 2.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/2.0/'
    caption = "Vineyard at Hrastje near Maribor in Slovenia's Podravje wine region."
    geographyEvidence = "Commons identifies the vineyard at Hrastje near Maribor; the site lies in Slovenia's Podravje wine region."
    visualEvidence = 'Integrator preview-checked visible planted rows descending the slope.'
    previewDimensions = '1280 x 770'
  }
  'dalmatia-peljesac' = @{
    fileTitle = [System.Uri]::UnescapeDataString('Vinograd , Peli%C5%A1ac03498.JPG')
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Vinograd_,_Peli%C5%A1ac03498.JPG'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Vinograd_%2C_Peli%C5%A1ac03498.JPG/1280px-Vinograd_%2C_Peli%C5%A1ac03498.JPG'
    author = [System.Uri]::UnescapeDataString('Quahadi%20A%C3%B1t%C3%B3')
    license = 'CC BY-SA 3.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/3.0/'
    caption = [System.Uri]::UnescapeDataString('Vineyard on the Pelje%C5%A1ac peninsula, Croatia.')
    geographyEvidence = [System.Uri]::UnescapeDataString('Commons file title and description identify a vineyard on the Pelje%C5%A1ac peninsula, Croatia.')
    visualEvidence = 'Integrator preview-checked vineyard rows in the foreground with a mountain backdrop.'
    previewDimensions = '1280 x 960'
  }
  'slavonia-kutjevo' = @{
    fileTitle = 'Kutjevo 01.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Kutjevo_01.jpg'
    directThumbnailUrl = 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Kutjevo_01.jpg'
    author = [System.Uri]::UnescapeDataString('Dalibor Ribi%C4%8Di%C4%87')
    license = 'CC BY-SA 4.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/4.0/'
    caption = "Kutjevo Abbey in Croatia's Slavonia region."
    geographyEvidence = [System.Uri]::UnescapeDataString('Commons title identifies Kutjevo Abbey; file usage and categories associate the building with Kutjevo in Po%C5%BEega-Slavonia.')
    visualEvidence = 'Integrator preview-checked the Abbey facade as a region-specific architectural landmark.'
    previewDimensions = '640 x 480'
  }
  'monticello' = @{
    fileTitle = 'Montecello vineyard.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Montecello_vineyard.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Montecello_vineyard.jpg/1280px-Montecello_vineyard.jpg'
    author = 'Tony (Paterson, NJ)'
    license = 'CC BY 2.0'
    licenseUrl = 'https://creativecommons.org/licenses/by/2.0/'
    caption = 'The Northeast Vineyard and Garden Pavilion at Monticello, Virginia.'
    geographyEvidence = 'Commons identifies the Northeast Vineyard and Garden Pavilion at Monticello in Virginia.'
    visualEvidence = 'Integrator preview-checked cultivated vine rows in the foreground with the pavilion and ridge.'
    previewDimensions = '1280 x 960'
  }
  'styria' = @{
    fileTitle = 'Grape growing in Styria4.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Grape_growing_in_Styria4.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Grape_growing_in_Styria4.jpg/1280px-Grape_growing_in_Styria4.jpg'
    author = 'Eligiusz Jakimowicz'
    license = 'CC BY-SA 4.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/4.0/'
    caption = 'A hillside vineyard in St. Stefan ob Stainz, Styria, Austria.'
    geographyEvidence = 'Commons file title and description identify grape growing in Styria and place the hillside vineyard in St. Stefan ob Stainz.'
    visualEvidence = 'Integrator preview-checked the vine slope, houses, and village landscape.'
    previewDimensions = '1280 x 964'
  }
  'aragatsotn' = @{
    fileTitle = 'Aragats mountain, Aragatsotn, Armenia.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Aragats_mountain,_Aragatsotn,_Armenia.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/Aragats_mountain%2C_Aragatsotn%2C_Armenia.jpg/1280px-Aragats_mountain%2C_Aragatsotn%2C_Armenia.jpg'
    author = 'Alexander Mkhitaryan B'
    license = 'CC BY-SA 3.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/3.0/'
    caption = 'Mount Aragats in Aragatsotn, Armenia.'
    geographyEvidence = 'Commons title identifies Mount Aragats in Aragatsotn, Armenia.'
    visualEvidence = 'Integrator preview-checked the mountain panorama with green foothills and pasture.'
    previewDimensions = '1280 x 854'
  }
  'jerez' = @{
    fileTitle = [System.Uri]::UnescapeDataString('Puesta de sol Vi%C3%B1edos en Jerez de la Frontera - P1240095.jpg')
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Puesta_de_sol_Vi%C3%B1edos_en_Jerez_de_la_Frontera_-_P1240095.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Puesta_de_sol_Vi%C3%B1edos_en_Jerez_de_la_Frontera_-_P1240095.jpg/1280px-Puesta_de_sol_Vi%C3%B1edos_en_Jerez_de_la_Frontera_-_P1240095.jpg'
    author = 'El Pantera'
    license = 'CC BY-SA 4.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/4.0/'
    caption = [System.Uri]::UnescapeDataString('Vineyards at Vi%C3%B1a Solana Chica in Jerez de la Frontera, Spain.')
    geographyEvidence = 'Commons description identifies Vi%C3%B1a Solana Chica in Jerez de la Frontera; file categories include vineyards in Jerez and Campi%C3%B1a de Jerez.'
    visualEvidence = 'Integrator preview-checked clear vine rows in low evening light.'
    previewDimensions = '1280 x 960'
  }
  'rioja-oriental' = @{
    fileTitle = [System.Uri]::UnescapeDataString('Aldeanueva_de_Ebro_-_vi%C3%B1edos_2.jpg').Replace('_', ' ')
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Aldeanueva_de_Ebro_-_vi%C3%B1edos_2.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/Aldeanueva_de_Ebro_-_vi%C3%B1edos_2.jpg/1280px-Aldeanueva_de_Ebro_-_vi%C3%B1edos_2.jpg'
    author = 'Zarateman'
    license = 'CC0 1.0'
    licenseUrl = 'https://creativecommons.org/publicdomain/zero/1.0/deed.en'
    caption = 'Vineyards at Aldeanueva de Ebro in Rioja Oriental, Spain.'
    geographyEvidence = 'Commons identifies vineyards at Aldeanueva de Ebro; the official DOCa Rioja municipality page places Aldeanueva de Ebro in Rioja Oriental.'
    visualEvidence = 'Integrator preview-checked visible vineyard rows in a broad regional scene.'
    previewDimensions = '1280 x 960'
  }
  'bairrada' = @{
    fileTitle = [System.Uri]::UnescapeDataString('Hotel_Termas_da_Curia_-_Portugal_%F0%9F%87%B5%F0%9F%87%B9_(54783947285).jpg').Replace('_', ' ')
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Hotel_Termas_da_Curia_-_Portugal_%F0%9F%87%B5%F0%9F%87%B9_(54783947285).jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/Hotel_Termas_da_Curia_-_Portugal_%F0%9F%87%B5%F0%9F%87%B9_%2854783947285%29.jpg/1280px-Hotel_Termas_da_Curia_-_Portugal_%F0%9F%87%B5%F0%9F%87%B9_%2854783947285%29.jpg'
    author = 'Vitor Oliveira'
    license = 'CC BY-SA 4.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/4.0/'
    caption = 'Hotel Termas da Curia and its grounds in Portugal''s Bairrada region.'
    geographyEvidence = 'Commons description identifies the hotel and its 14-hectare park in Bairrada, Aveiro, Portugal.'
    visualEvidence = 'Integrator preview-checked the hotel and grounds from above.'
    previewDimensions = '1280 x 960'
  }
  'kremstal' = @{
    fileTitle = 'Senftenberg Blick von der Burgruine nach Imbach-3556.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Senftenberg_Blick_von_der_Burgruine_nach_Imbach-3556.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f7/Senftenberg_Blick_von_der_Burgruine_nach_Imbach-3556.jpg/1280px-Senftenberg_Blick_von_der_Burgruine_nach_Imbach-3556.jpg'
    author = 'Isiwal'
    license = 'CC BY-SA 4.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/4.0/'
    caption = 'View from Senftenberg Castle toward Imbach in the Kremstal, Austria.'
    geographyEvidence = 'Commons categories identify Senftenberg and Imbach in Lower Austria, Kremstal, and vineyards in Kremstal.'
    visualEvidence = 'Integrator preview-checked a clear vineyard-and-valley view from Senftenberg Castle toward Imbach.'
    previewDimensions = '1280 x 852'
  }
  'plesivica' = @{
    fileTitle = [System.Uri]::UnescapeDataString('Ple%C5%A1ivica,_vinogorje.jpg').Replace('_', ' ')
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Ple%C5%A1ivica,_vinogorje.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Ple%C5%A1ivica%2C_vinogorje.jpg/1280px-Ple%C5%A1ivica%2C_vinogorje.jpg'
    author = 'Zrilezrno'
    license = 'CC BY-SA 4.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/4.0/'
    caption = [System.Uri]::UnescapeDataString('Vineyards in the Ple%C5%A1ivica winegrowing area, Croatia.')
    geographyEvidence = 'Commons title and Croatian caption identify the Ple%C5%A1ivica winegrowing area; the file is categorized under Jastrebarsko, Croatia.'
    visualEvidence = 'Integrator preview-checked a broad autumn vineyard landscape.'
    previewDimensions = '1280 x 853'
  }
  'lisboa-tejo' = @{
    fileTitle = 'SantaremTejo.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:SantaremTejo.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/eb/SantaremTejo.jpg/1280px-SantaremTejo.jpg'
    author = 'Fulviusbsas'
    license = 'Public domain (PD-self)'
    licenseUrl = 'https://commons.wikimedia.org/wiki/Template:PD-self'
    caption = 'The Tagus (Tejo) River seen from Santarem, Portugal.'
    geographyEvidence = 'Commons description identifies the Tejo River from Santarem, Portugal, within the Tejo wine region.'
    visualEvidence = 'Integrator preview-checked the broad river and bridge landscape.'
    previewDimensions = '1280 x 960'
  }
  'vittoria' = @{
    fileTitle = 'Vittoria - Teatro comunale Vittoria Colonna.JPG'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Vittoria_-_Teatro_comunale_Vittoria_Colonna.JPG'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e6/Vittoria_-_Teatro_comunale_Vittoria_Colonna.JPG/1280px-Vittoria_-_Teatro_comunale_Vittoria_Colonna.JPG'
    author = 'AntonioMancaniello'
    license = 'CC BY-SA 4.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/4.0/'
    caption = 'Teatro Comunale Vittoria Colonna and Piazza del Popolo in Vittoria, Sicily.'
    geographyEvidence = 'Commons description identifies the Teatro Comunale Vittoria Colonna, and its location/categories place it in Vittoria, Sicily.'
    visualEvidence = 'Integrator preview-checked the daylight theater and piazza panorama as a clear regional architecture scene.'
    previewDimensions = '1280 x 853'
  }
  'marsala' = @{
    fileTitle = 'Tramonto Saline di Marsala.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Tramonto_Saline_di_Marsala.jpg'
    directThumbnailUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Tramonto_Saline_di_Marsala.jpg/1280px-Tramonto_Saline_di_Marsala.jpg'
    author = '29C'
    license = 'CC BY-SA 4.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/4.0/'
    caption = 'Marsala salt pans at sunset, Sicily.'
    geographyEvidence = 'Commons description, coordinates, and category identify the Saline di Marsala in Sicily.'
    visualEvidence = 'Integrator preview-checked the broad salt-pan lagoon at golden hour.'
    previewDimensions = '1280 x 960'
  }
  'dao' = @{
    fileTitle = [System.Uri]::UnescapeDataString('Solar do Vinho do D%C3%A3o - Viseu - Portugal (53308981815).jpg')
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Solar_do_Vinho_do_D%C3%A3o_-_Viseu_-_Portugal_(53308981815).jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Solar_do_Vinho_do_D%C3%A3o_-_Viseu_-_Portugal_%2853308981815%29.jpg/1280px-Solar_do_Vinho_do_D%C3%A3o_-_Viseu_-_Portugal_%2853308981815%29.jpg'
    author = 'Vitor Oliveira'
    license = 'CC BY-SA 2.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/2.0/'
    caption = [System.Uri]::UnescapeDataString('Solar do Vinho do D%C3%A3o, the region''s wine-route welcome center in Viseu, Portugal.')
    geographyEvidence = 'Commons description identifies the Solar do Vinho do D%C3%A3o, the wine-route welcome center in Viseu.'
    visualEvidence = 'Integrator preview-checked a well-composed historical manor and courtyard.'
    previewDimensions = '1280 x 815'
  }
  'vienna' = @{
    fileTitle = '2019-09-19 (113) Wiener Stadtwanderweg 1 - Vineyard at Wildgrubgasse, Vienna, Austria.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:2019-09-19_(113)_Wiener_Stadtwanderweg_1_-_Vineyard_at_Wildgrubgasse,_Vienna,_Austria.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/2019-09-19_%28113%29_Wiener_Stadtwanderweg_1_-_Vineyard_at_Wildgrubgasse%2C_Vienna%2C_Austria.jpg/1280px-2019-09-19_%28113%29_Wiener_Stadtwanderweg_1_-_Vineyard_at_Wildgrubgasse%2C_Vienna%2C_Austria.jpg'
    author = 'GT1976'
    license = 'CC BY-SA 4.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/4.0/'
    caption = 'Vineyard along Wildgrubgasse in Vienna, Austria.'
    geographyEvidence = 'Commons description and category identify a vineyard at Wildgrubgasse in Vienna.'
    visualEvidence = 'Integrator preview-checked the exact Vienna vineyard landscape.'
    previewDimensions = '1280 x 960'
  }
  'burgenland' = @{
    fileTitle = 'Moerbisch von Westen.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:Moerbisch_von_Westen.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Moerbisch_von_Westen.jpg/1280px-Moerbisch_von_Westen.jpg'
    author = 'Wolfgang Glock'
    license = 'CC BY 3.0'
    licenseUrl = 'https://creativecommons.org/licenses/by/3.0/'
    caption = [System.Uri]::UnescapeDataString('M%C3%B6rbisch am See and Lake Neusiedl in Burgenland, Austria.')
    geographyEvidence = 'Commons description identifies M%C3%B6rbisch am See in Burgenland, Austria, and shows Neusiedler See and the Seewinkel.'
    visualEvidence = 'Integrator preview-checked vineyard foreground with the lake and Seewinkel beyond.'
    previewDimensions = '1280 x 724'
  }
  'toro' = @{
    fileTitle = 'El Duero desde el mirador de Toro.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:El_Duero_desde_el_mirador_de_Toro.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/El_Duero_desde_el_mirador_de_Toro.jpg/1280px-El_Duero_desde_el_mirador_de_Toro.jpg'
    author = [System.Uri]::UnescapeDataString('Zyllan Fotograf%C3%ADa')
    license = 'CC BY 2.0'
    licenseUrl = 'https://creativecommons.org/licenses/by/2.0/'
    caption = [System.Uri]::UnescapeDataString('The Duero River and Toro Bridge from the Espol%C3%B3n viewpoint, Spain.')
    geographyEvidence = [System.Uri]::UnescapeDataString('Commons description identifies the Duero River and bridge at Toro from the Espol%C3%B3n viewpoint.')
    visualEvidence = 'Integrator preview-checked the broad, colorful valley panorama.'
    previewDimensions = '1280 x 854'
  }
  'galilee-golan-heights' = @{
    fileTitle = 'The view of the Galilee Panhandle from Naftali Mountains to the Hula Valley, the Golan Heights and the Hermon Range.jpg'
    commonsFilePage = 'https://commons.wikimedia.org/wiki/File:The_view_of_the_Galilee_Panhandle_from_Naftali_Mountains_to_the_Hula_Valley,_the_Golan_Heights_and_the_Hermon_Range.jpg'
    directThumbnailUrl = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/The_view_of_the_Galilee_Panhandle_from_Naftali_Mountains_to_the_Hula_Valley%2C_the_Golan_Heights_and_the_Hermon_Range.jpg/1280px-The_view_of_the_Galilee_Panhandle_from_Naftali_Mountains_to_the_Hula_Valley%2C_the_Golan_Heights_and_the_Hermon_Range.jpg'
    author = [System.Uri]::UnescapeDataString('%D7%91%D7%A8')
    license = 'CC BY-SA 3.0'
    licenseUrl = 'https://creativecommons.org/licenses/by-sa/3.0/'
    caption = 'Galilee Panhandle, Hula Valley, Golan Heights and Mount Hermon from the Naftali Mountains.'
    geographyEvidence = 'Commons title, description, and categories identify the Galilee Panhandle, Hula Valley, Golan Heights, and Hermon Range.'
    visualEvidence = 'Integrator preview-checked a broad landscape panorama; the image is also featured on Hebrew Wikipedia.'
    previewDimensions = '1280 x 714'
  }
}

foreach ($region in $manifest.regions) {
  if ($sourceMetadata.ContainsKey($region.id)) {
    foreach ($property in $sourceMetadata[$region.id].GetEnumerator()) {
      if ($region.PSObject.Properties[$property.Key]) {
        $region.$($property.Key) = $property.Value
      } else {
        $region | Add-Member -NotePropertyName $property.Key -NotePropertyValue $property.Value
      }
    }
    if ($region.PSObject.Properties['initialCoverageStatus']) {
      $region.initialCoverageStatus = 'shared-decorative-fallback'
    } else {
      $region | Add-Member -NotePropertyName initialCoverageStatus -NotePropertyValue 'shared-decorative-fallback'
    }
  }
  if ($coverageById[$region.id] -eq 'licensed-region-photograph') {
    $region.status = 'verified'
    if ($region.PSObject.Properties['integrationStatus']) {
      $region.integrationStatus = 'integrated'
    } else {
      $region | Add-Member -NotePropertyName integrationStatus -NotePropertyValue 'integrated'
    }
    $region.researchStatus = 'verified'
  } else {
    $region.status = 'needs-source'
    if (-not $region.researchStatus -or $region.researchStatus -eq 'verified') {
      $region.researchStatus = 'not_yet_audited'
    }
    if ($region.PSObject.Properties['integrationStatus']) {
      $region.PSObject.Properties.Remove('integrationStatus')
    }
  }
}

$needsSource = @($manifest.regions | Where-Object status -eq 'needs-source')
$manifest.summary.baselineRegions = $manifest.regions.Count
$manifest.summary.verifiedAndIntegrated = @($manifest.regions | Where-Object integrationStatus -eq 'integrated').Count
$manifest.summary.verifiedAwaitingIntegration = @($manifest.regions | Where-Object { $_.status -eq 'verified' -and $_.integrationStatus -ne 'integrated' }).Count
$manifest.summary.stillNeedsSource = $needsSource.Count
$manifest.summary.researchedWithoutApprovedSource = @($needsSource | Where-Object researchStatus -eq 'researched_no_approved_source').Count
$manifest.summary.notYetAudited = @($needsSource | Where-Object researchStatus -eq 'not_yet_audited').Count

$json = $manifest | ConvertTo-Json -Depth 30
[System.IO.File]::WriteAllText($manifestPath, $json + [Environment]::NewLine, [System.Text.UTF8Encoding]::new($false))
Write-Output ("Synced {0} baseline regions: {1} integrated, {2} need a source." -f $manifest.summary.baselineRegions, $manifest.summary.verifiedAndIntegrated, $manifest.summary.stillNeedsSource)
