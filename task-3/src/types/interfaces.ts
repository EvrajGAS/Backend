import { AccountType, ServiceType, TransactionType } from "./enums";

export interface CreateCustomer {
    name: string;
    email: string;
    phone: string;
}

export interface CreateKYC {
    aadharNumber: string;
    panNumber: string;
    address: string;
}

export interface CreateAccount {
    customerId: number;
    accountNumber: string;
    type: AccountType;
}

export interface CreateTransaction {
    accountId: number;
    type: TransactionType;
    amount: number;
}

export interface CreateLoan {
    customerId: number;
    amount: number;
    interestRate: Number;
}

export interface CreateService {
    name: ServiceType;
}


