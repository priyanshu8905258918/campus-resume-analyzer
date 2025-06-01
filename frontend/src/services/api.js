const API_BASE_URL = 'http://127.0.0.1:8080';

export const api = {
    // Test connection to backend
    testConnection: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error connecting to backend:', error);
            throw error;
        }
    },

    // Upload resume
    uploadResume: async (file, userId) => {
        try {
            console.log('Uploading file:', file.name, 'for user:', userId);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', userId);

            console.log('Sending request to:', `${API_BASE_URL}/upload`);
            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const data = await response.json();
            console.log('Upload response:', data);
            return data;
        } catch (error) {
            console.error('Error uploading resume:', error);
            throw error;
        }
    },

    // Get analysis
    getAnalysis: async (resumeId) => {
        try {
            console.log('Getting analysis for resume:', resumeId);
            const response = await fetch(`${API_BASE_URL}/analyze/${resumeId}`);
            if (!response.ok) {
                throw new Error('Failed to get analysis');
            }
            const data = await response.json();
            console.log('Analysis response:', data);
            return data;
        } catch (error) {
            console.error('Error getting analysis:', error);
            throw error;
        }
    },

    // Get history
    getHistory: async (userId) => {
        try {
            console.log('Getting history for user:', userId);
            const response = await fetch(`${API_BASE_URL}/history/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to get history');
            }
            const data = await response.json();
            console.log('History response:', data);
            return data;
        } catch (error) {
            console.error('Error getting history:', error);
            throw error;
        }
    }
}; 