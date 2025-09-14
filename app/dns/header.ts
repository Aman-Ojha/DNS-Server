export enum OpCode {
  STANDARD_QUERY = 0,
}

export enum ResponseCode {
  NO_ERROR = 0,
  FORMAT_ERROR = 1,
}
interface TDNSHeader {
  id: number;
  qr: number;
  opcode: OpCode;
  aa: number;
  tc: number;
  rd: number;
  ra: number;
  z: number;
  rcode: ResponseCode;
  qdcount: number;
  ancount: number;
  nscount: number;
  arcount: number;
}

class DNSHeader {
  static write(values: TDNSHeader) {
    const header = Buffer.alloc(12);

    const flags =
      (values.qr << 15) | // QR (bit 15)
      (values.opcode << 11) | // OPCODE (bits 11-14)
      (values.aa << 10) | // AA (bit 10)
      (values.tc << 9) | // TC (bit 9)
      (values.rd << 8) | // RD (bit 8)
      (values.ra << 7) | // RA (bit 7)
      (values.z << 4) | // Z (bits 4-6)
      values.rcode; // RCODE (bits 0-3)

    header.writeUInt16BE(values.id, 0);
    header.writeUInt16BE(flags, 2);
    header.writeUInt16BE(values.qdcount, 4);

    header.writeUInt16BE(values.ancount, 6);
    header.writeUInt16BE(values.nscount, 8);
    header.writeUInt16BE(values.arcount, 10);

    return header;
  }
}

export default DNSHeader;
