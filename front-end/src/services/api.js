import axios from 'axios';

// Configuration de base d'Axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const access = localStorage.getItem('access_token');
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// Intercepteur pour gérer le rafraîchissement du token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) throw new Error('Pas de refresh token');
        
        const res = await axios.post('http://localhost:8000/api/auth/token/refresh/', { 
          refresh 
        });
        
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh expiré → déconnecter l'utilisateur
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        if (window.location.pathname !== '/connexion') {
          window.location.href = '/connexion';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// 🎯 API Authentification
export const inscription = (userData) => 
  api.post('/auth/inscription/', userData);

export const connexion = (credentials) => 
  api.post('/auth/connexion/', credentials);

export const deconnexion = (refreshToken) => 
  api.post('/auth/deconnexion/', { refresh: refreshToken });

export const refreshToken = (refresh) => 
  api.post('/auth/token/refresh/', { refresh });

export const getProfil = () => 
  api.get('/auth/moi/');

// 🔍 API Recherche d'utilisateurs
export const rechercheUtilisateurs = (params) => {
  const queryParams = new URLSearchParams();
  
  if (params.q) queryParams.append('q', params.q);
  if (params.role) queryParams.append('role', params.role);
  if (params.page) queryParams.append('page', params.page);
  if (params.page_size) queryParams.append('page_size', params.page_size);
  
  return api.get(`/auth/recherche/?${queryParams.toString()}`);
};

// 👤 API Profil utilisateur public
export const getProfilPublic = (userId) => 
  api.get(`/auth/utilisateurs/${userId}/`);

// 📸 API Publications
export const getPublications = (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page);
  if (params.page_size) queryParams.append('page_size', params.page_size);
  if (params.type) queryParams.append('type', params.type);
  if (params.categorie) queryParams.append('categorie', params.categorie);
  if (params.tag) queryParams.append('tag', params.tag);
  if (params.photographe) queryParams.append('photographe', params.photographe);
  if (params.q) queryParams.append('q', params.q);
  
  const url = `/publications/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get(url);
};

export const getPublicationDetail = (publicationId) => 
  api.get(`/publications/${publicationId}/`);

export const createPublication = (formData) => 
  api.post('/publications/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updatePublication = (publicationId, formData) => 
  api.patch(`/publications/${publicationId}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deletePublication = (publicationId) => 
  api.delete(`/publications/${publicationId}/`);

// ❤️ API Like / Unlike
export const likePublication = (publicationId) => 
  api.post(`/publications/${publicationId}/like/`);

export const getMesPublications = () => 
  api.get('/publications/mes-publications/');

export const getCategories = () => 
  api.get('/publications/categories/');

export const getTags = (q) => {
  const queryParams = new URLSearchParams();
  if (q) queryParams.append('q', q);
  return api.get(`/publications/tags/?${queryParams.toString()}`);
};

// 🛒 API Commandes
export const getPanier = () => 
  api.get('/commandes/panier/');

export const ajouterAuPanier = (publicationId) => 
  api.post('/commandes/panier/ajouter/', { publication_id: publicationId });

export const retirerDuPanier = (publicationId) => 
  api.post('/commandes/panier/retirer/', { publication_id: publicationId });

export const viderPanier = () => 
  api.delete('/commandes/panier/vider/');

export const validerPanier = () => 
  api.post('/commandes/panier/');

export const payerCommande = (commandeId) => 
  api.post(`/commandes/${commandeId}/payer/`, { confirmation: true });

export const annulerCommande = (commandeId) => 
  api.post(`/commandes/${commandeId}/annuler/`, { confirmation: true });

export const getHistoriqueCommandes = (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page);
  if (params.page_size) queryParams.append('page_size', params.page_size);
  const url = `/commandes/historique/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get(url);
};

export default api;