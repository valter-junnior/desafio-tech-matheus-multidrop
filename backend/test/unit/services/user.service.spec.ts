import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/application/services/user.service';
import { IUserRepository, USER_REPOSITORY } from '../../../src/core/repositories/user.repository';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../../src/core/entities/user.entity';
import { UserRole } from '../../../src/core/enums/user-role.enum';

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<IUserRepository>;

  const mockUserRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(USER_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createUserDto = {
      name: 'Test User',
      email: 'test@test.com',
      role: UserRole.CUSTOMER,
    };

    it('should create a user successfully', async () => {
      const mockUser = new UserEntity(
        1,
        createUserDto.name,
        createUserDto.email,
        createUserDto.role,
        new Date(),
        new Date(),
      );

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw ConflictException when email already exists', async () => {
      const existingUser = new UserEntity(
        1,
        'Existing User',
        createUserDto.email,
        UserRole.CUSTOMER,
        new Date(),
        new Date(),
      );

      userRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const mockUsers = [
        new UserEntity(1, 'User 1', 'user1@test.com', UserRole.CUSTOMER, new Date(), new Date()),
        new UserEntity(2, 'User 2', 'user2@test.com', UserRole.PARTNER, new Date(), new Date()),
      ];

      userRepository.findAll.mockResolvedValue(mockUsers);
      userRepository.count.mockResolvedValue(2);

      const result = await service.findAll(1, 10);

      expect(result.data).toEqual(mockUsers);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(userRepository.findAll).toHaveBeenCalledWith(0, 10);
    });

    it('should calculate correct pagination', async () => {
      userRepository.findAll.mockResolvedValue([]);
      userRepository.count.mockResolvedValue(25);

      const result = await service.findAll(3, 10);

      expect(result.totalPages).toBe(3);
      expect(result.page).toBe(3);
      expect(userRepository.findAll).toHaveBeenCalledWith(20, 10);
    });
  });

  describe('findById', () => {
    it('should return a user when found', async () => {
      const mockUser = new UserEntity(
        1,
        'User 1',
        'user1@test.com',
        UserRole.CUSTOMER,
        new Date(),
        new Date(),
      );

      userRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findById(1);

      expect(result).toEqual(mockUser);
      expect(userRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
      expect(userRepository.findById).toHaveBeenCalledWith(999);
    });
  });
});
