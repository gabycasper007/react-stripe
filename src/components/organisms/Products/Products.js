import React, { useEffect, useState } from 'react';
import Product from '../../molecules/Product/Product';
import styles from './Products.module.scss';
import Axios from '../../../axios';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const { data } = await Axios.get('products');
      setProducts(data.products);
    };

    getData();
  }, []);

  return (
    <>
      <h1 className={styles.title}>Products</h1>

      <div className={styles.products}>
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </>
  );
};

export default Products;
