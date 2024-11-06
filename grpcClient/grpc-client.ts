// grpc-client.ts
import { join } from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

// Define the path to your .proto file
const PROTO_PATH = join(__dirname, '../proto/payment.proto');

// Load the protobuf
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;
const paymentService = new protoDescriptor.payment.PaymentService(
  'localhost:5000',
  grpc.credentials.createInsecure(),
);

// Helper function to delay execution between calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 1. Create a New Payment (so we have a valid ID to retrieve)
paymentService.CreatePayment(
  { carPlate: 'XYZ-9876', amount: 15.5 },
  async (err: any, createResponse: any) => {
    if (err) {
      console.error('Error creating payment:', err.message);
      return;
    }

    console.log('CreatePayment Response:', createResponse);

    const { paymentId } = createResponse;

    // Delay before calling GetPayment and ListPayments to allow the creation process to complete
    await delay(500);

    // 2. Get Payment by Valid ID
    paymentService.GetPayment({ paymentId }, (err: any, getResponse: any) => {
      if (err) {
        console.error('Error retrieving payment:', err.message);
        return;
      }
      console.log('GetPayment Response:', getResponse);
    });

    // 3. List All Payments
    paymentService.ListPayments({}, (err: any, listResponse: any) => {
      if (err) {
        console.error('Error listing payments:', err.message);
        return;
      }
      console.log('ListPayments Response:', listResponse);
    });
  },
);
