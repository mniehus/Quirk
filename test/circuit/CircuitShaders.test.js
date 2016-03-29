import { Suite, assertThat, assertThrows } from "test/TestUtil.js"
import CircuitShaders from "src/circuit/CircuitShaders.js"

import Complex from "src/math/Complex.js"
import Controls from "src/circuit/Controls.js"
import Seq from "src/base/Seq.js"
import Shaders from "src/webgl/Shaders.js"
import Matrix from "src/math/Matrix.js"
import WglTexture from "src/webgl/WglTexture.js"

let suite = new Suite("CircuitShaders");

suite.webGlTest("classicalState", () => {
    assertThat(CircuitShaders.classicalState(0).readFloatOutputs(2, 2)).isEqualTo(new Float32Array([
        1, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ]));

    assertThat(CircuitShaders.classicalState(1).readFloatOutputs(2, 2)).isEqualTo(new Float32Array([
        0, 0, 0, 0,
        1, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ]));

    assertThat(CircuitShaders.classicalState(2).readFloatOutputs(2, 2)).isEqualTo(new Float32Array([
        0, 0, 0, 0,
        0, 0, 0, 0,
        1, 0, 0, 0,
        0, 0, 0, 0
    ]));

    assertThat(CircuitShaders.classicalState(3).readFloatOutputs(2, 2)).isEqualTo(new Float32Array([
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        1, 0, 0, 0
    ]));

    assertThat(CircuitShaders.classicalState(0).readFloatOutputs(2, 4)).isEqualTo(new Float32Array([
        1, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ]));

    assertThat(CircuitShaders.classicalState(5).readFloatOutputs(2, 4)).isEqualTo(new Float32Array([
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        1, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ]));
});

suite.webGlTest("linearOverlay", () => {
    let fore = Shaders.data(new Float32Array(Seq.range(2*2*4).map(e => e + 900).toArray())).toFloatTexture(2, 2);
    let back = Shaders.data(new Float32Array(Seq.range(4*4*4).map(e => -e).toArray())).toFloatTexture(4, 4);

    assertThat(CircuitShaders.linearOverlay(0, fore, back).readFloatOutputs(4, 4)).isEqualTo(new Float32Array([
        900, 901, 902, 903, 904, 905, 906, 907, 908, 909, 910, 911, 912, 913, 914, 915,
        -16, -17, -18, -19, -20, -21, -22, -23, -24, -25, -26, -27, -28, -29, -30, -31,
        -32, -33, -34, -35, -36, -37, -38, -39, -40, -41, -42, -43, -44, -45, -46, -47,
        -48, -49, -50, -51, -52, -53, -54, -55, -56, -57, -58, -59, -60, -61, -62, -63
    ]));

    assertThat(CircuitShaders.linearOverlay(1, fore, back).readFloatOutputs(4, 4)).isEqualTo(new Float32Array([
        -0,  -1,  -2,  -3,  900, 901, 902, 903, 904, 905, 906, 907, 908, 909, 910, 911,
        912, 913, 914, 915, -20, -21, -22, -23, -24, -25, -26, -27, -28, -29, -30, -31,
        -32, -33, -34, -35, -36, -37, -38, -39, -40, -41, -42, -43, -44, -45, -46, -47,
        -48, -49, -50, -51, -52, -53, -54, -55, -56, -57, -58, -59, -60, -61, -62, -63
    ]));

    assertThat(CircuitShaders.linearOverlay(2, fore, back).readFloatOutputs(4, 4)).isEqualTo(new Float32Array([
        -0,  -1,  -2,  -3,  -4,  -5,  -6,  -7,  900, 901, 902, 903, 904, 905, 906, 907,
        908, 909, 910, 911, 912, 913, 914, 915, -24, -25, -26, -27, -28, -29, -30, -31,
        -32, -33, -34, -35, -36, -37, -38, -39, -40, -41, -42, -43, -44, -45, -46, -47,
        -48, -49, -50, -51, -52, -53, -54, -55, -56, -57, -58, -59, -60, -61, -62, -63
    ]));

    assertThat(CircuitShaders.linearOverlay(4, fore, back).readFloatOutputs(4, 4)).isEqualTo(new Float32Array([
        -0,   -1,  -2,  -3,  -4,  -5,  -6,  -7,  -8,  -9, -10, -11, -12, -13, -14, -15,
        900, 901, 902, 903, 904, 905, 906, 907,  908, 909, 910, 911, 912, 913, 914, 915,
        -32, -33, -34, -35, -36, -37, -38, -39, -40, -41, -42, -43, -44, -45, -46, -47,
        -48, -49, -50, -51, -52, -53, -54, -55, -56, -57, -58, -59, -60, -61, -62, -63
    ]));

    assertThat(CircuitShaders.linearOverlay(12, fore, back).readFloatOutputs(4, 4)).isEqualTo(new Float32Array([
        -0,   -1,  -2,  -3,  -4,  -5,  -6,  -7,  -8,  -9, -10, -11, -12, -13, -14, -15,
        -16, -17, -18, -19, -20, -21, -22, -23, -24, -25, -26, -27, -28, -29, -30, -31,
        -32, -33, -34, -35, -36, -37, -38, -39, -40, -41, -42, -43, -44, -45, -46, -47,
        900, 901, 902, 903, 904, 905, 906, 907,  908, 909, 910, 911, 912, 913, 914, 915
    ]));

    assertThat(CircuitShaders.linearOverlay(13, fore, back).readFloatOutputs(4, 4)).isEqualTo(new Float32Array([
        -0,   -1,  -2,  -3,  -4,  -5,  -6,  -7,  -8,  -9, -10, -11, -12, -13, -14, -15,
        -16, -17, -18, -19, -20, -21, -22, -23, -24, -25, -26, -27, -28, -29, -30, -31,
        -32, -33, -34, -35, -36, -37, -38, -39, -40, -41, -42, -43, -44, -45, -46, -47,
        -48, -49, -50, -51, 900, 901, 902, 903, 904, 905, 906, 907,  908, 909, 910, 911
    ]));
});

