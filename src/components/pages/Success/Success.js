import React from 'react';
import { useLocation, Redirect } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Success = () => {
  const query = useQuery();
  const id = query.get('id');
  const amount = query.get('amount');
  const location = useLocation();

  // If the customer reached this page without being redirected from checkout, then we redirect him to home
  const { from } = location.state || '';

  return (
    <>
      {id && amount && from === 'checkout' ? (
        <div className="container">
          <h1>Success!</h1>
          <h3>Your payment is confirmed!</h3>
          <div>
            <strong>Payment id:</strong> {id}
          </div>
          <div>
            <strong>Charged:</strong> ${amount / 100}
          </div>
        </div>
      ) : (
        <Redirect
          to={{
            pathname: '/'
          }}
        />
      )}
    </>
  );
};

export default Success;
