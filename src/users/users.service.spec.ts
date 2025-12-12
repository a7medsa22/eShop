import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import e from 'express';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    create: jest.fn().mockImplementation((dot)=>dot),
    save: jest.fn().mockImplementation((user)=> Promise.resolve({ id:1, ...user})),
    findOne: jest.fn().mockImplementation(({where:{id}})=> Promise.resolve({id,name:"Test User",nameProfileImage:null})),
    find: jest.fn().mockImplementation(()=> Promise.resolve([{id:1,name:"Test User 1"},{id:2,name:"Test User 2"}])),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService, {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],

    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be return user by id', async () => {
   expect(await service.getCurrentUser(1)).toEqual({
   id:expect.any(Number),
    name:"Test User",nameProfileImage:null
  }); 
  expect(mockUserRepository.findOne).toHaveBeenCalled();
  expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
  expect(mockUserRepository.findOne).toHaveBeenCalledWith({where:{id:1}});
});

});
