import requests, { responsePayload } from "./api";

export const Orders = {
  checkoutSession: async (
    cartItems: Record<string, any>
  ): Promise<responsePayload> => {
    const checkoutSessionRes = await requests.post("/orders/checkout", {
      checkoutDetails: cartItems,
    });
    return checkoutSessionRes;
  },

  getAllOrders: async (status?: string): Promise<responsePayload> => {
    const findOrderRes = await requests.get(
      status ? `/orders?status=${status}` : `/orders`
    );
    return findOrderRes;
  },

  getOrder: async (orderId: string): Promise<responsePayload> => {
    const getOrderRes = await requests.get(`/orders/${orderId}`);
    return getOrderRes;
  },
};
