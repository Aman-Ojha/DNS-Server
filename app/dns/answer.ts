import { DNSType } from "./question";
import { DNSClass } from "./question";

export interface IDNSAnswer {
  name: string;
  type: DNSType;
  classCode: DNSClass;
  ttl: number;
  length: number;
  rdata: string;
}

class DNSAnswer {
  static write(answers: IDNSAnswer[]) {
    return Buffer.concat(
      answers.map((answer) => {
        const { name, type, classCode, ttl, length, rdata } = answer;
        const buffer = Buffer.alloc(10);
        const str = name
          .split(".")
          .map((e) => `${String.fromCharCode(e.length)}${e}`)
          .join("");

        buffer.writeUInt16BE(type);
        buffer.writeUInt16BE(classCode, 2);
        buffer.writeUInt16BE(ttl, 4);
        buffer.writeUInt16BE(rdata.length, 8);

        return Buffer.concat([
          Buffer.from(str + "\0", "binary"),
          buffer,
          Buffer.from(rdata + "\0", "binary"),
        ]);
      }),
    );
  }
}

export default DNSAnswer;
