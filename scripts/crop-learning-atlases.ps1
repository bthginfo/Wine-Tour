param(
  [Parameter(Mandatory = $true)][string]$AtlasOne,
  [Parameter(Mandatory = $true)][string]$AtlasTwo
)

Add-Type -AssemblyName System.Drawing

$outputDirectory = Join-Path $PSScriptRoot '..\src\assets\learning-guides'
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null

$firstNames = @(
  'vine-year', 'terroir-layers', 'climate-and-altitude', 'vintage-weather', 'soil-water-roots',
  'fermentation', 'maturation-vessels', 'lees-and-malolactic', 'oxygen-and-age', 'red-white-rose',
  'sparkling-methods', 'sweet-wine', 'fortified-wine', 'wine-faults', 'sensory-calibration'
)

$secondNames = @(
  'vine-to-glass', 'taste-with-intention', 'service', 'aroma-language', 'labels-and-origin',
  'food-pairing', 'cellaring', 'sparkling-service', 'appellation-maps', 'bottle-closures'
)

function Export-AtlasCells {
  param(
    [string]$Path,
    [string[]]$Names,
    [int]$Columns,
    [int]$Rows
  )

  $source = [System.Drawing.Bitmap]::FromFile($Path)
  try {
    for ($index = 0; $index -lt $Names.Count; $index++) {
      $column = $index % $Columns
      $row = [Math]::Floor($index / $Columns)
      $left = [Math]::Floor($column * $source.Width / $Columns)
      $top = [Math]::Floor($row * $source.Height / $Rows)
      $right = [Math]::Floor(($column + 1) * $source.Width / $Columns)
      $bottom = [Math]::Floor(($row + 1) * $source.Height / $Rows)
      $rectangle = [System.Drawing.Rectangle]::new($left, $top, $right - $left, $bottom - $top)
      $crop = $source.Clone($rectangle, $source.PixelFormat)
      try {
        $target = Join-Path $outputDirectory ($Names[$index] + '.jpg')
        $crop.Save($target, [System.Drawing.Imaging.ImageFormat]::Jpeg)
      }
      finally {
        $crop.Dispose()
      }
    }
  }
  finally {
    $source.Dispose()
  }
}

Export-AtlasCells -Path $AtlasOne -Names $firstNames -Columns 5 -Rows 3
Export-AtlasCells -Path $AtlasTwo -Names $secondNames -Columns 5 -Rows 2

Write-Output "Exported $($firstNames.Count + $secondNames.Count) learning illustrations to $outputDirectory"
