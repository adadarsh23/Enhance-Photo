// // package
// import sharp from 'sharp';
// import Image from '../models/Image.js';
// // Correct for Node.js
// import Upscaler from 'upscaler/node';

// // package of pixteroid
// // import fs from 'fs';
// // import path from 'path';
// import { upscale } from 'pixteroid';

// // AI Based Upscaling
// import UpscalerJS from 'upscaler';

// // Upload and save
// export const uploadImage = async (req, res) => {
//   if (!req.file) return res.status(400).send('No file uploaded');

//   try {
//     const image = new Image({
//       filename: req.file.originalname,
//       data: req.file.buffer,
//       contentType: req.file.mimetype
//     });
//     await image.save();

//     // Redirect to home with uploaded image ID for preview
//     res.redirect(`/?uploadedId=${image._id}`);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Failed to save image');
//   }
// };

// // Enhance image safely for all sizes
// // export const enhanceImageAdvanced = async (req, res) => {
// //   const { id } = req.body;

// //   try {
// //     const image = await Image.findById(id);
// //     if (!image) return res.status(404).send('Image not found');

// //     const metadata = await sharp(image.data).metadata();
// //     const width = metadata.width < 3840 ? 3840 : metadata.width;

// //     // Multi-step enhancement
// //     const enhancedBuffer = await sharp(image.data)
// //       .resize({ width, withoutEnlargement: true })

// //       // Noise reduction
// //       .median(2)
// //       .blur(0.2)

// //       // Color & contrast
// //       .modulate({ brightness: 1.2, saturation: 1.5, hue: 5 })
// //       .linear(1.4, -25)
// //       .gamma(1.15)

// //       // Sharpen edges
// //       .sharpen(3, 1, 0.5)          // multiple parameters: sigma, flat, jagged
// //       .convolve({                  // subtle edge enhancement kernel
// //         width: 3,
// //         height: 3,
// //         kernel: [-1, -1, -1, -1, 16, -1, -1, -1, -1]
// //       })

// //       // Color space & metadata
// //       .toColourspace('srgb')
// //       .normalize()
// //       .withMetadata()
// //       .toBuffer();

// //     const enhancedImage = new Image({
// //       filename: 'enhanced-' + image.filename,
// //       data: enhancedBuffer,
// //       contentType: image.contentType
// //     });

// //     await enhancedImage.save();

// //     res.redirect(`/?uploadedId=${image._id}&enhancedId=${enhancedImage._id}`);
// //   } catch (err) {
// //     console.error('Advanced Enhancement error:', err);
// //     res.status(500).send('Enhancement failed: ' + err.message);
// //   }
// // };
// export const enhanceImage = async (req, res) => {
//   const { id } = req.body;

//   try {
//     const image = await Image.findById(id);
//     if (!image) return res.status(404).send('Image not found');

//     // Step 1: Standard sharp enhancement
//     const metadata = await sharp(image.data).metadata();
//     const width = metadata.width < 3840 ? 3840 : metadata.width;

//     const sharpBuffer = await sharp(image.data)
//       .resize({ width, withoutEnlargement: true })
//       .median(2)
//       .blur(0.2)
//       .modulate({ brightness: 1.2, saturation: 1.5, hue: 5 })
//       .linear(1.4, -25)
//       .gamma(1.15)
//       .sharpen(3, 1, 0.5)
//       .convolve({
//         width: 3,
//         height: 3,
//         kernel: [-1, -1, -1, -1, 16, -1, -1, -1, -1]
//       })
//       .toColourspace('srgb')
//       .normalize()
//       .withMetadata()
//       .toBuffer();

//     // Step 2: Pixteroid enhancement (optional upscale or detail boost)
//     const enhancedBuffer = await upscale(sharpBuffer, {
//       scale: 1, // 1 = keep same size, just AI enhancement; change to 2 for upscaling
//       mode: 'photo', // or 'standard'
//     });

