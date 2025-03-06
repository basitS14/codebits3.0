// API configuration
const API_BASE_URL = 'http://localhost:3000';

// Common fetch options
const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Include cookies in all requests
};

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    console.log(`Making API call to: ${url}`, fetchOptions);
    
    // Make the fetch request
    const response = await fetch(url, fetchOptions);
    console.log(`Response status: ${response.status}`);
    
    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    console.log(`Response content type: ${contentType}`);
    
    // For non-JSON responses
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        const text = await response.text();
        console.error(`API error (${response.status}): ${text}`);
        throw new Error(`API call failed with status: ${response.status}`);
      }
      return { success: true };
    }
    
    // Parse JSON response
    const data = await response.json();
    console.log(`Response data:`, data);
    
    if (!response.ok) {
      throw new Error(data.error || `API call failed with status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    throw error;
  }
};

// API endpoints
export const API = {
  auth: {
    verifyToken: (idToken) => apiCall('/api/auth/verify-token', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    }),
    checkSession: () => apiCall('/api/auth/session', {
      method: 'GET',
    }),
    logout: () => apiCall('/api/auth/logout', {
      method: 'POST',
    }),
  },
  user: {
    getProfile: () => apiCall('/api/user/profile'),
    savePreferences: (preferences) => apiCall('/api/user/preferences', {
      method: 'POST',
      body: JSON.stringify({ preferences }),
    }),
    getPreferences: () => apiCall('/api/user/preferences'),
    uploadFile: (formData) => apiCall('/api/upload', {
      method: 'POST',
      headers: {}, // Let the browser set the correct Content-Type with boundary
      body: formData,
      credentials: 'include',
    }),
  },
  neighborhoods: {
    search: (criteria) => apiCall('/api/neighborhoods/search', {
      method: 'POST',
      body: JSON.stringify(criteria),
    }),
  },
  places: {
    getRecommendations: (criteria) => apiCall('/api/places/recommendations', {
      method: 'POST',
      body: JSON.stringify(criteria),
    }),
  },
  social: {
    getUserInterests: () => apiCall('/api/user/interests'),
    getGroups: (criteria) => apiCall('/api/social/groups', {
      method: 'POST',
      body: JSON.stringify(criteria),
    }),
  },
  bot: {
    sendMessage: (message) => apiCall('/api/bot/message', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
  },
};

export default API; 