const fs = require("fs");

const jsonFiles = ["input_test_case_1.json", "input_test_case_2.json"];

function processFile(fileName) {
    const data = JSON.parse(fs.readFileSync(fileName, "utf8"));
    const n = data.keys.n;
    const k = data.keys.k;
    let points = [];

    for (let i = 1; i <= n; i++) {
        if (data[i]) {
            const x = i;
            const base = parseInt(data[i].base, 10);
            const yEncoded = data[i].value;
            const y = parseInt(yEncoded, base);
            points.push({ x, y });
        }
    }

    points = points.slice(0, k);
    function createVandermondeMatrix(points, degree) {
        return points.map((point) => {
            return Array.from({ length: degree + 1 }, (_, j) =>
                Math.pow(point.x, j),
            );
        });
    }

    function gaussianElimination(A, b) {
        let n = A.length;

        for (let i = 0; i < n; i++) {
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
                    maxRow = k;
                }
            }

            [A[i], A[maxRow]] = [A[maxRow], A[i]];
            [b[i], b[maxRow]] = [b[maxRow], b[i]];

            for (let k = i + 1; k < n; k++) {
                let c = -A[k][i] / A[i][i];
                for (let j = i; j < n; j++) {
                    A[k][j] += c * A[i][j];
                }
                b[k] += c * b[i];
            }
        }

        let x = new Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            x[i] = b[i] / A[i][i];
            for (let k = i - 1; k >= 0; k--) {
                b[k] -= A[k][i] * x[i];
            }
        }
        return x;
    }

    let degree = k - 1;
    let A = createVandermondeMatrix(points, degree);
    let b = points.map((point) => point.y);

    let coefficients = gaussianElimination(A, b);

    console.log(
        `The secret (constant term c) from ${fileName} is: ${coefficients[0]}`,
    );
}

jsonFiles.forEach(processFile);
