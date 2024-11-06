import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface Payment {
  paymentId: string;
  carPlate: string;
  amount: number;
  status: string;
}

@Injectable()
export class PaymentService {
  private payments: Payment[] = [];

  createPayment(carPlate: string, amount: number): Payment {
    const payment: Payment = {
      paymentId: uuidv4(),
      carPlate,
      amount,
      status: 'Completed',
    };
    this.payments.push(payment);
    return payment;
  }

  getPayment(paymentId: string): Payment | undefined {
    return this.payments.find(payment => payment.paymentId === paymentId);
  }

  listPayments(): Payment[] {
    return this.payments;
  }
}
