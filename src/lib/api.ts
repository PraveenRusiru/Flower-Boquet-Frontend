import axios, { AxiosError } from "axios"
import { get } from "http";
import { ref } from "process";
const API_BASE_URL = 'http://localhost:5002/api/v1';

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

const api = axios.create({
  baseURL: "http://localhost:5002/api/v1"
  // baseURL: "http://localhost:5000/api/v1"
})

const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register"]

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")

  const isPUblic = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url))

  if (!isPUblic && token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config

    if (
      error.response?.status === 401 &&
      !PUBLIC_ENDPOINTS.some((url) => originalRequest.url?.includes(url)) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) {
          throw new Error("No refresh token available")
        }

        const data = await authApi.refreshTokens(refreshToken)
        localStorage.setItem("accessToken", data.accessToken)

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`

        return axios(originalRequest)
      } catch (refreshErr) {
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("accessToken")
        window.location.href = "/login"
        console.error(refreshErr)
        return Promise.reject(refreshErr)
      }
    }
    return Promise.reject(error)
  }
)

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const getAuthHeadersMultipart = () => {
  const token = localStorage.getItem('accessToken');
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Auth API
export const authApi = {
  register: async (data: { name: string; email: string; phone: string; password: string }) => {
    // const response = await fetch(`${API_BASE_URL}/auth/register`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    const response = await api.post('/auth/register', data)
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    // const response = await fetch(`${API_BASE_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    const response = await api.post('/auth/login', data)
    return response.data;
  },

  getProfile: async () => {
    // const response = await fetch(`${API_BASE_URL}/auth/get`, {
    //   method: 'GET',
    //   headers: getAuthHeaders(),
    // });
    const response = await api.get('/auth/get')
    return response.data;
  },

  updateProfile: async (data: { name: string; email: string; phone: string }) => {
    // const response = await fetch(`${API_BASE_URL}/auth/update`, {
    //   method: 'PUT',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify(data),
    // });
    const response = await api.put('/auth/update', data)
    return response.data;
  },

  changePassword: async (data: { password: string; newPassword: string; ConfirmPassword: string }) => {
    // const response = await fetch(`${API_BASE_URL}/auth/changePw`, {
    //   method: 'POST',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify(data),
    // });
    const response = await api.post('/auth/changePw', data)
    return response.data;
  },
  refreshTokens: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', { refreshToken })
    return response.data
  }
};

// Gift/Products API
export const giftApi = {
  getAll: async () => {
    // const response = await fetch(`${API_BASE_URL}/gift/getAllGifts`, {
    //   headers: getAuthHeaders(),
    // });
    const response = await api.get('/gift/getAllGifts')
    return response.data;
  }
    // return response.json();
,  

  create: async (formData: FormData) => {
    console.log("API - Creating gift with formData:", formData);
    // const response = await fetch(`${API_BASE_URL}/gift/create`, {
    //   method: 'POST',
    //   headers: getAuthHeadersMultipart(),
    //   body: formData,
    // });
    // return response.json();
    const response = await api.post('/gift/create', formData, {
      headers: getAuthHeadersMultipart()
    });
    return response.data;
  },

  updateDetails: async (data: {
    giftId: string;
    name: string;
    description: string;
    price: number;
    colour: string;
    size: string;
    category: string;
  }) => {
    // const response = await fetch(`${API_BASE_URL}/gift/updateDetails`, {
    //   method: 'PUT',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify(data),
    // });
    // return response.json();
    const response = await api.put('/gift/updateDetails', data)
    return response.data;
  },

  updateImages: async (formData: FormData) => {
    // const response = await fetch(`${API_BASE_URL}/gift/updateImages`, {
    //   method: 'PUT',
    //   headers: getAuthHeadersMultipart(),
    //   body: formData,

    // });
    // return response.json();
    const response = await api.put('/gift/updateImages', formData, {
      headers: getAuthHeadersMultipart()
    });
    return response.data;
  },

  deleteImages: async (data: { giftId: string; publicId: string }) => {
    // const response = await fetch(`${API_BASE_URL}/gift/deleteImages`, {
    //   method: 'DELETE',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify(data),
    // });
    // return response.json();
    const response = await api.delete('/gift/deleteImages', { data })
    return response.data;
  },
};

// Customer API
export const customerApi = {
  getAll: async () => {
    // const response = await fetch(`${API_BASE_URL}/customer/getAll`, {
    //   headers: getAuthHeaders(),
    // });
    // return response.json();
    const response = await api.get('/customer/getAll')
    return response.data;
  },

  get: async (customerId: string) => {
    // const response = await fetch(`${API_BASE_URL}/customer/get`, {
    //   method: 'GET',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify({ customerId }),
    // });
    // return response.json();
    const response = await api.get('/customer/get', { params: { customerId } })
    return response.data;
  },

  create: async (data: { name: string; email: string; phone: string; address: string }) => {
    // const response = await fetch(`${API_BASE_URL}/customer/create`, {
    //   method: 'POST',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify(data),
    // });
    // return response.json();
    const response = await api.post('/customer/create', data)
    return response.data;
  },

  update: async (data: { customerId: string; name: string; email: string; phone: string; address: string }) => {
    // const response = await fetch(`${API_BASE_URL}/customer/update`, {
    //   method: 'PUT',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify(data),
    // });
    // return response.json();
    const response = await api.put('/customer/update', data)
    return response.data;
  },

  delete: async (customerId: string) => {
    // const response = await fetch(`${API_BASE_URL}/customer/delete`, {
    //   method: 'DELETE',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify({ customerId }),
    // });
    // return response.json();
    const response = await api.delete('/customer/delete', { data: { customerId } })
    return response.data;
  },
};

