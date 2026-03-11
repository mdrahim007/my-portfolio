import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const PUBLIC_DIR = 'd:/my-portfolio/public';

async function convertImagesToWebp() {
    try {
        const files = await fs.readdir(PUBLIC_DIR);
        const imageFiles = files.filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));

        for (const file of imageFiles) {
            const inputPath = path.join(PUBLIC_DIR, file);
            const ext = path.extname(file);
            const basename = path.basename(file, ext);
            const outputPath = path.join(PUBLIC_DIR, `${basename}.webp`);

            console.log(`Converting ${file} to WebP...`);
            
            await sharp(inputPath)
                .webp({ quality: 80, effort: 6 })
                .toFile(outputPath);
                
            console.log(`Success: -> ${basename}.webp`);
            
            // Delete original file to save space
            await fs.unlink(inputPath);
        }
        
        console.log('All images converted to WebP successfully!');
    } catch (err) {
        console.error('Error during conversion:', err);
    }
}

convertImagesToWebp();
