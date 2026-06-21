// src/services/abonnementService.js

const API_BASE_URL = 'http://localhost:8000/api/abonnements';

const getHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.errors || 'Une erreur est survenue');
  }
  return data;
};

// ============================================
// 1. GRILLE TARIFAIRE
// ============================================

export const getTarifs = async () => {
  const response = await fetch(`${API_BASE_URL}/tarifs/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse(response);
};

export const getAdminTarifs = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/tarifs/`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse(response);
};

// ============================================
// 2. SOUSCRIRE
// ============================================

export const souscrireAbonnement = async (type, duree) => {
  const response = await fetch(`${API_BASE_URL}/souscrire/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ type, duree }),
  });
  return handleResponse(response);
};

// ============================================
// 3. STATUT ABONNEMENT
// ============================================

export const getStatutAbonnement = async () => {
  const response = await fetch(`${API_BASE_URL}/statut/`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse(response);
};

// ============================================
// 4. ANNULER
// ============================================

export const annulerAbonnement = async (abonnementId) => {
  const response = await fetch(`${API_BASE_URL}/${abonnementId}/annuler/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ confirmation: true }),
  });
  return handleResponse(response);
};

// ============================================
// 5. HISTORIQUE
// ============================================

export const getHistoriqueAbonnements = async () => {
  const response = await fetch(`${API_BASE_URL}/historique/`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse(response);
};

// ============================================
// 6. ADMIN - CRUD
// ============================================

export const creerTarif = async (tarifData) => {
  const response = await fetch(`${API_BASE_URL}/admin/tarifs/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(tarifData),
  });
  return handleResponse(response);
};

export const modifierTarif = async (tarifId, tarifData) => {
  const response = await fetch(`${API_BASE_URL}/admin/tarifs/${tarifId}/`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(tarifData),
  });
  return handleResponse(response);
};

export const supprimerTarif = async (tarifId) => {
  const response = await fetch(`${API_BASE_URL}/admin/tarifs/${tarifId}/`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(response);
};

// ============================================
// 7. ABONNÉS (Utilisateurs suivis)
// ============================================

/**
 * Récupère la liste des abonnés (followers) d'un utilisateur
 * @param {string} userId - L'ID de l'utilisateur (optionnel, si non fourni utilise l'utilisateur courant)
 */
export const getAbonnesUtilisateur = async (userId) => {
  let url;
  if (userId) {
    url = `${API_BASE_URL}/utilisateurs/${userId}/abonnes/`;
  } else {
    // Récupérer l'ID de l'utilisateur courant depuis le profil
    const userProfile = localStorage.getItem('user_profile');
    let currentUserId = null;
    try {
      if (userProfile) {
        const user = JSON.parse(userProfile);
        currentUserId = user.id || user.user_id;
      }
    } catch (e) {
      console.error('Erreur parsing user_profile:', e);
    }
    
    if (currentUserId) {
      url = `${API_BASE_URL}/utilisateurs/${currentUserId}/abonnes/`;
    } else {
      // Fallback: essayer de récupérer depuis le token
      console.warn('Impossible de déterminer l\'ID utilisateur pour les abonnés');
      return { success: false, data: [], message: 'Utilisateur non identifié' };
    }
  }
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse(response);
};

/**
 * Récupère la liste des suivis (following) d'un utilisateur
 */
export const getSuivisUtilisateur = async (userId) => {
  let url;
  if (userId) {
    url = `${API_BASE_URL}/utilisateurs/${userId}/suivis/`;
  } else {
    const userProfile = localStorage.getItem('user_profile');
    let currentUserId = null;
    try {
      if (userProfile) {
        const user = JSON.parse(userProfile);
        currentUserId = user.id || user.user_id;
      }
    } catch (e) {
      console.error('Erreur parsing user_profile:', e);
    }
    
    if (currentUserId) {
      url = `${API_BASE_URL}/utilisateurs/${currentUserId}/suivis/`;
    } else {
      return { success: false, data: [], message: 'Utilisateur non identifié' };
    }
  }
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse(response);
};

// ============================================
// 8. SUIVI (Follow / Unfollow)
// ============================================

export const toggleSuivi = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/suivre/${userId}/`, {
    method: 'POST',
    headers: getHeaders(),
  });
  return handleResponse(response);
};

// ============================================
// 9. FIL D'ACTUALITÉ
// ============================================

export const getFilActualite = async () => {
  const response = await fetch(`${API_BASE_URL}/fil-actualite/`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse(response);
};