suite.webGlTest("controlMask", () => {
    assertThat(CircuitShaders.controlMask(new Controls(0x3, 0x1)).readFloatOutputs(2, 2)).
        isEqualTo(new Float32Array([
            0, 0, 0, 0,
            1, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        ]));

    assertThat(CircuitShaders.controlMask(new Controls(0x3, 0x1)).readFloatOutputs(2, 2)).
        isEqualTo(new Float32Array([
            0, 0, 0, 0,
            1, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        ]));

    assertThat(CircuitShaders.controlMask(new Controls(0x3, 0x0)).readFloatOutputs(2, 2)).
        isEqualTo(new Float32Array([
            1, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        ]));

    assertThat(CircuitShaders.controlMask(new Controls(0x1, 0x0)).readFloatOutputs(2, 2)).
        isEqualTo(new Float32Array([
            1, 0, 0, 0,
            0, 0, 0, 0,
            1, 0, 0, 0,
            0, 0, 0, 0
        ]));

    assertThat(CircuitShaders.controlMask(new Controls(0x5, 0x4)).readFloatOutputs(4, 2)).
        isEqualTo(new Float32Array([
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            1, 0, 0, 0,
            0, 0, 0, 0,
            1, 0, 0, 0,
            0, 0, 0, 0
        ]));

    assertThat(CircuitShaders.controlMask(new Controls(0x1, 0x0)).readByteOutputs(2, 2)).
        isEqualTo(new Uint8Array([
            255, 0, 0, 0,
            0, 0, 0, 0,
            255, 0, 0, 0,
            0, 0, 0, 0
        ]));
});

suite.webGlTest("controlMask_largeReference", () => {
    let w = 1 << 7;
    let h = 1 << 10;
    let mask = new Controls(0b10111010101010111, 0b10011000001010001);
    let expected = new Float32Array(Seq.range(w * h).
        map(i => mask.allowsState(i) ? 1 : 0).
        flatMap(e => [e, 0, 0, 0]).
        toArray());
    assertThat(CircuitShaders.controlMask(mask).readFloatOutputs(w, h)).isEqualTo(expected);
});

suite.webGlTest("squaredMagnitude", () => {
    let amps = Shaders.data(new Float32Array([
        2, 3, 0, 0,
        0.5, 0.5, 0, 0,
        1, 2, 3, 4,
        0.25, 0.5, 0, 0,
        Math.sqrt(1/2), 0, 0, 0,
        0, Math.sqrt(1/3), 0, 0,
        3/5, 4/5, 0, 0,
        1, 0, 0, 0
    ])).toFloatTexture(4, 2);

    assertThat(CircuitShaders.squaredMagnitude(amps).readFloatOutputs(4, 2)).isApproximatelyEqualTo(new Float32Array([
        13, 0, 0, 0,
        0.5, 0, 0, 0,
        30, 0, 0, 0,
        0.3125, 0, 0, 0,
        0.5, 0, 0, 0,
        1/3, 0, 0, 0,
        1, 0, 0, 0,
        1, 0, 0, 0
    ]));
});

