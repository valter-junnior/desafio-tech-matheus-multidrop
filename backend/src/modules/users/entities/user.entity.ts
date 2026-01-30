import { UserRole } from '../domain/enums/user-role.enum';

/**
 * Entidade de domínio User
 * Encapsula as regras de negócio relacionadas a usuários
 * Não depende de frameworks ou infraestrutura
 */
export class UserEntity {
  private _id: number;
  private _name: string;
  private _email: string;
  private _role: UserRole;
  private _createdAt: Date;

  constructor(
    id: number,
    name: string,
    email: string,
    role: UserRole,
    createdAt: Date = new Date(),
  ) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._role = role;
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

  get email(): string {
    return this._email;
  }

  get role(): UserRole {
    return this._role;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  // Métodos de domínio
  isPartner(): boolean {
    return this._role === UserRole.PARTNER;
  }

  isCustomer(): boolean {
    return this._role === UserRole.CUSTOMER;
  }

  isAdmin(): boolean {
    return this._role === UserRole.ADMIN;
  }

  canCreateSale(): boolean {
    return this.isAdmin();
  }

  canReceiveCommission(): boolean {
    return this.isPartner();
  }

  // Validação
  private validate(): void {
    if (!this._name || this._name.trim().length < 3) {
      throw new Error('Nome deve ter pelo menos 3 caracteres');
    }

    if (!this._email || !this.isValidEmail(this._email)) {
      throw new Error('Email inválido');
    }

    if (!Object.values(UserRole).includes(this._role)) {
      throw new Error('Role inválida');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Factory method
  static create(
    name: string,
    email: string,
    role: UserRole,
    id?: number,
    createdAt?: Date,
  ): UserEntity {
    return new UserEntity(id || 0, name, email, role, createdAt);
  }

  // Para conversão em objeto simples
  toObject() {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      role: this._role,
      createdAt: this._createdAt,
    };
  }
}
