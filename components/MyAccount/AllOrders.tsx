import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Dropdown,
  DropdownButton,
  Row,
  Table,
} from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import { Orders } from "../../services/order.service";

const AllOrders = () => {
  const { addToast } = useToasts();
  const [orders, setOrders] = useState([]);

  const fetchItems = async (status?: string) => {
    try {
      const response = await Orders.getAllOrders(status);
      if (!response.success) {
        throw new Error(response.message);
      }
      setOrders(response.result);
    } catch (error: any) {
      if (error.response) {
        if (Array.isArray(error.response?.data?.message)) {
          return error.response.data.message.forEach((message: any) => {
            addToast(message, { appearance: "error", autoDismiss: true });
          });
        } else {
          return addToast(error.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
        }
      }
      addToast(error.message, { appearance: "error", autoDismiss: true });
    }
  };

  const dateTOLocal = (data: any) => {
    return new Date(data).toLocaleString();
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <>
      <Row>
        <DropdownButton
          title="Filter by status"
          onSelect={(e) => {
            fetchItems(e ? e : "");
          }}
        >
          <Dropdown.Item href="#" eventKey="">
            All
          </Dropdown.Item>
          <Dropdown.Item href="#" eventKey="pending">
            Pending
          </Dropdown.Item>
          <Dropdown.Item href="#" eventKey="completed">
            Complete
          </Dropdown.Item>
        </DropdownButton>
      </Row>
      <Table responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Order Status</th>
            <th>Order Total</th>
            <th>Order Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order: any) => (
              <tr key={order._id}>
                <Link href={`/orders/${order._id}`}>
                  <td style={{ color: "green", cursor: "pointer" }}>
                    {order.orderId}
                  </td>
                </Link>
                <td>{dateTOLocal(order.orderDate)}</td>
                <td>
                  <Badge>{order.orderStatus.toUpperCase()}</Badge>
                </td>
                <td>₹{order.paymnetInfo.paymentAmount} </td>
                <td>
                  <Link href={`/orders/${order._id}`}>
                    <Button variant="outline-dark">View Order Details</Button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No orders found</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
};
export default AllOrders;