//     // Save enhanced image
//     const enhancedImage = new Image({
//       filename: 'enhanced-' + image.filename,
//       data: enhancedBuffer,
//       contentType: image.contentType
//     });

//     await enhancedImage.save();

//     res.redirect(`/?uploadedId=${image._id}&enhancedId=${enhancedImage._id}`);
//   } catch (err) {
//     console.error('Advanced Enhancement error:', err);
//     res.status(500).send('Enhancement failed: ' + err.message);
//   }
// };



// // Download image by ID
// export const downloadImage = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const image = await Image.findById(id);
//     if (!image) return res.status(404).send('Image not found');

//     res.set('Content-Type', image.contentType);
//     res.send(image.data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Failed to download image');
//   }
// };

// packages
// import fs from 'fs';
// import path from 'path';
import sharp from 'sharp';

// import { upscale } from 'pixteroid'; // Node.js compatible Pixteroid
import Image from '../models/Image.js';


// Upload and save image
export const uploadImage = async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');

  try {
    const image = new Image({
      filename: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });
    await image.save();

    res.redirect(`/?uploadedId=${image._id}`);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).send('Failed to save image');
  }
};

// Enhance image with Sharp + Pixteroid
// export const enhanceImage = async (req, res) => {
//   const { id } = req.body;

//   try {
//     const image = await Image.findById(id);
//     if (!image) return res.status(404).send('Image not found');

//     // Step 1: Sharp enhancement
//     const metadata = await sharp(image.data).metadata();
//     const width = metadata.width < 3840 ? 3840 : metadata.width;

//     const sharpBuffer = await sharp(image.data)
//       .resize({ width, withoutEnlargement: true })
//       .median(2) // noise reduction
//       .blur(0.5)
//       .modulate({ brightness: 1.2, saturation: 1.5, hue: 5 })
//       .linear(1.4, -25)
//       .gamma(1.15)
//       .sharpen(0.5, 1, 0.5)
//       .convolve({
//         width: 3,
//         height: 3,
//         kernel: [-1, -1, -1, -1, 16, -1, -1, -1, -1],
//       })
//       .toColourspace('srgb')
//       .normalize()
//       .withMetadata()
//       .toBuffer(); // Buffer output, safe for MongoDB

//     // Step 2: Pixteroid AI enhancement (returns Buffer)
//     const enhancedBuffer = await upscale(sharpBuffer, {
//       scale: 1, // 1 = keep size, 2 = upscale
//       mode: 'photo', // or 'standard'
//     });

//     // Step 3: Save enhanced image to MongoDB
//     const enhancedImage = new Image({
//       filename: 'enhanced-' + image.filename,
//       data: enhancedBuffer, // Buffer is valid
//       contentType: image.contentType,
//     });

//     await enhancedImage.save();

//     res.redirect(`/?uploadedId=${image._id}&enhancedId=${enhancedImage._id}`);
//   } catch (err) {
//     console.error('Enhancement error:', err);
//     res.status(500).send('Enhancement failed: ' + err.message);
//   }
// };

// export const enhanceImage = async (req, res) => {
//   const { id } = req.body;

//   try {
//     const image = await Image.findById(id);
//     if (!image) return res.status(404).send('Image not found');

//     // Ensure the temp directory exists
//     const tempDir = path.resolve('./temp');
//     if (!fs.existsSync(tempDir)) {
//       fs.mkdirSync(tempDir, { recursive: true });
//     }

//     // Process image with Sharp
//     const metadata = await sharp(image.data).metadata();
//     const width = metadata.width < 3840 ? 3840 : metadata.width;
//     const sharpBuffer = await sharp(image.data)
//       .resize({ width, withoutEnlargement: true })
//       .median(2)
//       .blur(0.5)
//       .modulate({ brightness: 1.2, saturation: 1.5, hue: 5 })
//       .linear(1.4, -25)
//       .gamma(1.15)
//       .sharpen(0.5, 1, 0.5)
//       .convolve({ width: 3, height: 3, kernel: [-1, -1, -1, -1, 16, -1, -1, -1, -1] })
//       .toColourspace('srgb')
//       .normalize()
//       .withMetadata()
//       .toBuffer();

