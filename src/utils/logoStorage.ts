import { DriveFile } from '../types';
import iceMovieLogo from '../assets/images/ice_movie_logo_1785176719378.jpg';

export const getMainLogoUrl = (driveFiles: DriveFile[] = []): string => {
  // 1. Check if user uploaded a custom original logo file locally
  try {
    const savedCustomLogo = localStorage.getItem('icemovie_custom_main_logo');
    if (savedCustomLogo) {
      return savedCustomLogo;
    }
  } catch (e) {
    console.error('Error reading custom logo:', e);
  }

  // 2. Check if Google Drive is connected and contains an Ice Movie logo image file
  if (driveFiles && driveFiles.length > 0) {
    const logoFile = driveFiles.find((f) => {
      const name = f.name.toLowerCase();
      const isImage = f.mimeType?.startsWith('image/') || /\.(jpg|jpeg|png|svg|webp)$/i.test(name);
      return isImage && (name.includes('icemovie') || name.includes('ice_movie') || name.includes('ice movie') || (name.includes('logo') && !name.includes('h4h')));
    });

    if (logoFile) {
      return `/api/drive/file/${logoFile.id}/media`;
    }
  }

  // 3. Fallback to the imported IceMovie asset
  return iceMovieLogo;
};

export const setMainLogoUrl = (dataUrl: string) => {
  try {
    localStorage.setItem('icemovie_custom_main_logo', dataUrl);
    window.dispatchEvent(new Event('icemovie_logo_changed'));
  } catch (e) {
    console.error('Error saving logo:', e);
  }
};

export const clearMainLogoUrl = () => {
  try {
    localStorage.removeItem('icemovie_custom_main_logo');
    window.dispatchEvent(new Event('icemovie_logo_changed'));
  } catch (e) {
    console.error('Error clearing logo:', e);
  }
};

// ================= H4H (Hope 4 Humanity) NGO Logo =================

export const getH4HLogoUrl = (driveFiles: DriveFile[] = []): string | null => {
  // 1. Check custom uploaded H4H logo
  try {
    const savedH4HLogo = localStorage.getItem('icemovie_custom_h4h_logo');
    if (savedH4HLogo) {
      return savedH4HLogo;
    }
  } catch (e) {
    console.error('Error reading H4H logo:', e);
  }

  // 2. Check Google Drive files for h4h / hope 4 humanity logo
  if (driveFiles && driveFiles.length > 0) {
    const h4hFile = driveFiles.find((f) => {
      const name = f.name.toLowerCase();
      const isImage = f.mimeType?.startsWith('image/') || /\.(jpg|jpeg|png|svg|webp)$/i.test(name);
      return isImage && (name.includes('h4h') || name.includes('hope') || name.includes('humanity'));
    });

    if (h4hFile) {
      return `/api/drive/file/${h4hFile.id}/media`;
    }
  }

  return null;
};

export const setH4HLogoUrl = (dataUrl: string) => {
  try {
    localStorage.setItem('icemovie_custom_h4h_logo', dataUrl);
    window.dispatchEvent(new Event('icemovie_logo_changed'));
  } catch (e) {
    console.error('Error saving H4H logo:', e);
  }
};

