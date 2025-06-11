import { ADD, AND, BEQ, BGT, BLT, BNE, BUC, CMP, EOR, LDR, LSL, LSR, MOV, MVN, ORR, STR, SUB } from "./instructionExecutes.js";
import { BranchInst, HALT, Label, ThreeParameterInstruction, TwoParameterInstruction } from "./parameterClassDefinitions.js";
export class ARMEmulator {
    registers;
    memory;
    PC;
    SR;
    instList;
    cap;
    stateHistory;
    labelMap;
    ThreeParameterInstructionMap;
    TwoParameterInstructionMap;
    BranchesInstructionMap;
    Assembled;
    constructor(instList) {
        this.stateHistory = new Stack();
        this.instList = instList;
        this.cap = 24;
        this.registers = Array(this.cap).fill(0);
        this.memory = Array(this.cap).fill(0);
        this.PC = 0;
        this.SR = '';
        this.labelMap = this.initalPassMap();
        this.ThreeParameterInstructionMap = {
            'ADD': ADD,
            'SUB': SUB,
            'AND': AND,
            'ORR': ORR,
            'EOR': EOR,
            'LSL': LSL,
            'LSR': LSR,
        };
        this.TwoParameterInstructionMap = {
            'MOV': MOV,
            'MVN': MVN,
            'LDR': LDR,
            'STR': STR,
            'CMP': CMP,
        };
        this.BranchesInstructionMap = {
            'EQ': BEQ,
            'GT': BGT,
            'LT': BLT,
            'NE': BNE,
            'UC': BUC,
        };
        this.Assembled = instList.length == 0 ? false : true;
    }
    initalPassMap() {
        let result = {};
        for (let i = 0; i < this.instList.length; i++) {
            if (this.instList[i] instanceof Label) {
                let temp = this.instList[i];
                result[temp.getLabel()] = i;
            }
        }
        return result;
    }
    assembled() { return this.Assembled; }
    Step() {
        this.stateHistory.Push(this.getState());
        if (this.instList[this.PC] instanceof ThreeParameterInstruction) {
            let currentInst = this.instList[this.PC];
            currentInst.initialiseOperand2(this);
            currentInst.initialiseRn(this);
            let currentExecute = new this.ThreeParameterInstructionMap[currentInst.getInstType()]();
            currentExecute.Execute(this, currentInst);
            let Rd = currentInst.getRd();
            let elementToChange = document.getElementById('R' + Rd);
            elementToChange.textContent = "R" + Rd + (String(Rd).length == 1 ? ":  " : ": ") + this.registers[Rd];
        }
        else if (this.instList[this.PC] instanceof TwoParameterInstruction) {
            let currentInst = this.instList[this.PC];
            currentInst.initialiseOperand2(this);
            let currentExecute = new this.TwoParameterInstructionMap[currentInst.getInstType()]();
            currentExecute.Execute(this, currentInst);
            let Rd = currentInst.getRd();
            if (!(currentExecute instanceof STR)) {
                let elementToChange = document.getElementById('R' + Rd);
                elementToChange.textContent = "R" + Rd + (String(Rd).length == 1 ? ":  " : ": ") + this.registers[Rd];
            }
            else {
                let memoryAddy = currentInst.getOperand2();
                let elementToChange = document.getElementById('M' + memoryAddy);
                elementToChange.textContent = memoryAddy + (String(memoryAddy).length == 1 ? ":  " : ": ") + this.registers[Rd];
            }
        }
        else if (this.instList[this.PC] instanceof BranchInst) {
            let currentInst = this.instList[this.PC];
            let currentExecute = new this.BranchesInstructionMap[currentInst.getCondition()]();
            currentExecute.Execute(this, currentInst);
        }
        else if (this.instList[this.PC] instanceof HALT) {
            this.HALT();
        }
        this.PC++;
    }
    StepBack() {
        this.loadState(this.stateHistory.Pop());
    }
    HALT() {
    }
    getPC() { return this.PC; }
    getSR() { return this.SR; }
    getRegister(index) {
        return this.registers[index];
    }
    getMemory(index) {
        return this.memory[index];
    }
    getState() {
        return new ARMEmulatorState(this);
    }
    getLabelLocation(label) {
        if (label in this.labelMap)
            return this.labelMap[label];
        else
            throw Error("Label " + label + " does not exist");
    }
    setRegister(index, value) {
        if (index > this.cap)
            throw new Error("Register does not exist on line " + this.PC);
        this.registers[index] = value;
    }
    setMemory(index, value) {
        if (index > this.cap)
            throw new Error("Memory Address does not exist on line " + this.PC);
        this.memory[index] = value;
    }
    setPC(value) {
        this.PC = value;
    }
    setSR(value) {
        this.SR = value;
    }
    loadState(state) {
        this.memory = state.getAllMemory();
        this.registers = state.getAllRegisters();
        this.PC = state.getPC();
        this.SR = state.getSR();
    }
}
class Stack {
    stack;
    front;
    length;
    constructor() {
        this.stack = [];
        this.front = -1;
        this.length = 0;
    }
    Push(value) {
        this.front++;
        this.stack[this.front] = value;
        this.length++;
    }
    Pop() {
        if (this.length == 0)
            throw new Error("Cannot step back anymore");
        let temp = this.stack[this.front];
        this.front--;
        this.length--;
        return temp;
    }
}
class ARMEmulatorState {
    registers;
    memory;
    PC;
    SR;
    constructor(ARM) {
        this.registers = [];
        this.memory = [];
        for (let i = 0; i < 23; i++) {
            this.registers[i] = ARM.getRegister(i);
            this.memory[i] = ARM.getMemory(i);
        }
        this.PC = ARM.getPC();
        this.SR = ARM.getSR();
    }
    getAllRegisters() {
        return this.registers;
    }
    getAllMemory() {
        return this.memory;
    }
    getPC() {
        return this.PC;
    }
    getSR() {
        return this.SR;
    }
}
