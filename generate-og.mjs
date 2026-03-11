import sharp from 'sharp';
import path from 'path';

const PUBLIC_DIR = 'd:/my-portfolio/public';
const INPUT_IMAGE = path.join(PUBLIC_DIR, 'myGov-homepage.webp'); // Dark-themed hero image
const OUTPUT_IMAGE = path.join(PUBLIC_DIR, 'og-preview.jpg');

async function generateOgImage() {
    try {
        console.log(`Generating 1200x630 OG image from ${INPUT_IMAGE}...`);
        
        await sharp(INPUT_IMAGE)
            .resize(1200, 630, {
                fit: 'cover',
                position: 'top', // Crop from the top of the screenshot to capture the main UI
            })
            // Overlay a subtle dark gradient/tint to make it look premium for the preview
            .composite([
                {
                    input: Buffer.from(`
                    <svg width="1200" height="630">
                        <rect width="1200" height="630" fill="rgba(11, 11, 17, 0.4)"/>
                    </svg>`),
                    blend: 'over'
                }
            ])
            .jpeg({ quality: 90 })
            .toFile(OUTPUT_IMAGE);
            
        console.log(`Successfully created OG Preview Image -> ${OUTPUT_IMAGE}`);
    } catch (err) {
        console.error('Error generating OG image:', err);
    }
}

generateOgImage();
