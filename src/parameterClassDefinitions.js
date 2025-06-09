export class Instruction {
}
export class ThreeParameterInstruction extends Instruction {
    constructor(InstType, Rd, Rn, rawOperand2) {
        super();
        let placeholder;
        this.Instructions = ['ADD', 'SUB', 'AND', 'ORR', 'EOR', 'LSL', 'LSR'];
        if (!this.Instructions.includes(InstType))
            throw new Error(`Instruction type ${InstType} does not exist`);
        this.InstType = InstType;
        if (Rd.charAt(0) != 'R')
            throw new Error("Register should be used for the first parameter of this instrution");
        placeholder = Rd.substring(1, Rd.length);
        for (let i = 0; i < (placeholder).length; i++) {
            if (!(ThreeParameterInstruction.numbers.includes(placeholder.charAt(i))))
                throw new Error("Rd value of instruction is not valid");
        }
        this.Rd = Number(placeholder);
        if (Rn.charAt(0) != 'R')
            throw new Error("Register should be used for the second parameter of this instrution");
        placeholder = Rn.substring(1, Rn.length);
        for (let i = 0; i < (placeholder).length; i++) {
            if (!ThreeParameterInstruction.numbers.includes(placeholder.charAt(i)))
                throw new Error("Rn value of instruction is not valid");
        }
        this.Rn = Number(placeholder);
        let temp = this.setAddressingType(rawOperand2);
        this.addressingType = temp[0];
        this.unfetchedOperand2 = temp[1];
    }
    getInstType() {
        return this.InstType;
    }
    getRd() {
        return this.Rd;
    }
    getRn() {
        return this.Rn;
    }
    getAddressingType() {
        return this.addressingType;
    }
    getUnfetchedOperand2() {
        return this.unfetchedOperand2;
    }
    setAddressingType(rawOperand2) {
        let addressingType;
        let unfetchedOperand2;
        if (rawOperand2.charAt(0) == 'R') {
            addressingType = "DR";
            unfetchedOperand2 = rawOperand2.substring(1);
        }
        else if (rawOperand2.charAt(0) == '#') {
            addressingType = "IM";
            unfetchedOperand2 = rawOperand2.substring(1);
        }
        else {
            addressingType = "DM";
            unfetchedOperand2 = rawOperand2;
        }
        for (let i = 0; i < unfetchedOperand2.length; i++) {
            if (!ThreeParameterInstruction.numbers.includes(unfetchedOperand2.charAt(i)))
                throw new Error("Operand2 value of instruction is not valid");
        }
        return [addressingType, Number(unfetchedOperand2)];
    }
}
ThreeParameterInstruction.numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
export class TwoParameterInstruction extends Instruction {
    constructor(InstType, Rd, rawOperand2) {
        super();
        let placeholder;
        this.Instructions = ['MOV', 'MVN', 'LDR', 'STR', 'CMP'];
        if (!this.Instructions.includes(InstType))
            throw new Error(`Instruction type ${InstType} does not exist`);
        this.InstType = InstType;
        if (Rd.charAt(0) != 'R')
            throw new Error("Register should be used for the first parameter of this instrution");
        placeholder = Rd.substring(1, Rd.length);
        for (let i = 0; i < (placeholder).length; i++) {
            if (!(ThreeParameterInstruction.numbers.includes(placeholder.charAt(i))))
                throw new Error("Rd value of instruction is not valid");
        }
        this.Rd = Number(placeholder);
        let temp = this.setAddressingType(rawOperand2);
        this.addressingType = temp[0];
        this.unfetchedOperand2 = temp[1];
    }
    getInstType() {
        return this.InstType;
    }
    getRd() {
        return this.Rd;
    }
    getAddressingType() {
        return this.addressingType;
    }
    getUnfetchedOperand2() {
        return this.unfetchedOperand2;
    }
    setAddressingType(rawOperand2) {
        let addressingType;
        let unfetchedOperand2;
        if (rawOperand2.charAt(0) == 'R') {
            addressingType = "DR";
            unfetchedOperand2 = rawOperand2.substring(1);
        }
        else if (rawOperand2.charAt(0) == '#') {
            addressingType = "IM";
            unfetchedOperand2 = rawOperand2.substring(1);
        }
        else {
            addressingType = "DM";
            unfetchedOperand2 = rawOperand2;
        }
        for (let i = 0; i < unfetchedOperand2.length; i++) {
            if (!ThreeParameterInstruction.numbers.includes(unfetchedOperand2.charAt(i)))
                throw new Error("Operand2 value of instruction is not valid");
        }
        return [addressingType, Number(unfetchedOperand2)];
    }
}
TwoParameterInstruction.numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
export class BranchInst extends Instruction {
    constructor(part1, part2) {
        super();
        this.conditions = ['EQ', 'NE', 'LT', 'GT'];
        this.condition = part1.substring(1);
        if ((!this.conditions.includes(this.condition))) {
            if (this.condition.length == 0) {
                // uncodintional
                this.condition = "UC";
            }
            else {
                throw new Error(`Condition ${this.condition} does not exist`);
            }
        }
        this.label = part2;
    }
    getCondition() {
        return this.condition;
    }
    getLabel() {
        return this.label;
    }
}
export class WhiteSpace extends Instruction {
    constructor() {
        super();
    }
}
export class Label extends Instruction {
    constructor(line) {
        super();
        if (line.charAt(line.length - 1) != ":")
            throw new Error("Instruction not identified, did you use a colon at the end of your label?");
        this.label = line.substring(0, line.length - 1);
    }
    getLabel() {
        return this.label;
    }
}
export class HALT extends Instruction {
    constructor() {
        super();
    }
}
