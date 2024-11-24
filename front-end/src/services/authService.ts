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
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || "Erreur de connexion.");
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

  export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    console.log("Déconnexion réussie, localStorage vidé.");
  };
  
