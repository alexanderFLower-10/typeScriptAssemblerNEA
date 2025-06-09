var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ARMEmulator_registers, _ARMEmulator_memory, _ARMEmulator_PC, _ARMEmulator_instList, _ARMEmulator_cap, _ARMEmulator_stateHistory, _Stack_stack, _Stack_front, _Stack_length, _ARMEmulatorState_registers, _ARMEmulatorState_memory, _ARMEmulatorState_PC;
export class ARMEmulator {
    constructor(instList) {
        _ARMEmulator_registers.set(this, void 0);
        _ARMEmulator_memory.set(this, void 0);
        _ARMEmulator_PC.set(this, void 0);
        _ARMEmulator_instList.set(this, void 0);
        _ARMEmulator_cap.set(this, void 0);
        _ARMEmulator_stateHistory.set(this, void 0);
        __classPrivateFieldSet(this, _ARMEmulator_stateHistory, new Stack(), "f");
        __classPrivateFieldSet(this, _ARMEmulator_instList, instList, "f");
        __classPrivateFieldSet(this, _ARMEmulator_registers, [], "f");
        __classPrivateFieldSet(this, _ARMEmulator_memory, [], "f");
        __classPrivateFieldSet(this, _ARMEmulator_PC, 0, "f");
        __classPrivateFieldSet(this, _ARMEmulator_cap, 23, "f");
    }
    Step() {
        var _a;
        __classPrivateFieldGet(this, _ARMEmulator_stateHistory, "f").Push(this.getState());
        __classPrivateFieldSet(this, _ARMEmulator_PC, (_a = __classPrivateFieldGet(this, _ARMEmulator_PC, "f"), _a++, _a), "f");
    }
    StepBack() {
        this.loadState(__classPrivateFieldGet(this, _ARMEmulator_stateHistory, "f").Pop());
    }
    getPC() { return __classPrivateFieldGet(this, _ARMEmulator_PC, "f"); }
    setRegister(index, value) {
        if (index > __classPrivateFieldGet(this, _ARMEmulator_cap, "f"))
            throw new Error("Register does not exist on line " + __classPrivateFieldGet(this, _ARMEmulator_PC, "f"));
        __classPrivateFieldGet(this, _ARMEmulator_registers, "f")[index] = value;
    }
    setMemory(index, value) {
        if (index > __classPrivateFieldGet(this, _ARMEmulator_cap, "f"))
            throw new Error("Memory Address does not exist on line " + __classPrivateFieldGet(this, _ARMEmulator_PC, "f"));
        __classPrivateFieldGet(this, _ARMEmulator_memory, "f")[index] = value;
    }
    getRegister(index) {
        return __classPrivateFieldGet(this, _ARMEmulator_registers, "f")[index];
    }
    getMemory(index) {
        return __classPrivateFieldGet(this, _ARMEmulator_memory, "f")[index];
    }
    getState() {
        return new ARMEmulatorState(this);
    }
    loadState(state) {
        __classPrivateFieldSet(this, _ARMEmulator_memory, state.getAllMemory(), "f");
        __classPrivateFieldSet(this, _ARMEmulator_registers, state.getAllRegisters(), "f");
        __classPrivateFieldSet(this, _ARMEmulator_PC, state.getPC(), "f");
    }
}
_ARMEmulator_registers = new WeakMap(), _ARMEmulator_memory = new WeakMap(), _ARMEmulator_PC = new WeakMap(), _ARMEmulator_instList = new WeakMap(), _ARMEmulator_cap = new WeakMap(), _ARMEmulator_stateHistory = new WeakMap();
class Stack {
    constructor() {
        _Stack_stack.set(this, void 0);
        _Stack_front.set(this, void 0);
        _Stack_length.set(this, void 0);
        __classPrivateFieldSet(this, _Stack_stack, [], "f");
        __classPrivateFieldSet(this, _Stack_front, -1, "f");
        __classPrivateFieldSet(this, _Stack_length, 0, "f");
    }
    Push(value) {
        var _a, _b;
        __classPrivateFieldSet(this, _Stack_front, (_a = __classPrivateFieldGet(this, _Stack_front, "f"), _a++, _a), "f");
        __classPrivateFieldGet(this, _Stack_stack, "f")[__classPrivateFieldGet(this, _Stack_front, "f")] = value;
        __classPrivateFieldSet(this, _Stack_length, (_b = __classPrivateFieldGet(this, _Stack_length, "f"), _b++, _b), "f");
    }
    Pop() {
        var _a, _b;
        if (__classPrivateFieldGet(this, _Stack_length, "f") == 0)
            throw new Error("Cannot step back anymore");
        let temp = __classPrivateFieldGet(this, _Stack_stack, "f")[__classPrivateFieldGet(this, _Stack_front, "f")];
        __classPrivateFieldSet(this, _Stack_front, (_a = __classPrivateFieldGet(this, _Stack_front, "f"), _a--, _a), "f");
        __classPrivateFieldSet(this, _Stack_length, (_b = __classPrivateFieldGet(this, _Stack_length, "f"), _b--, _b), "f");
        return temp;
    }
}
_Stack_stack = new WeakMap(), _Stack_front = new WeakMap(), _Stack_length = new WeakMap();
class ARMEmulatorState {
    constructor(ARM) {
        _ARMEmulatorState_registers.set(this, void 0);
        _ARMEmulatorState_memory.set(this, void 0);
        _ARMEmulatorState_PC.set(this, void 0);
        __classPrivateFieldSet(this, _ARMEmulatorState_registers, [], "f");
        __classPrivateFieldSet(this, _ARMEmulatorState_memory, [], "f");
        for (let i = 0; i < 23; i++) {
            __classPrivateFieldGet(this, _ARMEmulatorState_registers, "f")[i] = ARM.getRegister(i);
            __classPrivateFieldGet(this, _ARMEmulatorState_memory, "f")[i] = ARM.getMemory(i);
        }
        __classPrivateFieldSet(this, _ARMEmulatorState_PC, ARM.getPC(), "f");
    }
    getAllRegisters() {
        return __classPrivateFieldGet(this, _ARMEmulatorState_registers, "f");
    }
    getAllMemory() {
        return __classPrivateFieldGet(this, _ARMEmulatorState_memory, "f");
    }
    getPC() {
        return __classPrivateFieldGet(this, _ARMEmulatorState_PC, "f");
    }
}
_ARMEmulatorState_registers = new WeakMap(), _ARMEmulatorState_memory = new WeakMap(), _ARMEmulatorState_PC = new WeakMap();