// Order API
export const orderApi = {
  getAll: async () => {
    // const response = await fetch(`${API_BASE_URL}/order/all`, {
    //   headers: getAuthHeaders(),
    // });
    // return response.json();
    const response = await api.get('/order/all')
    return response.data;
  },

  get: async (orderId: string) => {
    // const response = await fetch(`${API_BASE_URL}/order/get`, {
    //   method: 'GET',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify({ orderId }),
    // });
    // return response.json();
    const response = await api.get('/order/get', { params: { orderId } })
    return response.data;
  },

  create: async (data: {
    customerId: string;
    items: { productId: string; quantity: number; price: number }[];
    totalAmount: number;
  }) => {
    // const response = await fetch(`${API_BASE_URL}/order/create`, {
    //   method: 'POST',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify(data),
    // });
    // return response.json();
    const response = await api.post('/order/create', data)
    return response.data;
  },

  updateStatus: async (data: { orderId: string; status: string }) => {
    // const response = await fetch(`${API_BASE_URL}/order/updatestatus`, {
    //   method: 'PUT',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify(data),
    // });
    // return response.json();
    const response = await api.put('/order/updatestatus', data)
    return response.data;
  },

  delete: async (orderId: string) => {
    // const response = await fetch(`${API_BASE_URL}/order/delete`, {
    //   method: 'DELETE',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify({ orderId }),
    // });
    // return response.json();
    const response = await api.delete('/order/delete', { data: { orderId } })
    return response.data;
  },
};

// Payment API
export const paymentApi = {
  process: async (data: {
    orderId: string;
    amount: number;
    discount: number;
    paymentMethod: string;
  }) => {
    // const response = await fetch(`${API_BASE_URL}/payment/process`, {
    //   method: 'POST',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify(data),
    // });
    // return response.json();
    const response = await api.post('/payment/process', data)
    return response.data;
  },

  updateStatus: async (data: { paymentId: string; status: string }) => {
    // const response = await fetch(`${API_BASE_URL}/payment/updatestatus`, {
    //   method: 'PUT',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify(data),
    // });
    // return response.json();
    const response = await api.put('/payment/updatestatus', data)
    return response.data;
  },
};

// Library API
export const libraryApi = {
  getAll: async () => {
    // const response = await fetch(`${API_BASE_URL}/library/getAll`, {
    //   headers: getAuthHeaders(),
    // });
    // return response.json();
    const response = await api.get('/library/getAll')
    return response.data;
  },

  get: async (imageId: string) => {
    // const response = await fetch(`${API_BASE_URL}/library/get`, {
    //   method: 'GET',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify({ imageId }),
    // });
    // return response.json();
    const response = await api.get('/library/get', { params: { imageId } })
    return response.data;
  },

  create: async (formData: FormData) => {
    // const response = await fetch(`${API_BASE_URL}/library/create`, {
    //   method: 'POST',
    //   headers: getAuthHeadersMultipart(),
    //   body: formData,
    // });
    // return response.json();
    const response = await api.post('/library/create', formData, {
      headers: getAuthHeadersMultipart()
    });
    return response.data;
  },

  updateTitle: async (data: { libraryId: string; title: string }) => {
    // const response = await fetch(`${API_BASE_URL}/library/updateTitle`, {
    //   method: 'PUT',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify(data),
    // });
    // return response.json();
    const response = await api.put('/library/updateTitle', data)
    return response.data;
  },

  updateImage: async (formData: FormData) => {
    // const response = await fetch(`${API_BASE_URL}/library/updateImg`, {
    //   method: 'PUT',
    //   headers: getAuthHeadersMultipart(),
    //   body: formData,
    // });
    // return response.json();
    const response = await api.put('/library/updateImg', formData, {
      headers: getAuthHeadersMultipart()
    });
    return response.data;
  },

  deleteImage: async (libraryId: string) => {
    // const response = await fetch(`${API_BASE_URL}/library/deleteImg`, {
    //   method: 'DELETE',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify({ libraryId }),
    // });
    // return response.json();
    const response = await api.delete('/library/deleteImg', { data: { libraryId } })
    return response.data;
  },

  delete: async (libraryId: string) => {
    // const response = await fetch(`${API_BASE_URL}/library/delete`, {
    //   method: 'DELETE',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify({ libraryId }),
    // });
    // return response.json();
    const response = await api.delete('/library/delete', { data: { libraryId } })
    return response.data;
  },

  findByName: async (title: string) => {
    // const response = await fetch(`${API_BASE_URL}/library/findByName`, {
    //   method: 'POST',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify({ title }),
    // });
    // return response.json();
    const response = await api.post('/library/findByName', { title })
    return response.data;
  },
};

// AI API
export const aiApi = {
  generate: async (data: { imageUrls: string[]; prompt: string }) => {
    // const response = await fetch(`${API_BASE_URL}/ai/generate`, {
    //   method: 'POST',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify(data),
    // });
    // return response.json();
    const response = await api.post('/ai/generate', data)
    return response.data;
  },
};

export const dashboardApi = {
  getStats: async () => {
    // const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
    //   headers: getAuthHeaders(),
    // });
    // return response.json();
    const response = await api.get('/dashboard/stats')
    return response.data;
  }
}