//     // Save the Sharp result to a temp file
//     const tempPath = path.join(tempDir, `temp-sharp-${Date.now()}.png`);
//     fs.writeFileSync(tempPath, sharpBuffer);

//     // Prepare an output path for Pixteroid
//     const enhancedPath = path.join(tempDir, `enhanced-${Date.now()}.png`);
//     console.log("Enhanced path:", enhancedPath); // should print a string like C:\Code\...


//     // ✅ Call upscale ONCE with a valid output path
//     await upscale(tempPath, {
//       scale: 1,
//       mode: "photo",
//       to: enhancedPath   // ✅ must be a string
//     });
    

//     // Read the enhanced image from disk
//     const enhancedBuffer = fs.readFileSync(enhancedPath);

//     // Clean up temp files
//     try {
//       fs.unlinkSync(tempPath);
//       fs.unlinkSync(enhancedPath);
//     } catch (cleanupErr) {
//       console.warn('Temp cleanup failed:', cleanupErr.message);
//     }

//     // Save the enhanced image to MongoDB
//     const enhancedImage = new Image({
//       filename: 'enhanced-' + image.filename,
//       data: enhancedBuffer,
//       contentType: image.contentType,
//     });
//     await enhancedImage.save();

//     res.redirect(`/?uploadedId=${image._id}&enhancedId=${enhancedImage._id}`);
//   } catch (err) {
//     console.error('Enhancement error:', err);
//     res.status(500).send('Enhancement failed: ' + err.message);
//   }
// };


export const enhanceImage = async (req, res) => {
  const { id } = req.body;

  try {
    const image = await Image.findById(id);
    if (!image) return res.status(404).render('404');

    // ---- Get metadata to determine resize ----
    const metadata = await sharp(image.data).metadata();
    const width = metadata.width < 3840 ? 3840 : metadata.width;

    // ---- Advanced Sharp enhancement ----
    const enhancedBuffer = await sharp(image.data)
      .resize({ width, withoutEnlargement: true })
      .median(3)                  // stronger noise reduction
      .blur(1)                     // subtle blur for smoothing
      .modulate({
        brightness: 1.3,           // brighter
        saturation: 1.8,           // more vivid
        hue: 10                     // slight hue shift
      })
      .linear(1.5, -30)            // contrast adjustment
      .gamma(1.2)                  // gamma correction
      .sharpen(1.2, 2, 1)          // stronger sharpening
      .convolve({
        width: 3,
        height: 3,
        kernel: [-1, -1, -1, -1, 20, -1, -1, -1, -1], // high-pass effect
      })
      .modulate({ brightness: 1.05 }) // extra brightness tweak
      .normalize()                  // normalize colors
      .toColourspace('srgb')
      .withMetadata()
      .toBuffer();

    // ---- Save enhanced image to MongoDB ----
    const enhancedImage = new Image({
      filename: 'enhanced-' + image.filename,
      data: enhancedBuffer,
      contentType: image.contentType,
    });

    await enhancedImage.save();

    // ---- Redirect with IDs ----
    res.redirect(`/?uploadedId=${image._id}&enhancedId=${enhancedImage._id}`);
  } catch (err) {
    console.error('Enhancement error:', err);
    res.status(500).send('Enhancement failed: ' + err.message);
  }
};



// Download image by ID
export const downloadImage = async (req, res) => {
  try {
    const id = req.params.id;
    const image = await Image.findById(id);
    if (!image) return res.status(404).send('Image not found');

    res.set('Content-Type', image.contentType);
    res.send(image.data);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).send('Failed to download image');
  }
};

