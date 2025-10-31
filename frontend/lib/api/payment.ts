import apiClient from './axios';

export interface CreateCheckoutSessionRequest {
  payment_type: 'single' | 'lifetime';
  resume_id?: number;
  success_url?: string;
  cancel_url?: string;
}

export interface CreateCheckoutSessionResponse {
  checkout_url: string;
  session_id: string;
}

export interface Payment {
  id: number;
  user: number;
  resume: number | null;
  stripe_checkout_session_id: string;
  amount: string;
  currency: string;
  payment_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  user: number;
  stripe_subscription_id: string;
  subscription_type: 'lifetime' | 'monthly' | 'yearly';
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  created_at: string;
}

export const paymentApi = {
  /**
   * Create a Stripe checkout session
   */
  createCheckoutSession: async (data: CreateCheckoutSessionRequest): Promise<CreateCheckoutSessionResponse> => {
    const response = await apiClient.post<CreateCheckoutSessionResponse>(
      '/api/payments/create-checkout/',
      data
    );
    return response.data;
  },

  /**
   * Get user's payment history
   */
  getPayments: async (): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>('/api/payments/payments/');
    return response.data;
  },

  /**
   * Get user's current subscription
   */
  getSubscription: async (): Promise<Subscription | null> => {
    try {
      const response = await apiClient.get<Subscription>('/api/payments/subscription/');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Cancel subscription (at period end)
   */
  cancelSubscription: async (): Promise<{ message: string; current_period_end: string }> => {
    const response = await apiClient.post<{ message: string; current_period_end: string }>(
      '/api/payments/subscription/cancel/'
    );
    return response.data;
  },
};
