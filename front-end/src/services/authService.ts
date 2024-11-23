// authService.ts
type User = {
    username: string;
    role: string;
  };
  
  // Simuler un backend avec des utilisateurs fictifs
  const mockUsers: User[] = [
    { username: "admin", role: "admin" },
    { username: "residential", role: "residential" },
    { username: "business", role: "business" },
  ];
  
  // Simuler une requête d'authentification
  export const login = async (username: string, password: string): Promise<User | null> => {
    // Simuler un délai pour représenter une requête HTTP
    await new Promise((resolve) => setTimeout(resolve, 500));
  
    // Authentification fictive : vérifier le username
    const user = mockUsers.find((u) => u.username === username);
  
    if (user && password === `${username}123`) {
      // Mot de passe fictif 
      return user;
    }
    return null; // Échec de la connexion
  };
  
  // Simuler une fonction pour récupérer le rôle utilisateur depuis un token ou localStorage
  export const getUserRole = (): string | null => {
    return localStorage.getItem("userRole");
  };
  
  // Simuler une fonction pour déconnecter l'utilisateur
  export const logout = (): void => {
    localStorage.removeItem("userRole");
  };
  