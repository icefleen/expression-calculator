function eval() {
    // Do not use eval!!!
    return;
}

function getPriority(operation) {
    return {
        '*': 2,
        '/': 2,
        '+': 1,
        '-': 1
    }[operation];
}

function getOperationFn(operation) {
    return {
        '+': (b, a) => a + b,
        '-': (b, a) => a - b,
        '*': (b, a) => a * b,
        '/': (b, a) => {
            if (b == 0) throw new TypeError("TypeError: Division by zero.");
            return a / b;
        }
    }[operation];
}

function getCorrectlyExpr(str) {
    let service_symbols = ['(', ')', '+', '-', '*', '/'];
    let index = 0;
    let expr = [];

    for (let char of str.replace(/\s+/g, "")) {
        if (index === 0) expr[index++] = char;

        else if (!service_symbols.includes(char) && !service_symbols.includes(expr[index - 1])) expr[index - 1] += char;

        else expr[index++] = char;
    }

    return expr;
}

function calculateRPN(rpn) {
    let stack = [];

    for (let elem of rpn) {
        if (typeof elem === "number") stack.push(elem);

        else if (stack.length < 2) {
            throw new Error("ExpressionError: Brackets must be paired");
        }

        else stack.push(getOperationFn(elem)(stack.pop(), stack.pop()));
    }

    return stack[0];
}

function expressionCalculator(expr) {
    expr = getCorrectlyExpr(expr);

    let rpn = [];

    let operations_stack = {
        stack: [],

        lastElement() {
            return this.stack[this.stack.length - 1]
        },

        add(elem) {
            let priority = getPriority(elem);
    
            if (elem === '(') this.stack.push(elem);

            else if (elem === ')') {
                if (!this.stack.includes('(')) throw new Error("ExpressionError: Brackets must be paired");
                
                let operation;
    
                while ((operation = this.stack.pop()) !== '(') {
                    rpn.push(operation);
                }
            }

            else if (priority === undefined) rpn.push(parseFloat(elem));

            else if (this.stack.length === 0) {
                this.stack.push(elem);
            }

            else if (this.lastElement() === '(') this.stack.push(elem);

            else if (priority === getPriority(this.lastElement())) {
                rpn.push(this.stack.pop());
                this.stack.push(elem);
            }

            else if (priority > getPriority(this.lastElement())) {
                this.stack.push(elem);
            }

            else if (priority < getPriority(this.lastElement())) {
                rpn.push(this.stack.pop());
                this.add(elem);
            }
        }
    };

    for (let elem of expr) {
        operations_stack.add(elem);
    }

    rpn = rpn.concat(operations_stack.stack.reverse());
    
    return calculateRPN(rpn);
}

module.exports = {
    expressionCalculator
}