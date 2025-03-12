
/**
 * Converts an image to black and white using canvas
 */
export const convertToBlackAndWhite = (
  imageElement: HTMLImageElement
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    
    // Draw the image
    ctx.drawImage(imageElement, 0, 0);
    
    // Get the image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Convert to grayscale
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      
      // Apply threshold to create black and white (not grayscale)
      const val = avg > 128 ? 255 : 0;
      
      data[i] = val;     // r
      data[i + 1] = val; // g
      data[i + 2] = val; // b
      // data[i + 3] is alpha, preserve it
    }
    
    // Put the modified data back
    ctx.putImageData(imageData, 0, 0);
    
    // Return as data URL
    resolve(canvas.toDataURL());
  });
};

/**
 * Converts an image to a custom color
 */
export const convertToCustomColor = (
  imageElement: HTMLImageElement,
  color: string
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    
    // Draw the image
    ctx.drawImage(imageElement, 0, 0);
    
    // Get the image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Parse the color
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    // Convert to the custom color
    for (let i = 0; i < data.length; i += 4) {
      // Calculate grayscale value to determine shape
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const alpha = data[i + 3];
      
      if (alpha > 0) {
        // Only change pixels that aren't transparent
        const intensity = avg / 255;
        
        // Apply the custom color with the original intensity
        data[i] = Math.round(r * intensity);
        data[i + 1] = Math.round(g * intensity);
        data[i + 2] = Math.round(b * intensity);
      }
    }
    
    // Put the modified data back
    ctx.putImageData(imageData, 0, 0);
    
    // Return as data URL
    resolve(canvas.toDataURL());
  });
};

/**
 * Creates a new image with a background color
 */
export const applyBackground = (
  imageDataUrl: string,
  backgroundColor: string
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Fill with background color
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the image on top
      ctx.drawImage(img, 0, 0);
      
      resolve(canvas.toDataURL());
    };
    img.src = imageDataUrl;
  });
};

/**
 * Convert data URL to Blob for downloading
 */
export const dataURLtoBlob = (dataURL: string): Blob => {
  const parts = dataURL.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  
  return new Blob([uInt8Array], { type: contentType });
};

/**
 * Convert an image to SVG (simple conversion for PNG/JPG)
 */
export const convertToSVG = (
  imageDataUrl: string,
  backgroundColor?: string
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      
      let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
      
      // Add background if specified
      if (backgroundColor && backgroundColor !== 'transparent') {
        svgContent += `<rect width="${width}" height="${height}" fill="${backgroundColor}"/>`;
      }
      
      // Add the image
      svgContent += `<image width="${width}" height="${height}" href="${imageDataUrl}"/>`;
      svgContent += '</svg>';
      
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);
      resolve(svgUrl);
    };
    img.src = imageDataUrl;
  });
};

/**
 * Export image in different formats (PNG, JPG, PDF)
 */
export const exportAsImage = (
  imageDataUrl: string,
  format: 'png' | 'jpg' | 'pdf',
  backgroundColor: string = 'transparent'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Fill background if not transparent
      if (backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Draw the image
      ctx.drawImage(img, 0, 0);
      
      // Convert to requested format
      let outputUrl = '';
      if (format === 'png') {
        outputUrl = canvas.toDataURL('image/png');
      } else if (format === 'jpg') {
        outputUrl = canvas.toDataURL('image/jpeg', 0.9);
      } else if (format === 'pdf') {
        // For PDF we need to convert to PNG first, then import to PDF
        // This is a simple implementation - for production, use a proper PDF library
        const pngUrl = canvas.toDataURL('image/png');
        
        // Create a very basic PDF
        const pdfWidth = img.width;
        const pdfHeight = img.height;
        
        // Simple PDF generation (this is very basic - in real-world use jsPDF or similar)
        const pdfContent = `
%PDF-1.7
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj
2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj
3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /Resources <<
    /XObject <<
      /Img1 4 0 R
    >>
  >>
  /MediaBox [0 0 ${pdfWidth} ${pdfHeight}]
  /Contents 5 0 R
>>
endobj
4 0 obj
<<
  /Type /XObject
  /Subtype /Image
  /Width ${img.width}
  /Height ${img.height}
  /ColorSpace /DeviceRGB
  /BitsPerComponent 8
  /Filter /DCTDecode
  /Length 6 0 R
>>
stream
${pngUrl.split(',')[1]}
endstream
endobj
5 0 obj
<<
  /Length 44
>>
stream
q
${pdfWidth} 0 0 ${pdfHeight} 0 0 cm
/Img1 Do
Q
endstream
endobj
6 0 obj
${pngUrl.split(',')[1].length}
endobj
trailer
<<
  /Root 1 0 R
  /Size 7
>>
%%EOF`;

        const pdfBlob = new Blob([pdfContent], { type: 'application/pdf' });
        outputUrl = URL.createObjectURL(pdfBlob);
      }
      
      resolve(outputUrl);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = imageDataUrl;
  });
};

/**
 * Trigger a file download
 */
export const downloadFile = (url: string, filename: string): void => {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
