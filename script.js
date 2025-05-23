const displayBox = document.querySelector(".display"),
    displayInput = document.querySelector(".display-input"),
    displayResult = document.querySelector(".display-result"),
    buttons = document.querySelectorAll("button"),
    operators = ["%", "÷", "×", "-", "+"];
let input = "",
    result = "",
    lastCalculation = false;

//main function to handle calculator logic
const calculate = btnValue => {
    const lastChar = input.slice(-1),
        secondToLastChar = input.slice(-2, -1),
        withoutLastChar = input.slice(0, -1),
        isLastCharOperator = operators.includes(lastChar),
        isInvalidResult = ["Error", "Infinity"].includes(result);
    let { openBracketsCount, closeBracketsCount } = countBrackets(input);

    //handle equals
    if (btnValue === "=") {
        if (
            input === "" ||
            lastChar === "." ||
            lastChar === "(" ||
            isLastCharOperator && lastChar !== "%" || 
            lastCalculation
        ) return;

        while (openBracketsCount > closeBracketsCount) {
            input +=")";
            closeBracketsCount++;
        }

        const formattedInput = replaceOperators(input);
        try {
            const calculatedValue = input.includes("%") ? calculatePercentage(input) : eval(formattedInput);
            result = parseFloat(calculatedValue.toFixed(10)).toString();
        }
        catch {
            result = "Error";
        }

        input += btnValue;
        lastCalculation = true;
        displayBox.classList.add("active");
    }
    //handle AC (All Clear)
    else if(btnValue === "AC") {
        resetCalculator("");
    }
        //handle backspace
        else if (btnValue === "") {
            if (lastCalculation) {
                if (isInvalidResult) resetCalculator("");
                resetCalculator(result.slice(0, -1));
            }
            else input = withoutLastChar;
        }
        //handle operators
    else if (operators.includes(btnValue)) {
        if (lastCalculation) {
            if (isInvalidResult) return;
            resetCalculator(result + btnValue);
        }
        else if (
            (input === "" || lastChar === "(") && btnValue !== "-" || input === "-" ||
            lastChar === "." ||
            secondToLastChar === "(" && lastChar === "-" ||
            (secondToLastChar === "%" || lastChar === "%") && btnValue === "%"
        ) return;
        else if (lastChar === "%") input += btnValue;
        else if (isLastCharOperator) input = withoutLastChar + btnValue;
        else input += btnValue;
    }
        //handle decimal
    else if (btnValue === ".") {
        const decimalValue = "0.";
        if (lastCalculation) resetCalculator(decimalValue);
        else if (lastChar === ")" || lastChar === "%") input += "×" + decimalValue;
        else if (input === "" || isLastCharOperator || lastChar === "(") input += decimalValue;
        else {
            let lastOperatorIndex = -1;
            for (const operator of operators) {
                const index = input.lastIndexOf(operator);
                if (index > lastOperatorIndex) lastOperatorIndex = index;
            }

            if (!input.slice(lastOperatorIndex + 1).includes(".")) input += btnValue;
        }
    }
        //handle brackets
    else if (btnValue === "( )") {
        if (lastCalculation) {
            if (isInvalidResult) resetCalculator("(");
            else resetCalculator(result + "×(");
        }
        else if (lastChar === "(" || lastChar === ".") return;
        else if (input === "" || isLastCharOperator && lastChar !== "%") input += "(";
        else if (openBracketsCount > closeBracketsCount) input += ")";
        else input += "×(";
    }
    //handle numbers
    else {
        if (lastCalculation) resetCalculator(btnValue);
        else if (input === "0") input = btnValue;
        else if ((operators.includes(secondToLastChar) || secondToLastChar === "(") && lastChar === "0") input = withoutLastChar + btnValue;
        else if (lastChar === ")" || lastChar === "%") input += "×" + btnValue;
        else input += btnValue;
    }

    //update display
    displayInput.value = input;
    displayResult.value = result;
    displayInput.scrollLeft = displayInput.scrollWidth;
};

//function to replace division (÷) and multiplication (×) symbols with javascript-compatible operators ("/" and "*")
const replaceOperators = input => input.replaceAll("÷", "/").replaceAll("×", "*");

//function to reset calculator state with a new input value
const resetCalculator = newInput => {
    input = newInput;
    result = "";
    lastCalculation = false;
    displayBox.classList.remove("active");
};

//function to count brackets in input
const countBrackets = input => {
    let openBracketsCount = 0,
        closeBracketsCount = 0;
    for (const char of input) {
        if (char === "(") openBracketsCount++;
        else if (char === ")") closeBracketsCount++;
    }

    return { openBracketsCount, closeBracketsCount };
};

//function to handle percentage calculations
const calculatePercentage = input => {
    // This function will handle percentages including those applied to parenthesized expressions
    let processedInput = "";
    let numberBuffer = "";
    let expressionBuffer = "";
    let insideParentheses = false;
    let parenthesesCount = 0;

    for (let i = 0; i < input.length; i++) {
        const char = input[i];

        if (char === "(") {
            if (!insideParentheses) {
                insideParentheses = true;
                parenthesesCount = 1;
                expressionBuffer = char;
            } else {
                parenthesesCount++;
                expressionBuffer += char;
            }
        } else if (char === ")") {
            if (insideParentheses) {
                parenthesesCount--;
                expressionBuffer += char;
                if (parenthesesCount === 0) {
                    insideParentheses = false;
                    numberBuffer = expressionBuffer;
                    expressionBuffer = "";
                }
            } else {
                processedInput += char;
            }
        } else if (insideParentheses) {
            expressionBuffer += char;
        } else if (!isNaN(char) || char === ".") {
            numberBuffer += char;
        } else if (char === "%") {
            if (numberBuffer.startsWith("(") && numberBuffer.endsWith(")")) {
                // Evaluate the expression inside parentheses and divide by 100
                const value = eval(replaceOperators(numberBuffer));
                processedInput += (value / 100).toString();
            } else if (numberBuffer.length > 0) {
                // Simple number percentage
                processedInput += (parseFloat(numberBuffer) / 100).toString();
            }
            numberBuffer = "";
        } else {
            if (numberBuffer.length > 0) {
                processedInput += numberBuffer;
                numberBuffer = "";
            }
            processedInput += char;
        }
    }

    if (numberBuffer.length > 0) {
        processedInput += numberBuffer;
    }

    return eval(replaceOperators(processedInput));
};

//add click event listeners to all buttons
buttons.forEach(button => 
    button.addEventListener("click", e => calculate(e.target.textContent))
);
