import { Provider, TransactionRequest } from '@ethersproject/abstract-provider'
import { keccak256 } from '@ethersproject/keccak256'
import { serialize, UnsignedTransaction } from '@ethersproject/transactions'
import { InternalServerErrorException } from '@nestjs/common'
import { Signer } from 'ethers'
import {
  Bytes,
  Deferrable,
  defineReadOnly,
  getAddress,
  hashMessage,
  joinSignature,
  resolveProperties,
} from 'ethers/lib/utils'

import { LambdaService } from '../lambda/lambda.service'
import { ChainEnum } from '../wallet/enum/chain.enum'

export class InternalSigner extends Signer {
  readonly lambdaService: LambdaService
  readonly key: string
  private address?: string
  async signMessage(message: string | Bytes): Promise<string> {
    await this.getAddress()
    // if (typeof message === 'string') {
    //   message = new TextEncoder().encode(message)
    // // }
    // const c = ethers.utils.arrayify(message)
    return joinSignature(
      await this.lambdaService.blockchainSignEthMessage(
        this.key,
        hashMessage(message),
      ),
    )
  }

  async signTransaction(
    transaction: Deferrable<TransactionRequest>,
  ): Promise<string> {
    await this.getAddress()
    return await resolveProperties(transaction).then(async (tx) => {
      if (tx.from != null) {
        if (getAddress(tx.from) !== this.address) {
          throw new InternalServerErrorException(
            'transaction from address mismatch',
          )
        }
        delete tx.from
      }

      const signature = await this.lambdaService.blockchainSignEthMessage(
        this.key,
        keccak256(serialize(<UnsignedTransaction>tx)),
      )
      return serialize(<UnsignedTransaction>tx, signature)
    })
  }
  connect(provider: Provider): Signer {
    return new InternalSigner(this.key, this.lambdaService, provider)
  }
  constructor(key: string, lambdaService: LambdaService, provider: Provider) {
    super()
    defineReadOnly(this, 'key', key)
    defineReadOnly(this, 'lambdaService', lambdaService)
    defineReadOnly(this, 'provider', provider)
  }

  async getAddress() {
    if (!this.address) {
      this.address = await this.lambdaService.getOrCreateBlockchainAddress(
        this.key,
        ChainEnum.ETH,
      )
    }
    return this.address
  }
}
