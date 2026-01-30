import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserRole } from 'generated/prisma/client';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  const mockUserRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        role: UserRole.CUSTOMER,
      };

      const createdUser = {
        id: 1,
        ...createUserDto,
        createdAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await service.create(createUserDto);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto = {
        name: 'Test User',
        email: 'existing@example.com',
        role: UserRole.CUSTOMER,
      };

      const existingUser = {
        id: 1,
        ...createUserDto,
        createdAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      const userId = 1;
      const mockUser = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        role: UserRole.CUSTOMER,
        createdAt: new Date(),
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findById(userId);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 999;

      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.findById(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'User 1',
          email: 'user1@example.com',
          role: UserRole.CUSTOMER,
          createdAt: new Date(),
        },
        {
          id: 2,
          name: 'User 2',
          email: 'user2@example.com',
          role: UserRole.PARTNER,
          createdAt: new Date(),
        },
      ];

      mockUserRepository.findAll.mockResolvedValue(mockUsers);
      mockUserRepository.count.mockResolvedValue(2);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        data: mockUsers,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });
});
