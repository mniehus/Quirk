import GateColumn from "src/circuit/GateColumn.js"
import Gates from "src/ui/Gates.js"
import Matrix from "src/math/Matrix.js"
import Point from "src/math/Point.js"
import Seq from "src/base/Seq.js"
import Util from "src/base/Util.js"

class CircuitDefinition {
    /**
     * @param {!int} numWires
     * @param {!Array<!GateColumn>} columns
     * @property {!int} numWires
     * @property {!Array<!GateColumn>} columns;
     */
    constructor(numWires, columns) {
        Util.need(numWires >= 0, "numWires >= 0");
        Util.need(columns.every(e => e instanceof GateColumn), "columns.every(e => e instanceof GateColumn)");
        Util.need(columns.every(e => e.gates.length === numWires), "columns.every(e => e.gates.length === numWires)");
        this.numWires = numWires;
        this.columns = columns;
    }

    /**
     * @returns {!boolean}
     */
    isTimeDependent() {
        return new Seq(this.columns).any(
                e => new Seq(e.gates).any(
                    g => g !== null && g.isTimeBased()));
    }

    /**
     * @param {!Array.<!Array.<?Gate>>} gates
     * @return {!CircuitDefinition}
     */
    static from(gates) {
        if (gates.length === 0) {
            return new CircuitDefinition(0, []);
        }
        return new CircuitDefinition(gates[0].length, gates.map(c => new GateColumn(c)));
    }

    /**
     * Returns a munged compact text representation of the circuit.
     *
     * The text isn't intended to be particularly understandable, but it should vaguely reflect or at least
     * distinguish the circuit from others when skimming a list of hashes (e.g. links in browser history).
     */
    readableHash() {
        let allGates = new Seq(this.columns)
            .flatMap(e => e.gates)
            .filter(e => e !== null)
            .map(e => e.symbol)
            .toArray();
        if (allGates.length === 0) {
            return "A Toy Quantum Circuit Inspector";
        }
        let allGatesString = `${this.numWires} wires, ${allGates.length} ops, ${allGates.join("").split("^").join("")}`;
        if (allGatesString.length <= 40) {
            return allGatesString;
        }
        return allGatesString.substring(0, 40) + `…`;
    }

    withColumns(columns) {
        return new CircuitDefinition(
            this.numWires,
            columns)
    }

    withoutEmpties() {
        return new CircuitDefinition(
            this.numWires,
            this.columns.filter(e => !e.isEmpty()));
    }

    withWireCount(newWireCount) {
        if (newWireCount === this.numWires) {
            return this;
        }
        return new CircuitDefinition(
            newWireCount,
            this.columns.map(c => new GateColumn(
                new Seq(c.gates).
                    take(newWireCount).
                    padded(newWireCount, null).
                    toArray())));
    }

    /**
     * Determines at what point each wire is measured (if ever).
     * @returns {!Array.<int>}
     */
    wireMeasuredColumns() {
        if (this.__cachedMeasureIndices === undefined) {
            this.__cachedMeasureIndices = Seq.
                range(this.numWires).
                map(r => Seq.
                    range(this.columns.length).
                    skipWhile(c => this.columns[c].gates[r] !== Gates.Special.Measurement ||
                        this.colHasControls(c)).
                    first(Infinity)).
                toArray();
        }
        return this.__cachedMeasureIndices;
    }

    isEqualTo(other) {
        if (this === other) {
            return true;
        }
        return other instanceof CircuitDefinition &&
            this.numWires === other.numWires &&
            new Seq(this.columns).isEqualTo(new Seq(other.columns), Util.CUSTOM_IS_EQUAL_TO_EQUALITY);
    }

    /**
     * @param {!Point} pt
     * @returns {boolean}
     */
    locIsMeasured(pt) {
        return this.wireMeasuredColumns()[pt.y] <= pt.x;
    }

    /**
     * @param {!Point} pt
     * @returns {!Gate|null}
     */
    gateAtLoc(pt) {
        if (pt.x < 0 || pt.x >= this.columns.length || pt.y < 0 || pt.y >= this.numWires) {
            return null;
        }
        return this.columns[pt.x].gates[pt.y];
    }

    /**
     * @param {!Point} pt
     * @returns {boolean}
     */
    locIsControl(pt) {
        let gate = this.gateAtLoc(pt);
        return gate === Gates.Special.Control || gate === Gates.Special.AntiControl;
    }

    /**
     * @param {!Point} pt
     * @returns {boolean}
     */
    locStartsSingleControlWire(pt) {
        return this.locIsControl(pt) &&
            !this.locIsMeasured(pt);
    }

    /**
     * @param {!Point} pt
     * @returns {boolean}
     */
    locStartsDoubleControlWire(pt) {
        return this.locIsControl(pt) &&
            this.locIsMeasured(pt);
    }