suite.webGlTest("qubitOperation", () => {
    let cnt = new WglTexture(4, 2);
    let inp = new WglTexture(4, 2);
    Shaders.data(new Float32Array([
        2, 3, 0, 0,
        4, 5, 0, 0,
        6, 7, 0, 0,
        8, 9, 0, 0,
        2, 3, 0, 0,
        5, 7, 0, 0,
        11, 13, 0, 0,
        17, 19, 0, 0
    ])).renderTo(inp);

    CircuitShaders.controlMask(Controls.fromBitIs(3, false)).renderTo(cnt);
    assertThat(CircuitShaders.qubitOperation(inp, Matrix.square(1, Complex.I.times(-1), Complex.I, -1), 0, cnt).
        readFloatOutputs(4, 2)).isEqualTo(new Float32Array([
            7, -1, 0, 0,
            -7, -3, 0, 0,
            15, -1, 0, 0,
            -15, -3, 0, 0,
            9, -2, 0, 0,
            -8, -5, 0, 0,
            30, -4, 0, 0,
            -30, -8, 0, 0
        ]));


    CircuitShaders.controlMask(Controls.fromBitIs(1, false)).renderTo(cnt);
    assertThat(CircuitShaders.qubitOperation(inp, Matrix.square(1, Complex.I.times(-1), Complex.I, -1), 0, cnt).
        readFloatOutputs(4, 2)).isEqualTo(new Float32Array([
            7, -1, 0, 0,
            -7, -3, 0, 0,
            6, 7, 0, 0,
            8, 9, 0, 0,
            9, -2, 0, 0,
            -8, -5, 0, 0,
            11, 13, 0, 0,
            17, 19, 0, 0
        ]));

    CircuitShaders.controlMask(Controls.fromBitIs(1, true)).renderTo(cnt);
    assertThat(CircuitShaders.qubitOperation(inp, Matrix.square(1, Complex.I.times(-1), Complex.I, -1), 0, cnt).
        readFloatOutputs(4, 2)).isEqualTo(new Float32Array([
            2, 3, 0, 0,
            4, 5, 0, 0,
            15, -1, 0, 0,
            -15, -3, 0, 0,
            2, 3, 0, 0,
            5, 7, 0, 0,
            30, -4, 0, 0,
            -30, -8, 0, 0
        ]));

    CircuitShaders.controlMask(Controls.fromBitIs(2, false)).renderTo(cnt);
    assertThat(CircuitShaders.qubitOperation(inp, Matrix.square(1, Complex.I.times(-1), Complex.I, -1), 0, cnt).
        readFloatOutputs(4, 2)).isEqualTo(new Float32Array([
            7, -1, 0, 0,
            -7, -3, 0, 0,
            15, -1, 0, 0,
            -15, -3, 0, 0,
            2, 3, 0, 0,
            5, 7, 0, 0,
            11, 13, 0, 0,
            17, 19, 0, 0
        ]));

    CircuitShaders.controlMask(Controls.fromBitIs(3, false)).renderTo(cnt);
    assertThat(CircuitShaders.qubitOperation(inp, Matrix.square(0, 0, 0, 0), 0, cnt).readFloatOutputs(4, 2)).
        isEqualTo(new Float32Array([
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        ]));

    CircuitShaders.controlMask(Controls.fromBitIs(3, false)).renderTo(cnt);
    assertThat(CircuitShaders.qubitOperation(inp, Matrix.square(1, Complex.I.times(-1), Complex.I, -1), 1, cnt).
        readFloatOutputs(4, 2)).isEqualTo(new Float32Array([
            9, -3, 0, 0,
            13, -3, 0, 0,
            -9, -5, 0, 0,
            -13, -5, 0, 0,
            15, -8, 0, 0,
            24, -10, 0, 0,
            -14, -11, 0, 0,
            -24, -14, 0, 0
        ]));
});

