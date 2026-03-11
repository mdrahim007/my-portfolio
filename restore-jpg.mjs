import sharp from 'sharp';
import path from 'path';

const PUBLIC_DIR = 'd:/my-portfolio/public';
const INPUT_IMAGE = path.join(PUBLIC_DIR, 'my_photo2.webp');
const OUTPUT_IMAGE = path.join(PUBLIC_DIR, 'my_photo2.jpg');

async function restoreJpg() {
    try {
        console.log(`Generating JPG from ${INPUT_IMAGE}...`);
        
        await sharp(INPUT_IMAGE)
            .jpeg({ quality: 90 })
            .toFile(OUTPUT_IMAGE);
            
        console.log(`Successfully created -> ${OUTPUT_IMAGE}`);
    } catch (err) {
        console.error('Error generating JPG:', err);
    }
}

restoreJpg();
