import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/users";


export const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/login/`,
        new URLSearchParams({
          username, // Clé 'username' attendue par le back-end
          password, // Clé 'password' attendue par le back-end
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // Spécifie le type de contenu
          },
        }
      );
  
      return response.data; // Renvoie les données utilisateur
    } catch (error: any) {
      if (error.response) {
        // Gestion des erreurs basées sur les codes de réponse
        if (error.response.status === 403) {
          throw new Error("Accès refusé. Contactez l'administrateur pour plus d'informations.");
        }
  
        if (error.response.data) {
          // Vérifie si le message d'erreur indique un changement de mot de passe obligatoire
          if (error.response.data.error === "force_password_change") {
            throw new Error("force_password_change"); // Indique au front qu'il doit rediriger
          }
          throw new Error(error.response.data.error || "Erreur de connexion.");
        }
      }
  
      throw new Error("Impossible de contacter le serveur.");
    }
  };
  


export const signup = async (username: string, password: string, role: string) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/users/register/",
        new URLSearchParams({
          username,
          password,
          role, // Le rôle est obligatoire
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // Format requis par Django
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error || "Une erreur s'est produite.");
      }
      throw new Error("Impossible de contacter le serveur.");
    }
  };

  export const getUsersByRole = async (role: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/role/${role}/`);
      return response.data.users; // Retourne la liste des utilisateurs
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Impossible de récupérer les utilisateurs.");
    }
  };

  export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    console.log("Déconnexion réussie, localStorage vidé.");
  };

  export type SecuritySettings = {
    password_complexity: string;
    session_duration: number;
    max_login_attempts: number;
    lockout_duration: number;
    force_password_change: boolean;
  };
  
  // Récupérer les paramètres de sécurité
  export const getSecuritySettings = async (): Promise<SecuritySettings> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/security-settings/`);
      return response.data; // Retourne les paramètres de sécurité
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Impossible de récupérer les paramètres de sécurité.");
    }
  };
  
  // Mettre à jour les paramètres de sécurité
  export const updateSecuritySettings = async (settings: SecuritySettings): Promise<void> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/security-settings/`, settings, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        transformRequest: [(data) => {
          // Transformer l'objet settings en une chaîne URL-encoded
          const formData = new URLSearchParams();
          for (const key in data) {
            formData.append(key, data[key].toString());
          }
          return formData.toString();
        }],
      });
      if (response.status !== 200) {
        throw new Error("Erreur lors de la mise à jour des paramètres.");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Impossible de mettre à jour les paramètres de sécurité.");
    }
  };
  
// Fonction pour changer le mot de passe
export const changePassword = async (
    username: string,
    currentPassword: string,
    newPassword: string
  ) => {
    const token = localStorage.getItem("token"); // Récupérer le token depuis localStorage
  
    if (!token) {
      throw new Error("Vous devez être connecté pour changer le mot de passe.");
    }
  
    // Construire les données à envoyer
    const requestData = new URLSearchParams({
      username,
      current_password: currentPassword, // mot de passe actuel
      new_password: newPassword,
    }).toString();
  
    const response = await axios.post(
      "http://127.0.0.1:8000/api/users/change-password/",
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Ajout du token dans le header
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  
    return response.data; // Retourne les données de l'API
  };
  
  

  export const verifyToken = async (token: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/verify-token/`,
        new URLSearchParams({ token }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Échec de la vérification du token.");
    }
  };
  