suite.webGlTest("qubitOperation_flows", () => {
    let inp1 = new WglTexture(2, 1);
    let cnt1 = new WglTexture(2, 1);
    Shaders.data(new Float32Array([
        1, 2, 0, 0,
        3, 27, 0, 0
    ])).renderTo(inp1);
    CircuitShaders.controlMask(Controls.fromBitIs(1, false)).renderTo(cnt1);
    assertThat(CircuitShaders.qubitOperation(inp1, Matrix.square(1, 0, 0, 0), 0, cnt1).readFloatOutputs(2, 1)).
        isEqualTo(new Float32Array([
            1, 2, 0, 0,
            0, 0, 0, 0
        ]));
    assertThat(CircuitShaders.qubitOperation(inp1, Matrix.square(0, 1, 0, 0), 0, cnt1).readFloatOutputs(2, 1)).
        isEqualTo(new Float32Array([
            3, 27, 0, 0,
            0, 0, 0, 0
        ]));
    assertThat(CircuitShaders.qubitOperation(inp1, Matrix.square(0, 0, 1, 0), 0, cnt1).readFloatOutputs(2, 1)).
        isEqualTo(new Float32Array([
            0, 0, 0, 0,
            1, 2, 0, 0
        ]));
    assertThat(CircuitShaders.qubitOperation(inp1, Matrix.square(0, 0, 0, 1), 0, cnt1).readFloatOutputs(2, 1)).
        isEqualTo(new Float32Array([
            0, 0, 0, 0,
            3, 27, 0, 0
        ]));
});

suite.webGlTest("swap", () => {
    let inp = Shaders.data(new Float32Array([
        11, 12, 13, 14, //000
        21, 22, 23, 24, //001
        31, 32, 33, 34, //010
        41, 42, 43, 44, //011
        51, 52, 53, 54, //100
        61, 62, 63, 64, //101
        71, 72, 73, 74, //110
        81, 82, 83, 84  //111
    ])).toFloatTexture(4, 2);
    let cnt = Shaders.color(1, 0, 0, 0).toFloatTexture(4, 2);
    assertThat(CircuitShaders.swap(inp, 0, 1, cnt).readFloatOutputs(4, 2)).isEqualTo(new Float32Array([
        11, 12, 13, 14, //000
        31, 32, 33, 34, //010
        21, 22, 23, 24, //001
        41, 42, 43, 44, //011
        51, 52, 53, 54, //100
        71, 72, 73, 74, //110
        61, 62, 63, 64, //101
        81, 82, 83, 84  //111
    ]));

    CircuitShaders.controlMask(Controls.fromBitIs(2, false)).renderTo(cnt);
    assertThat(CircuitShaders.swap(inp, 0, 1, cnt).readFloatOutputs(4, 2)).isEqualTo(new Float32Array([
        11, 12, 13, 14, //000
        31, 32, 33, 34, //010
        21, 22, 23, 24, //001
        41, 42, 43, 44, //011
        51, 52, 53, 54, //100
        61, 62, 63, 64, //101
        71, 72, 73, 74, //110
        81, 82, 83, 84  //111
    ]));

    Shaders.color(1, 0, 0, 0).renderTo(cnt);
    assertThat(CircuitShaders.swap(inp, 0, 2, cnt).readFloatOutputs(4, 2)).isEqualTo(new Float32Array([
        11, 12, 13, 14, //000
        51, 52, 53, 54, //100
        31, 32, 33, 34, //010
        71, 72, 73, 74, //110
        21, 22, 23, 24, //001
        61, 62, 63, 64, //101
        41, 42, 43, 44, //011
        81, 82, 83, 84  //111
    ]));

    CircuitShaders.controlMask(Controls.fromBitIs(1, false)).renderTo(cnt);
    assertThat(CircuitShaders.swap(inp, 0, 2, cnt).readFloatOutputs(4, 2)).isEqualTo(new Float32Array([
        11, 12, 13, 14, //000
        51, 52, 53, 54, //100
        31, 32, 33, 34, //010
        41, 42, 43, 44, //011
        21, 22, 23, 24, //001
        61, 62, 63, 64, //101
        71, 72, 73, 74, //110
        81, 82, 83, 84  //111
    ]));

    CircuitShaders.controlMask(Controls.fromBitIs(1, true)).renderTo(cnt);
    assertThat(CircuitShaders.swap(inp, 0, 2, cnt).readFloatOutputs(4, 2)).isEqualTo(new Float32Array([
        11, 12, 13, 14, //000
        21, 22, 23, 24, //001
        31, 32, 33, 34, //010
        71, 72, 73, 74, //110
        51, 52, 53, 54, //100
        61, 62, 63, 64, //101
        41, 42, 43, 44, //011
        81, 82, 83, 84  //111
    ]));
});

