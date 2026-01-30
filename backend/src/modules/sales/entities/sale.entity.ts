import { ProductEntity } from '../../../core/entities/product.entity';
import { UserEntity } from '../../../core/entities/user.entity';

export class SaleEntity {
  private _id: number;
  private _value: number;
  private _productId: number;
  private _customerId: number;
  private _partnerId: number;
  private _createdAt: Date;
  private _product?: ProductEntity;
  private _customer?: UserEntity;
  private _partner?: UserEntity;

  constructor(
    id: number,
    value: number,
    productId: number,
    customerId: number,
    partnerId: number,
    createdAt: Date = new Date(),
    product?: ProductEntity,
    customer?: UserEntity,
    partner?: UserEntity,
  ) {
    this._id = id;
    this._value = value;
    this._productId = productId;
    this._customerId = customerId;
    this._partnerId = partnerId;
    this._createdAt = createdAt;
    this._product = product;
    this._customer = customer;
    this._partner = partner;
    this.validate();
  }

  // Getters
  get id(): number {
    return this._id;
  }

  get value(): number {
    return this._value;
  }

  get productId(): number {
    return this._productId;
  }

  get customerId(): number {
    return this._customerId;
  }

  get partnerId(): number {
    return this._partnerId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get product(): ProductEntity | undefined {
    return this._product;
  }

  get customer(): UserEntity | undefined {
    return this._customer;
  }

  get partner(): UserEntity | undefined {
    return this._partner;
  }

  // Métodos de domínio
  calculateCommission(commissionRate: number = 0.1): number {
    if (commissionRate < 0 || commissionRate > 1) {
      throw new Error('Taxa de comissão deve estar entre 0 e 1');
    }
    return this._value * commissionRate;
  }

  isValidSale(): boolean {
    return (
      this._value > 0 &&
      this._productId > 0 &&
      this._customerId > 0 &&
      this._partnerId > 0
    );
  }

  // Validação com regras de negócio
  private validate(): void {
    if (this._value <= 0) {
      throw new Error('Valor da venda deve ser maior que zero');
    }

    if (this._productId <= 0) {
      throw new Error('ID do produto inválido');
    }

    if (this._customerId <= 0) {
      throw new Error('ID do cliente inválido');
    }

    if (this._partnerId <= 0) {
      throw new Error('ID do parceiro inválido');
    }

    // Validações adicionais quando as entidades relacionadas estão disponíveis
    if (this._customer && !this._customer.isCustomer()) {
      throw new Error('O usuário deve ser um cliente');
    }

    if (this._partner && !this._partner.isPartner()) {
      throw new Error('O usuário deve ser um parceiro');
    }

    if (this._product && !this._product.isAvailableForSale()) {
      throw new Error('Produto não está disponível para venda');
    }
  }

  // Factory method
  static create(
    value: number,
    productId: number,
    customerId: number,
    partnerId: number,
    id?: number,
    createdAt?: Date,
    product?: ProductEntity,
    customer?: UserEntity,
    partner?: UserEntity,
  ): SaleEntity {
    return new SaleEntity(
      id || 0,
      value,
      productId,
      customerId,
      partnerId,
      createdAt,
      product,
      customer,
      partner,
    );
  }

  // Para conversão em objeto simples
  toObject() {
    return {
      id: this._id,
      value: this._value,
      productId: this._productId,
      customerId: this._customerId,
      partnerId: this._partnerId,
      createdAt: this._createdAt,
      product: this._product?.toObject(),
      customer: this._customer?.toObject(),
      partner: this._partner?.toObject(),
    };
  }
}
