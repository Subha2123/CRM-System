import apiClient from '@/src/lib/apiClient';

export const customerService = {
  getCustomers(params: {
    search?: string;
    status?: string;
  }) {
    return apiClient.get('/customers', { params });
  },

  createCustomer(data: any) {
    return apiClient.post('/customers', data);
  },

  updateCustomer(id: string, data: any) {
    return apiClient.put(`/customers/${id}`, data);
  },

  deleteCustomer(id: string) {
    return apiClient.delete(`/customers/${id}`);
  },

  getDashboarData(){
    return apiClient.get('/customers/dashboard')
  },

  getCustomerAtivity(){
    return apiClient.get('/activity')
  }
};