suite.webGlTest("controlSelect_simple", () => {
    let coords = Shaders.coords.toFloatTexture(4, 4);
    assertThat(CircuitShaders.controlSelect(Controls.NONE, coords).readFloatOutputs(4, 4)).
        isEqualTo(new Float32Array([
            0,0,0,0, 1,0,0,0, 2,0,0,0, 3,0,0,0,
            0,1,0,0, 1,1,0,0, 2,1,0,0, 3,1,0,0,
            0,2,0,0, 1,2,0,0, 2,2,0,0, 3,2,0,0,
            0,3,0,0, 1,3,0,0, 2,3,0,0, 3,3,0,0
        ]));
    assertThat(CircuitShaders.controlSelect(Controls.fromBitIs(0, false), coords).readFloatOutputs(4, 2)).
        isEqualTo(new Float32Array([
            0,0,0,0, 2,0,0,0,
            0,1,0,0, 2,1,0,0,
            0,2,0,0, 2,2,0,0,
            0,3,0,0, 2,3,0,0
        ]));
    assertThat(CircuitShaders.controlSelect(Controls.fromBitIs(0, true), coords).readFloatOutputs(4, 2)).
        isEqualTo(new Float32Array([
            1,0,0,0, 3,0,0,0,
            1,1,0,0, 3,1,0,0,
            1,2,0,0, 3,2,0,0,
            1,3,0,0, 3,3,0,0
        ]));
    assertThat(CircuitShaders.controlSelect(Controls.fromBitIs(1, false), coords).readFloatOutputs(4, 2)).
        isEqualTo(new Float32Array([
            0,0,0,0, 1,0,0,0,
            0,1,0,0, 1,1,0,0,
            0,2,0,0, 1,2,0,0,
            0,3,0,0, 1,3,0,0
        ]));
    assertThat(CircuitShaders.controlSelect(Controls.fromBitIs(1, true), coords).readFloatOutputs(4, 2)).
        isEqualTo(new Float32Array([
            2,0,0,0, 3,0,0,0,
            2,1,0,0, 3,1,0,0,
            2,2,0,0, 3,2,0,0,
            2,3,0,0, 3,3,0,0
        ]));
    assertThat(CircuitShaders.controlSelect(Controls.fromBitIs(2, false), coords).readFloatOutputs(4, 2)).
        isEqualTo(new Float32Array([
            0,0,0,0, 1,0,0,0, 2,0,0,0, 3,0,0,0,
            0,2,0,0, 1,2,0,0, 2,2,0,0, 3,2,0,0
        ]));
    assertThat(CircuitShaders.controlSelect(Controls.fromBitIs(2, true), coords).readFloatOutputs(4, 2)).
        isEqualTo(new Float32Array([
            0,1,0,0, 1,1,0,0, 2,1,0,0, 3,1,0,0,
            0,3,0,0, 1,3,0,0, 2,3,0,0, 3,3,0,0
        ]));
    assertThat(CircuitShaders.controlSelect(Controls.fromBitIs(3, false), coords).readFloatOutputs(4, 2)).
        isEqualTo(new Float32Array([
            0,0,0,0, 1,0,0,0, 2,0,0,0, 3,0,0,0,
            0,1,0,0, 1,1,0,0, 2,1,0,0, 3,1,0,0
        ]));
    assertThat(CircuitShaders.controlSelect(Controls.fromBitIs(3, true), coords).readFloatOutputs(4, 2)).
        isEqualTo(new Float32Array([
            0,2,0,0, 1,2,0,0, 2,2,0,0, 3,2,0,0,
            0,3,0,0, 1,3,0,0, 2,3,0,0, 3,3,0,0
        ]));
});

suite.webGlTest("controlSelect_skewed", () => {
    let coords = Shaders.coords.toFloatTexture(2, 8);
    let shader = CircuitShaders.controlSelect(Controls.fromBitIs(1, true), coords);
    let r1 = shader.readFloatOutputs(8, 1);
    let r2 = shader.readFloatOutputs(4, 2);
    let r3 = shader.readFloatOutputs(2, 4);
    let r4 = shader.readFloatOutputs(1, 8);
    assertThat(r1).isEqualTo(new Float32Array([
        0,1,0,0, 1,1,0,0,
        0,3,0,0, 1,3,0,0,
        0,5,0,0, 1,5,0,0,
        0,7,0,0, 1,7,0,0
    ]));
    assertThat(r2).isEqualTo(r1);
    assertThat(r3).isEqualTo(r1);
    assertThat(r4).isEqualTo(r1);
});

