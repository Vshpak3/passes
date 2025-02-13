import {
  InvokeCommand,
  InvokeCommandInput,
  LambdaClient,
} from '@aws-sdk/client-lambda'
import { HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Signature } from 'ethers'

import { getAwsConfig } from '../../util/aws.util'
import { ChainEnum } from '../wallet/enum/chain.enum'
import {
  LambdaFunctionError,
  LambdaResponseStatusError,
} from './error/lambda.error'

const LAMBDA_CREATE_ADDRESS = 'blockchain-create-address'
const LAMBDA_GET_ADDRESS = 'blockchain-get-public-address'
const LAMBDA_SIGN_MESSAGE = 'blockchain-sign-message'

@Injectable()
export class LambdaService {
  private client: LambdaClient
  private prefix: string

  constructor(private readonly configService: ConfigService) {
    this.client = new LambdaClient(getAwsConfig(this.configService))
    this.prefix = `passes-${configService.get('infra.env')}`
  }

  async invoke(command: InvokeCommand): Promise<string> {
    const res = await this.client.send(command)

    if (res.StatusCode !== HttpStatus.OK) {
      throw new LambdaResponseStatusError('', res.StatusCode)
    }
    if (res.FunctionError) {
      throw new LambdaFunctionError(res.FunctionError)
    }

    return new TextDecoder().decode(res.Payload)
  }

  async getOrCreateBlockchainAddress(keyId: string, chain: ChainEnum) {
    try {
      return await this.blockchainSignGetPublicAddress(keyId, chain)
    } catch (err) {
      return await this.blockchainSignCreateAddress(keyId, chain)
    }
  }

  /**
   * creates a new custodial wallet on Solana given a unique keyId (i.e. user id)
   * throws an error if keyId is in use already
   *
   * @param keyId
   * @return public address
   */
  async blockchainSignCreateAddress(
    keyId: string,
    chain: ChainEnum,
  ): Promise<string> {
    const input: InvokeCommandInput = {
      FunctionName: `${this.prefix}-${LAMBDA_CREATE_ADDRESS}`,
      Payload: new TextEncoder().encode(
        `{"body":{"keyId":"${keyId}", "chain":"${chain}"}}`,
      ),
    }

    const command = new InvokeCommand(input)

    const res = JSON.parse(await this.invoke(command))

    return res['body']
  }

  /**
   * grabs public address of an existing keyId
   * throws an error if keyId is NOT in use
   *
   * @param keyId
   * @return public address
   */
  async blockchainSignGetPublicAddress(
    keyId: string,
    chain: ChainEnum,
  ): Promise<string> {
    const input: InvokeCommandInput = {
      FunctionName: `${this.prefix}-${LAMBDA_GET_ADDRESS}`,
      Payload: new TextEncoder().encode(
        `{"body":{"keyId":"${keyId}", "chain":"${chain}"}}`,
      ),
    }

    const command = new InvokeCommand(input)

    const res = JSON.parse(await this.invoke(command))

    return res['body']
  }

  /**
   * signs a message given a existing keyId (message is Uint8Array form of a Solana transaction)
   * throws an error if keyId is NOT in use
   *
   * @param keyId
   * @param message
   */
  async blockchainSignEthMessage(
    keyId: string,
    message: string,
  ): Promise<Signature> {
    const input: InvokeCommandInput = {
      FunctionName: `${this.prefix}-${LAMBDA_SIGN_MESSAGE}`,
      Payload: new TextEncoder().encode(
        `{"body":{"keyId":"${keyId}", "chain":"${ChainEnum.ETH}","message":"${message}"}}`,
      ),
    }

    const command = new InvokeCommand(input)

    const res = JSON.parse(await this.invoke(command))
    return JSON.parse(res['body'])
  }

  async blockchainSignSolMessage(
    keyId: string,
    message: Uint8Array,
  ): Promise<Uint8Array> {
    const messageStr = message.toString()
    const input: InvokeCommandInput = {
      FunctionName: `${this.prefix}-${LAMBDA_SIGN_MESSAGE}`,
      Payload: new TextEncoder().encode(
        `{"body":{"keyId":"${keyId}", "chain":"${ChainEnum.SOL}","message":"${messageStr}"}}`,
      ),
    }

    const command = new InvokeCommand(input)

    const res = JSON.parse(await this.invoke(command))
    return Uint8Array.from(JSON.parse('[' + res['body'] + ']'))
  }
}
