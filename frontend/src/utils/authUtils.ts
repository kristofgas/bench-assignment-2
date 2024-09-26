import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
    sub: string;
    unique_name: string;
    jti: string;
    exp: number;
    iss: string;
    aud: string;
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  }
  
  export const getRoleFromToken = (token: string): string | null => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      console.log('Decoded token:', decoded); // Debugging statement
      return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    } catch (error) {
      console.error('Failed to decode token', error);
      return null;
    }
  };