suite.webGlTest("controlSelect_multiple", () => {
    let coords = Shaders.coords.toFloatTexture(4, 4);
    assertThat(CircuitShaders.controlSelect(new Controls(0x3, 0x3), coords).readFloatOutputs(2, 2)).
        isEqualTo(new Float32Array([
            3,0,0,0,
            3,1,0,0,
            3,2,0,0,
            3,3,0,0
        ]));
    assertThat(CircuitShaders.controlSelect(new Controls(0x3, 0x2), coords).readFloatOutputs(2, 2)).
        isEqualTo(new Float32Array([
            2,0,0,0,
            2,1,0,0,
            2,2,0,0,
            2,3,0,0
        ]));
    assertThat(CircuitShaders.controlSelect(new Controls(0xC, 0xC), coords).readFloatOutputs(2, 2)).
        isEqualTo(new Float32Array([
            0,3,0,0, 1,3,0,0, 2,3,0,0, 3,3,0,0
        ]));
    assertThat(CircuitShaders.controlSelect(new Controls(0xF, 0x3), coords).readFloatOutputs(1, 1)).
        isEqualTo(new Float32Array([
            3,0,0,0
        ]));
});

suite.webGlTest("allQubitDensities", () => {
    let s = Math.sqrt(0.5);
    let q = 0.25;
    let h = 0.5;
    let _ = 0;

    let assertAmpsToDensities = (amps, dens) => {
        let tex = Shaders.data(new Float32Array(amps)).toFloatTexture(2, 1);
        assertThat(CircuitShaders.allQubitDensities(tex).readFloatOutputs(1, 1)).
            isApproximatelyEqualTo(new Float32Array(dens));
        tex.ensureDeinitialized();
    };
    assertAmpsToDensities(
        [1,_,_,_, _,_,_,_],
        [1,0,0,0]);
    assertAmpsToDensities(
        [_,1,_,_, _,_,_,_],
        [1,0,0,0]);
    assertAmpsToDensities(
        [_,_,_,_, 1,_,_,_],
        [0,0,0,1]);
    assertAmpsToDensities(
        [_,_,_,_, _,1,_,_],
        [0,0,0,1]);
    assertAmpsToDensities(
        [s,_,_,_, s,_,_,_],
        [h,h,0,h]);
    assertAmpsToDensities(
        [s,_,_,_, _,s,_,_],
        [h,0,h,h]);
    assertAmpsToDensities(
        [_,s,_,_, s,_,_,_],
        [h,0,-h,h]);
    assertAmpsToDensities(
        [_,s,_,_, -s,_,_,_],
        [h,0,h,h]);
    assertAmpsToDensities(
        [0.4,_,_,_, _,0.6,_,_],
        [0.16,0,0.24,0.36]);

    let allQubitsZero = Shaders.data(new Float32Array([
        1,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_,
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_,
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_,
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_
    ])).toFloatTexture(4, 4);
    assertThat(CircuitShaders.allQubitDensities(allQubitsZero).readFloatOutputs(32, 1)).isEqualTo(new Float32Array([
        1,_,_,_, 1,_,_,_, 1,_,_,_, 1,_,_,_,
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_,
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_,
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_,
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_,
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_,
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_,
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_
    ]));

    let ent = Shaders.data(new Float32Array([
        s,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_,
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_,
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_,
        _,_,_,_, _,_,_,_, _,_,_,_, s,_,_,_
    ])).toFloatTexture(4, 4);
    assertThat(CircuitShaders.allQubitDensities(ent).readFloatOutputs(32, 1)).isApproximatelyEqualTo(new Float32Array([
        h,_,_,_, h,_,_,_, h,_,_,_, h,_,_,_,
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_,
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_,
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_,
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_,
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_,
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_,
        _,_,_,h, _,_,_,h, _,_,_,h, _,_,_,h
    ]));

    // 0, 0+1, 0+i1, 1
    let mix = Shaders.data(new Float32Array([
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_,
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_,
        h,_,_,_, _,_,_,_, h,_,_,_, _,_,_,_,
        _,h,_,_, _,_,_,_, _,h,_,_, _,_,_,_
    ])).toFloatTexture(4, 4);
    assertThat(CircuitShaders.allQubitDensities(mix).readFloatOutputs(32, 1)).isApproximatelyEqualTo(new Float32Array([
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,q,
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_,
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,q,
        _,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_,
        q,_,_,_, q,q,_,q, q,_,q,q, _,_,_,q,
        q,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_,
        q,_,_,_, q,q,_,q, q,_,q,q, _,_,_,q,
        q,_,_,_, _,_,_,_, _,_,_,_, _,_,_,_
    ]));
});
