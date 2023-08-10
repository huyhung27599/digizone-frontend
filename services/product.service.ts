import requests, { responsePayload } from "./api";
import queryString from "query-string";

export const Products = {
  getProducts: async (
    filter: Record<string, any>,
    serverSide: boolean = false
  ) => {
    const url = queryString.stringifyUrl({
      url: serverSide ? "" : "/products",
      query: filter,
    });
    const getProductRes = await requests.get(url);
    return getProductRes;
  },

  // get product details
  getProduct: async (id: string): Promise<responsePayload> => {
    const getProductRes = await requests.get("/products/" + id);
    return getProductRes;
  },
  // save product details
  saveProduct: async (
    product: Record<string, any>
  ): Promise<responsePayload> => {
    const saveProductRes = await requests.post("/products", product);
    return saveProductRes;
  },
  // update product details
  updateProduct: async (
    id: string,
    product: Record<string, any>
  ): Promise<responsePayload> => {
    const updateProductRes = await requests.patch("/products/" + id, product);
    return updateProductRes;
  },

  // delete product details
  deleteProduct: async (id: string): Promise<responsePayload> => {
    const deleteProductRes = await requests.delete("/products/" + id);
    return deleteProductRes;
  },

  uploadProductImage: async (
    id: string,
    image: any
  ): Promise<responsePayload> => {
    const uploadProductImageRes = await requests.post(
      `/products/${id}/image`,
      image
    );
    return uploadProductImageRes;
  },

  addSku: async (
    productId: string,
    sku: Record<string, any>
  ): Promise<responsePayload> => {
    const addSkuRes = await requests.post(`/products/${productId}/skus`, sku);

    return addSkuRes;
  },

  updateSku: async (
    productId: string,
    skuId: string,
    sku: Record<string, any>
  ): Promise<responsePayload> => {
    const updateSkuRes = await requests.put(
      "/products/" + productId + "/skus/" + skuId,
      sku
    );
    return updateSkuRes;
  },

  // delete sku details for an product
  deleteSku: async (
    productId: string,
    skuId: string
  ): Promise<responsePayload> => {
    const deleteSkuRes = await requests.delete(
      "/products/" + productId + "/skus/" + skuId
    );
    return deleteSkuRes;
  },

  getLicenses: async (
    productId: string,
    skuId: string
  ): Promise<responsePayload> => {
    const getLicensesRes = await requests.get(
      `/products/${productId}/skus/${skuId}/licenses`
    );

    return getLicensesRes;
  },

  addLicense: async (
    productId: string,
    skuId: string,
    license: Record<string, any>
  ): Promise<responsePayload> => {
    const addLicenseRes = await requests.post(
      "/products/" + productId + "/skus/" + skuId + "/licenses",
      license
    );
    return addLicenseRes;
  },

  // update license for a product SKU
  updateLicense: async (
    productId: string,
    skuId: string,
    licenseId: string,
    license: Record<string, any>
  ): Promise<responsePayload> => {
    const updateLicenseRes = await requests.put(
      "/products/" + productId + "/skus/" + skuId + "/licenses/" + licenseId,
      license
    );
    return updateLicenseRes;
  },

  // delete license for a product SKU
  deleteLicense: async (licenseId: string): Promise<responsePayload> => {
    const deleteLicenseRes = await requests.delete(
      "/products/licenses/" + licenseId
    );
    return deleteLicenseRes;
  },

  addReview: async (
    productId: string,
    review: Record<string, any>
  ): Promise<responsePayload> => {
    const addReviewRes = await requests.post(
      `/products/${productId}/reviews`,
      review
    );
    return addReviewRes;
  },

  deleteReview: async (
    productId: string,
    reviewId: string
  ): Promise<responsePayload> => {
    const addLicenseRes = await requests.delete(
      "/products/" + productId + "/reviews/" + reviewId
    );
    return addLicenseRes;
  },
};
