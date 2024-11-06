import grpc from 'k6/net/grpc';
import { check, sleep } from 'k6';

// Initialize gRPC client
const client = new grpc.Client();
client.load(['proto'], 'payment.proto'); // Adjust the path as needed

export const options = {
  vus: 10,            // 10 virtual users to simulate load
  duration: '30s',    // Test duration
};

export default function () {
  client.connect('grpc-server:5000', { plaintext: true });

  // 1. Test CreatePayment
  const createResponse = client.invoke('payment.PaymentService/CreatePayment', {
    carPlate: `TEST-${Math.floor(Math.random() * 1000)}`, // unique car plate for each test
    amount: Math.random() * 100, // random amount
  });
  check(createResponse, {
    'CreatePayment status is OK': (r) => r && r.status === grpc.StatusOK,
  });

  // Extract the paymentId from the CreatePayment response
  const paymentId = createResponse.message.paymentId;

  // 2. Test GetPayment with valid ID
  const getResponse = client.invoke('payment.PaymentService/GetPayment', { paymentId });
  check(getResponse, {
    'GetPayment status is OK': (r) => r && r.status === grpc.StatusOK,
    'GetPayment returns correct ID': (r) => r && r.message.paymentId === paymentId,
  });

  // 3. Test ListPayments
  const listResponse = client.invoke('payment.PaymentService/ListPayments', {});
  check(listResponse, {
    'ListPayments status is OK': (r) => r && r.status === grpc.StatusOK,
    'ListPayments returns array': (r) => r && Array.isArray(r.message.payments),
  });

  client.close();
  sleep(1); // Pause between requests to simulate real user delay
}
