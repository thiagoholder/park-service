// src/payment/payment.controller.ts
import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @GrpcMethod('PaymentService', 'CreatePayment')
  createPayment(data: { carPlate: string; amount: number }) {
    const payment = this.paymentService.createPayment(data.carPlate, data.amount);
    return {
      paymentId: payment.paymentId,
      status: payment.status,
      message: 'Payment created successfully',
    };
  }

  @GrpcMethod('PaymentService', 'GetPayment')
  getPayment(data: { paymentId: string }) {
    const payment = this.paymentService.getPayment(data.paymentId);
    
    if (!payment) {
      return {
        paymentId: '',
        carPlate: '',
        amount: 0,
        status: 'Not Found',
      };
    }
    
    return {
      paymentId: payment.paymentId,
      carPlate: payment.carPlate,
      amount: payment.amount,
      status: payment.status,
    };
  }

  @GrpcMethod('PaymentService', 'ListPayments')
  listPayments() {
    const payments = this.paymentService.listPayments();

    return {
      payments: payments.map(payment => ({
        paymentId: payment.paymentId,
        carPlate: payment.carPlate,
        amount: payment.amount,
        status: payment.status,
      })),
    };
  }
}
