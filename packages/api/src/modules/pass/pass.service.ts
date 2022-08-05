import { EntityRepository, wrap } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PublicKey } from '@solana/web3.js'

import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { CollectionEntity } from '../collection/entities/collection.entity'
import { SolNftEntity } from '../sol/entities/sol-nft.entity'
import { SolNftCollectionEntity } from '../sol/entities/sol-nft-collection.entity'
import { SolService } from '../sol/sol.service'
import { UserEntity } from '../user/entities/user.entity'
import { WalletService } from '../wallet/wallet.service'
import {
  PASS_NOT_EXIST,
  PASS_NOT_OWNED_BY_USER,
  USER_ALREADY_OWNS_PASS,
} from './constants/errors'
import { CreatePassDto } from './dto/create-pass.dto'
import { GetPassDto } from './dto/get-pass.dto'
import { GetPassOwnershipDto } from './dto/get-pass-ownership.dto'
import { UpdatePassDto } from './dto/update-pass.dto'
import { PassEntity } from './entities/pass.entity'
import { PassOwnershipEntity } from './entities/pass-ownership.entity'

@Injectable()
export class PassService {
  constructor(
    @InjectRepository(CollectionEntity)
    private readonly collectionRepository: EntityRepository<CollectionEntity>,
    @InjectRepository(PassEntity)
    private readonly passRepository: EntityRepository<PassEntity>,
    @InjectRepository(PassOwnershipEntity)
    private readonly passOwnershipRepository: EntityRepository<PassOwnershipEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
    @InjectRepository(SolNftCollectionEntity)
    private readonly solNftCollectionRepository: EntityRepository<SolNftCollectionEntity>,
    @InjectRepository(SolNftEntity)
    private readonly solNftRepository: EntityRepository<SolNftEntity>,
    private readonly solService: SolService,
    private readonly walletService: WalletService,
  ) {}

  async create(
    userId: string,
    createPassDto: CreatePassDto,
  ): Promise<GetPassDto> {
    const user = await this.userRepository.findOneOrFail(userId)
    const solNftCollectionDto = await this.solService.createNftCollection(
      user,
      createPassDto.title,
      user.userName.replace(/[^a-zA-Z]/g, '').substring(0, 10),
      createPassDto.description,
      createPassDto.imageUrl,
    )
    const solNftCollection = await this.solNftCollectionRepository.getReference(
      solNftCollectionDto.id,
    )
    const pass = this.passRepository.create({
      owner: user,
      solNftCollection: solNftCollection,
      title: createPassDto.title,
      description: createPassDto.description,
      imageUrl: createPassDto.imageUrl,
      type: createPassDto.type,
      price: createPassDto.price,
      totalSupply: createPassDto.totalSupply,
    })

    await this.passRepository.persistAndFlush(pass)
    return new GetPassDto(pass)
  }

  async findOne(id: string): Promise<GetPassDto> {
    const pass = await this.passRepository.findOne(id, {
      populate: ['owner', 'solNftCollection'],
    })
    if (!pass) {
      throw new NotFoundException(PASS_NOT_EXIST)
    }

    return new GetPassDto(pass)
  }

  async update(userId: string, passId: string, updatePassDto: UpdatePassDto) {
    const currentPass = await this.passRepository.findOne(passId)

    if (!currentPass) {
      throw new NotFoundException(PASS_NOT_EXIST)
    }

    if (currentPass.owner.id !== userId) {
      throw new ForbiddenException(PASS_NOT_OWNED_BY_USER)
    }

    const newPost = wrap(currentPass).assign({
      ...updatePassDto,
    })

    await this.passRepository.persistAndFlush(newPost)
    return new GetPassDto(newPost)
  }

  async addHolder(userId: string, passId: string, temporary?: boolean) {
    const user = await this.userRepository.getReference(userId)
    const pass = await this.passRepository.findOneOrFail(passId, {
      populate: ['owner', 'solNftCollection'],
    })

    const expiresAt = temporary
      ? new Date(new Date().getDate() + 30).valueOf()
      : undefined

    const userCustodialWallet = await this.walletService.getUserCustodialWallet(
      userId,
    )

    const solNftDto = await this.solService.createNftPass(
      user.id,
      new PublicKey(userCustodialWallet.address),
      pass.solNftCollection.id,
    )

    const solNft = await this.solNftRepository.getReference(solNftDto.id)
    const passOwnership = this.passOwnershipRepository.create({
      pass: pass,
      holder: user,
      expiresAt: expiresAt,
      solNft: solNft,
    })

    await createOrThrowOnDuplicate(
      this.passOwnershipRepository,
      passOwnership,
      USER_ALREADY_OWNS_PASS,
    )

    return new GetPassOwnershipDto(pass.id, user.id, expiresAt)
  }

  async doesUserHoldPass(userId: string, passId: string) {
    const ownership = await this.passOwnershipRepository.findOne({
      holder: userId,
      pass: passId,
    })
    return !!ownership
  }
}
