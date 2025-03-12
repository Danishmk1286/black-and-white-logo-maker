
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
