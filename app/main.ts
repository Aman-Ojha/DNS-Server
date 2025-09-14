import * as dgram from "dgram";
import DNSHeader, { OpCode, ResponseCode } from "./dns/header";
import DNSQuestion, { DNSClass, DNSType } from "./dns/question";
import IDNSQuestion from "./dns/question";
import TDNSHeader from "./dns/header";
import type { IDNSAnswer } from "./dns/answer";
import DNSAnswer from "./dns/answer";

const defaultHeader: TDNSHeader = {
  id: 1234,
  qr: 1,
  opcode: OpCode.STANDARD_QUERY,
  aa: 0,
  tc: 0,
  rd: 0,
  ra: 0,
  z: 0,
  rcode: ResponseCode.NO_ERROR,
  qdcount: 0,
  ancount: 0,
  nscount: 0,
  arcount: 0,
};

const defaultQuestion: IDNSQuestion = {
  name: "codecrafters.io",
  type: DNSType.A,
  classCode: DNSClass.IN,
};

const defaultAnswer: IDNSAnswer = {
  name: "codecrafter.io",
  type: DNSType.A,
  classCode: DNSClass.IN,
  ttl: 60,
  rdata: "\x08\x08\x08\x08",
};
// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
//
const udpSocket: dgram.Socket = dgram.createSocket("udp4");
udpSocket.bind(2053, "127.0.0.1");

udpSocket.on("message", (data: Buffer, remoteAddr: dgram.RemoteInfo) => {
  try {
    console.log(`Received data from ${remoteAddr.address}:${remoteAddr.port}`);
    const header = DNSHeader.write({ ...defaultHeader, qdcount: 1 });
    const question = DNSQuestion.write([defaultQuestion]);
    const answer = DNSAnswer.write([defaultAnswer]);
    const response = Buffer.concat([header, question, answer]);
    udpSocket.send(response, remoteAddr.port, remoteAddr.address);
  } catch (e) {
    console.log(`Error sending data: ${e}`);
  }
});
