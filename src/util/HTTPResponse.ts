import { ErrorCode } from 'src/domain/business-code';

interface IHTTPResponse {
  code: ErrorCode;
  message: string;
  data: any;
}

export class HTTPResponse implements IHTTPResponse {
  code: ErrorCode;
  data: any;
  message: string;

  constructor(code, message, data) {
    this.data = data;
    this.code = code;
    this.message = message;
  }
}
