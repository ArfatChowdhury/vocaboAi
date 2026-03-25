export const lightColors = {
  primary: '#007AFF',
  background: '#ffffff',
  text: {
    primary: '#1a1a1a',
    secondary: '#666666',
    placeholder: '#999999',
    inverse: '#ffffff',
  },
  border: {
    default: '#eeeeee',
    card: '#f0f0f0',
    input: '#dddddd',
    google: '#dddddd',
  },
  error: {
    text: '#FF3B30',
    background: '#fff0f0',
  },
  input: {
    background: '#f5f5f5',
  },
  social: {
    google: '#4285F4',
  },
  transparent: 'transparent',
  black: '#000000',
  white: '#ffffff',
};

export const darkColors: typeof lightColors = {
  primary: '#0A84FF',
  background: '#121212',
  text: {
    primary: '#F2F2F2',
    secondary: '#A0A0A0',
    placeholder: '#666666',
    inverse: '#1a1a1a',
  },
  border: {
    default: '#2C2C2E',
    card: '#1C1C1E',
    input: '#3A3A3C',
    google: '#3A3A3C',
  },
  error: {
    text: '#FF453A',
    background: '#2C1515',
  },
  input: {
    background: '#1C1C1E',
  },
  social: {
    google: '#4285F4',
  },
  transparent: 'transparent',
  black: '#000000',
  white: '#ffffff',
};

// Default export keeps backwards compatibility
export const colors = lightColors;
