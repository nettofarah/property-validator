/// <reference types="validator" />

declare module 'property-validator' {
  //middleware
  export function assertMiddleware(
    err: Error,
    req: {},
    res: {},
    next: Function
  ): void

  //result of a validation/assertion
  export type ValidateResult = {
    valid: boolean
    errors: Array<{
      field: string
      message: string
    }>
    messages: string[]
  }

  //error type
  export class ValidationError extends Error {
    name: 'ValidationError'
    message: string
    messages: string[]
    stack: string
    errors: Array<{
      field: string
      message: string
    }>
  }

  //type of a validation function, typically a wrapper around Validator.js
  export type Validator = (subject: {}) => ValidatorResult

  //result of a validation function
  export type ValidatorResult = {
    field: string
    message: string
    result: boolean
  }

  //function to change the locals, keeps a fallback to en locals
  export function setLocals(locals: {}): void

  //request validators
  export function validate(
    subject: {},
    validations: Validator[]
  ): ValidateResult
  export function validateParams(
    request: { params: {} },
    validations: Validator[]
  ): ValidateResult
  export function validateQuery(
    request: { query: {} },
    validations: Validator[]
  ): ValidateResult
  export function validateBody(
    request: { body: {} },
    validations: Validator[]
  ): ValidateResult
  export function validateHeaders(
    request: { headers: {} },
    validations: Validator[]
  ): ValidateResult
  export function validateAll(
    request: { query?: {}; params?: {}; body?: {} },
    validations: Validator[]
  ): ValidateResult

  //request assertions
  export function assert(subject: {}, validations: Validator[]): ValidateResult
  export function assertHeaders(
    request: { headers: {} },
    validations: Validator[]
  ): ValidateResult
  export function assertParams(
    request: { params: {} },
    validations: Validator[]
  ): ValidateResult
  export function assertBody(
    request: { body: {} },
    validations: Validator[]
  ): ValidateResult
  export function assertQuery(
    request: { query: {} },
    validations: Validator[]
  ): ValidateResult
  export function assertAll(
    request: { query?: {}; params?: {}; body?: {} },
    validations: Validator[]
  ): ValidateResult

  //special assert which makes a prop optional
  export function optional(
    validation: Validator,
    customMessage?: string
  ): Validator

  //validation functions
  export function presence(paramName: string, customMessage?: string): Validator
  export function contains(
    paramName: string,
    str: string,
    customMessage?: string
  ): Validator
  export function isAlpha(paramName: string, customMessage?: string): Validator
  export function isAlphanumeric(
    paramName: string,
    customMessage?: string
  ): Validator
  export function isArray(paramName: string, customMessage?: string): Validator
  export function isCreditCard(
    paramName: string,
    customMessage?: string
  ): Validator
  export function isCurrency(
    paramName: string,
    options: IsCurrencyOptions,
    customMessage?: string
  ): Validator
  export function isDate(paramName: string, customMessage?: string): Validator
  export function isDecimal(
    paramName: string,
    customMessage?: string
  ): Validator
  export function isInt(
    paramName: string,
    options: IsIntOptions,
    customMessage?: string
  ): Validator
  export function isJSON(paramName: string, customMessage?: string): Validator
  export function isNull(paramName: string, customMessage?: string): Validator
  export function isNumeric(
    paramName: string,
    customMessage?: string
  ): Validator
  export function isURL(
    paramName: string,
    options: IsURLOptions,
    customMessage?: string
  ): Validator
  export function isPlainObject(
    paramName: string,
    customMessage?: string
  ): Validator

  //same named (pair) validation functions
  export function email(paramName: string, customMessage?: string): Validator
  export function isEmail(paramName: string, customMessage?: string): Validator
  export function equals(
    paramName: string,
    comparison: string,
    customMessage?: string
  ): Validator
  export function isEqual(
    paramName: string,
    comparison: string,
    customMessage?: string
  ): Validator
  export function matches(
    paramName: string,
    pattern: RegExp | string,
    customMessage?: string
  ): Validator
  export function format(
    paramName: string,
    pattern: RegExp | string,
    customMessage?: string
  ): Validator
  export function uuid(
    paramName: string,
    version?: string,
    customMessage?: string
  ): Validator
  export function isUUID(
    paramName: string,
    version?: string,
    customMessage?: string
  ): Validator
  export function isIn(
    paramName: string,
    values: any[],
    customMessage?: string
  ): Validator
  export function oneOf(
    paramName: string,
    values: any[],
    customMessage?: string
  ): Validator
  export function isLength(
    paramName: string,
    options: IsLengthOptions,
    customMessage?: string
  ): Validator
  export function length(
    paramName: string,
    options: IsLengthOptions,
    customMessage?: string
  ): Validator

  //export ValidatorJS options interfaces
  export interface IsByteLengthOptions
    extends ValidatorJS.IsByteLengthOptions {}
  export interface IsCurrencyOptions extends ValidatorJS.IsCurrencyOptions {}
  export interface IsEmailOptions extends ValidatorJS.IsEmailOptions {}
  export interface IsFQDNOptions extends ValidatorJS.IsFQDNOptions {}
  export interface IsFloatOptions extends ValidatorJS.IsFloatOptions {}
  export interface IsIntOptions extends ValidatorJS.IsIntOptions {}
  export interface IsLengthOptions extends ValidatorJS.IsLengthOptions {}
  export interface IsURLOptions extends ValidatorJS.IsURLOptions {}
  export interface NormalizeEmailOptions
    extends ValidatorJS.NormalizeEmailOptions {}
}
