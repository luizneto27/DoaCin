//busca o token no localStorage e o anexa ao fetch
export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers, //preserva outros headers 
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: headers,
  });

  if (response.status === 401) {
    //se o token expirar ou for invalido, desloga o usuario
    localStorage.removeItem('token');
    window.location.href = '/login'; //redirecionamento forcado
    throw new Error('Não autorizado');
  }

  return response;
};