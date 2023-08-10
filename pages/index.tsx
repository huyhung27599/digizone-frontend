import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";
import Router from "next/router";
import React from "react";
import { Button } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ProductItem from "../components/products/ProductItem";
import styles from "../styles/Home.module.css";

interface Props {
  products: Record<string, any>;
}
const Home: NextPage<Props> = ({ products }) => {
  return (
    <>
      <h3 className={styles.productCats}>Latest Products</h3>
      <Row xs={1} md={4} className="g-4">
        {products.latestProducts &&
          products.latestProducts.map(
            (product: any, index: React.Key | null | undefined) => (
              <ProductItem
                product={product}
                userType={"customer"}
                key={index}
              />
            )
          )}
      </Row>
      <hr />
      <h3 className={styles.productCats}>Top Rated Products</h3>
      <Row xs={1} md={4} className="g-4">
        {products.topSoldProducts &&
          products.topSoldProducts.map(
            (product: any, index: React.Key | null | undefined) => (
              <ProductItem
                product={product}
                userType={"customer"}
                key={index}
              />
            )
          )}
      </Row>
      <Row>
        <Col>
          <Button
            variant="primary"
            className={styles.viewMoreBtn}
            onClick={() => Router.push("/products")}
          >
            View More
          </Button>
        </Col>
      </Row>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
): Promise<any> => {
  try {
    const { data } = await axios.get(
      `${
        process.env.NODE_ENV !== "production"
          ? process.env.NEXT_PUBLIC_BASE_API_URL_LOCAL
          : process.env.NEXT_PUBLIC_BASE_API_URL
      }/products?dashboard=true`
    );
    return {
      props: {
        products: data?.result[0] || {},
      },
    };
  } catch (error) {
    console.log(error);
  }
};

export default Home;
