Add-Type -AssemblyName System.Drawing

$iconSizes = @(72, 96, 128, 144, 152, 192, 384, 512)

Write-Host "Creating placeholder PWA icons..." -ForegroundColor Green

foreach ($size in $iconSizes) {
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Fill background with white
    $graphics.Clear([System.Drawing.Color]::White)
    
    # Draw a simple logo-like shape
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(190, 18, 60)) # Rose-700
    $font = New-Object System.Drawing.Font("Arial", ($size / 8), [System.Drawing.FontStyle]::Bold)
    
    # Draw "LO" text centered
    $text = "LO"
    $textSize = $graphics.MeasureString($text, $font)
    $x = ($size - $textSize.Width) / 2
    $y = ($size - $textSize.Height) / 2
    
    $graphics.DrawString($text, $font, $brush, $x, $y)
    
    # Add border
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(190, 18, 60), 2)
    $graphics.DrawRectangle($pen, 1, 1, $size - 2, $size - 2)
    
    $outputFile = "icon-${size}x${size}.png"
    $bitmap.Save($outputFile, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graphics.Dispose()
    $bitmap.Dispose()
    $brush.Dispose()
    $font.Dispose()
    $pen.Dispose()
    
    Write-Host "Created: $outputFile" -ForegroundColor Cyan
}

Write-Host "PWA icons generated successfully!" -ForegroundColor Green
Write-Host "Note: These are placeholder icons. For production, use professional icons." -ForegroundColor Yellow
