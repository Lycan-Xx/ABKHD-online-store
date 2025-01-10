import api from './api';

export const getProducts = async () => {
  const { data } = await api.get('/products');
  return data;
};

export const createProduct = async (formData) => {
  const { data } = await api.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const updateProduct = async (id, formData) => {
  const { data } = await api.put(`/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};