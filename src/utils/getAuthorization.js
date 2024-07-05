
export const getAuthorization = (type) => {
  const token = localStorage.getItem("token");
  const refresh_token = localStorage.getItem("refresh_token");
 

  if (token || refresh_token) {
    switch (type) {
      case 'refresh':
        return `Bearer ${refresh_token}`;
      case 'token':
        return `Bearer ${token}`;
      default:
        return `Bearer ${token}`;
    }
  }

  return null;
}