    /**
     * @param {int} col
     * @returns {boolean}
     */
    colHasPairedSwapGate(col) {
        let pts = Seq.range(this.numWires).
            map(row => new Point(col, row)).
            filter(pt => this.gateAtLoc(pt) === Gates.Special.SwapHalf);
        return !pts.any(pt => this.gateAtLocIsDisabledReason(pt) !== null) && pts.count() == 2;
    }

    /**
     * @param {!Point} pt
     * @returns {boolean}
     */
    locHasControllableGate(pt) {
        let g = this.gateAtLoc(pt);
        return g !== null &&
            g !== Gates.Special.Control &&
            g !== Gates.Special.AntiControl &&
            g !== Gates.Silly.SPACER &&
            (g !== Gates.Special.SwapHalf || this.colHasPairedSwapGate(pt.x));
    }

    colHasControls(col) {
        return Seq.range(this.numWires).any(row => this.locIsControl(new Point(col, row)));
    }

    /**
     * @param {!int} col
     * @returns {boolean}
     */
    colHasSingleWireControl(col) {
        return Seq.range(this.numWires).any(row => this.locStartsSingleControlWire(new Point(col, row)));
    }

    /**
     * @param {!int} col
     * @returns {boolean}
     */
    colHasDoubleWireControl(col) {
        return Seq.range(this.numWires).any(row => this.locStartsDoubleControlWire(new Point(col, row)));
    }

    /**
     * @param {!Point} pt
     * @returns {null|!string}
     */
    gateAtLocIsDisabledReason(pt) {
        /**
         * @type {undefined|!Map<!string, null|!string>}
         * @private
         */
        this._cache_gateAtLocIsDisabledReason = this._cache_gateAtLocIsDisabledReason || new Map();
        let key = pt.x + ":" + pt.y;
        if (!this._cache_gateAtLocIsDisabledReason.has(key)) {
            this._cache_gateAtLocIsDisabledReason.set(key, this._uncached_gateAtLocIsDisabledReason(pt));
        }
        return this._cache_gateAtLocIsDisabledReason.get(key);
    }

    /**
     * @param {!Point} pt
     * @returns {null|!string}
     * @private
     */
    _uncached_gateAtLocIsDisabledReason(pt) {
        let g = this.gateAtLoc(pt);

        if (g === null) {
            return null;
        }

        if (g.name === "Parse Error") {
            return "parse\nerror";
        }

        if (g === Gates.Special.Measurement && this.colHasControls(pt.x)) {
            return "can't\ncontrol\n(sorry)";
        }

        if (g === Gates.Special.SwapHalf) {
            let pts = Seq.range(this.numWires).
                map(row => new Point(pt.x, row)).
                filter(pt => this.gateAtLoc(pt) === Gates.Special.SwapHalf);
            if (pts.count() === 1) {
                return "need\nother\nswap";
            }
            if (pts.count() > 2) {
                return "too\nmany\nswap";
            }

            if (pts.map(e => this.locIsMeasured(e)).distinct().count() !== 1) {
                // Swapping a measured qubit for an unmeasured qubit could be allowed, but it's not implemented.
                return "measure\ndiffers\n(sorry)";
            }
        }

        // Measured qubits can't be re-superposed for implementation simplicity reasons.
        if (this.locIsMeasured(pt)) {
            let m = g.matrixAt(0.1234); // Pick a time that's unlikely to be on a corner case of a time-based gate.
            const ε = 0.0001;
            let doesSomething = !m.isIdentity();
            let createsSuperpositions = !m.isPhasedPermutation(ε);
            let hasQuantumControls = this.colHasSingleWireControl(pt.x);
            if (doesSomething && (hasQuantumControls || createsSuperpositions)) {
                return "no\nremix\n(sorry)";
            }
        }

        return null;
    }

    /**
     * @param {!int} colIndex
     * @param {!number} time
     * @returns {!(!{m: !Matrix, i: !int}[])}
     */
    singleQubitOperationsInColAt(colIndex, time) {
        if (colIndex < 0 || colIndex >= this.columns.length) {
            return [];
        }

        let col = this.columns[colIndex];
        return new Seq(col.gates).
            mapWithIndex((gate, i) => {
                let pt = new Point(colIndex, i);
                if (gate === null || this.gateAtLocIsDisabledReason(pt) !== null) {
                    return null;
                }
                let m = gate.matrixAt(time);
                if (m.width() !== 2 || m.height() !== 2 || m.isIdentity()) {
                    return null;
                }
                return {m, i};
            }).
            filter(e => e !== null).
            toArray();
    }

    toString() {
        let w = "─";
        let self = this;
        return Seq.
            range(self.numWires).
            map(r => w + Seq.
                range(this.columns.length).
                map(c => {
                    let g = self.columns[c].gates[r];
                    let t = g === null ? w : g.symbol;
                    return new Seq(t).padded(7, w).join("");
                }).
                join("")).
            join("\n");
    }
}

export default CircuitDefinition;
