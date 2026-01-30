export class ProductEntity {
  private _id: number;
  private _name: string;
  private _price: number;
  private _active: boolean;
  private _createdAt: Date;

  constructor(
    id: number,
    name: string,
    price: number,
    active: boolean = true,
    createdAt: Date = new Date(),
  ) {
    this._id = id;
    this._name = name;
    this._price = price;
    this._active = active;
    this._createdAt = createdAt;
    this.validate();
  }

  // Getters
  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  get active(): boolean {
    return this._active;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  // Métodos de domínio
  activate(): void {
    this._active = true;
  }

  deactivate(): void {
    this._active = false;
  }

  isAvailableForSale(): boolean {
    return this._active && this._price > 0;
  }

  calculateCommission(commissionRate: number): number {
    if (commissionRate < 0 || commissionRate > 1) {
      throw new Error('Taxa de comissão deve estar entre 0 e 1');
    }
    return this._price * commissionRate;
  }

  updatePrice(newPrice: number): void {
    if (newPrice < 0) {
      throw new Error('Preço não pode ser negativo');
    }
    this._price = newPrice;
  }

  // Validação
  private validate(): void {
    if (!this._name || this._name.trim().length < 3) {
      throw new Error('Nome do produto deve ter pelo menos 3 caracteres');
    }

    if (this._price < 0) {
      throw new Error('Preço não pode ser negativo');
    }
  }

  // Factory method
  static create(
    name: string,
    price: number,
    active?: boolean,
    id?: number,
    createdAt?: Date,
  ): ProductEntity {
    return new ProductEntity(id || 0, name, price, active, createdAt);
  }

  // Para conversão em objeto simples
  toObject() {
    return {
      id: this._id,
      name: this._name,
      price: this._price,
      active: this._active,
      createdAt: this._createdAt,
    };
  }
}
