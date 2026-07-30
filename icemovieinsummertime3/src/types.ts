export interface Attendee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  checkedIn: boolean;
  checkInTime?: string;
  signatureDataUrl?: string;
  category?: 'Voluntar' | 'Participant' | 'Invitat Special' | 'Echipă Tehnică';
  registeredOnSite?: boolean;
  notes?: string;
}

export interface CheckInStats {
  total: number;
  checkedIn: number;
  registeredOnSite: number;
  pending: number;
}

export interface MovieProgram {
  id: string;
  title: string;
  genre: string;
  day: string;
  time: string;
  duration: string;
  rating: string;
  description: string;
  image: string;
  location?: string;
  week?: string;
}

export type ActiveTab = 'checkin' | 'program' | 'about-festival' | 'about-us' | 'contact' | 'admin' | 'drive';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string | number;
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  parents?: string[];
  content?: string;
  isMovie?: boolean;
  movieGenre?: string;
  movieRating?: string;
  movieDuration?: string;
}

export interface AuthStatusResponse {
  authenticated: boolean;
  hasClientId: boolean;
  redirectUri?: string;
  user?: {
    name?: string;
    email?: string;
    picture?: string;
  };
  error?: string;
}

export type ViewTab = 'preview' | 'movies' | 'explorer' | 'code' | 'ai-audit';
