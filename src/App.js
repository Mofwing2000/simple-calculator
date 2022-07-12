import { useState } from 'react';
import Screen from './components/Screen';
import Button from './components/Button';
import './App.css';

function App() {
    const [result, setResult] = useState('0');
    const [formular, setFormular] = useState('');
    const [calculated, setCalculated] = useState(false);
    const operatorRegExp = /^(\+|-|\*|\/)$/;
    const plusMinusRegExp = /^(\+|-)$/;
    const mulDivRegExp = /^(\*|\/)$/;

    // AC button click
    const acBtnOnclick = () => {
        setResult('0');
        setFormular('');
    };

    const errorMessage = 'DIGIT LIMIT MET';

    // Number button clicked
    const handleNumberBtnClick = (e) => {
        // Prevent event when reach length limit
        if (result === errorMessage) return;
        if (result.length >= 22) {
            const prevVal = result;
            setResult(errorMessage);
            setTimeout(() => {
                setResult(prevVal);
            }, 200);
            return;
        } else {
            //Check if data in result field is number and not calculated
            if (!isNaN(result)) {
                // If calculated replace result field's value by result of
                // calculation instead of append clicked number into result field
                if (calculated) {
                    setResult(e.target.innerText);
                    setFormular(e.target.innerText);
                    setCalculated(false);
                }
                //Check if data in result field is 0
                //-> Then replace 0 by clicked nubmer
                else {
                    if (result === '0') {
                        setResult(e.target.innerText);
                        setFormular(e.target.innerText);
                        if (formular[formular.length - 1] === '0' && operatorRegExp.test(formular[formular.length - 2]))
                            setFormular(formular.substring(0, formular.length - 1) + e.target.innerText);
                    }
                    //Other number buttons clicked -> append
                    else {
                        setResult(result + e.target.innerText);
                        setFormular(formular === '0' ? e.target.innerText : formular + e.target.innerText);
                    }
                }
            }
            // if data in result field is operators
            else {
                setResult(e.target.innerText);
                setFormular(formular + e.target.innerText);
            }
        }
    };

    const handleDecimalBtnOnClick = (e) => {
        if (result === errorMessage) return;
        if (result.length >= 22) {
            const prevVal = result;
            setResult(errorMessage);
            setTimeout(() => {
                setResult(prevVal);
            }, 200);
            return;
        } else {
            //Auto append '0' when click '.' after calculating
            if (calculated) {
                setResult('0' + e.target.innerText);
                setFormular('0' + e.target.innerText);
                setCalculated(false);
            } else {
                //Auto append '0' when click '.' if standalone
                if (isNaN(formular[formular.length - 1])) {
                    if (formular[formular.length - 1] !== '.') {
                        setResult('0.');
                        setFormular(formular + '0.');
                    }
                } else {
                    //prevent adding '.' if number has '.'
                    let lastOperator = 0;
                    for (let i = formular.length - 1; i >= 0; i--) {
                        if (operatorRegExp.test(formular[i])) {
                            lastOperator = i;
                            break;
                        }
                    }
                    if (formular.substring(lastOperator).includes('.')) {
                    } else {
                        setResult(result + e.target.innerText);
                        setFormular(formular + e.target.innerText);
                    }
                }
            }
        }
    };

    const handleOperatorBtnClick = (e) => {
        //  Use result to continue calculate
        const operator = e.target.innerText === 'x' ? '*' : e.target.innerText;
        if (calculated) {
            setResult(e.target.innerText);
            setFormular(result + operator);
            setCalculated(false);
        } else {
            if (operatorRegExp.test(formular)) {
                setResult(e.target.innerText);
                setFormular(operator);
            }
            //allow negnumber
            else if (operatorRegExp.test(result) && e.target.innerText !== '-') {
                setResult(operator);
                // replace old operator by latest one
                if (
                    operatorRegExp.test(formular[formular.length - 1]) &&
                    operatorRegExp.test(formular[formular.length - 2])
                ) {
                    setFormular(formular.substring(0, formular.length - 2) + operator);
                } else setFormular(formular.substring(0, formular.length - 1) + operator);
            }
            // prevent double '-'
            else {
                console.log(operator);
                if (formular[formular.length - 1] === '-') {
                } else {
                    setResult(e.target.innerText);
                    setFormular(formular + operator);
                }
            }
        }
    };

    //Pre-process calculation
    const preProcess = (string) => {
        if (operatorRegExp.test(string[string.length - 1])) {
            if (operatorRegExp.test(string[string.length - 2])) {
                string = string.substring(0, string.length - 2);
            } else {
                string = string.substring(0, string.length - 1);
            }
        }
        return string;
    };
    const equalBtnClick = () => {
        if (calculated) return;
        if (mulDivRegExp.test(formular[0])) return;
        let result = '';
        result = getResult(formular);
        if (operatorRegExp.test(formular[formular.length - 1])) {
            if (operatorRegExp.test(formular[formular.length - 2])) {
                setFormular(formular.substring(0, formular.length - 2) + ' = ' + result);
            } else {
                setFormular(formular.substring(0, formular.length - 1) + ' = ' + result);
            }
        } else {
            setFormular(formular + ' = ' + result);
        }
        setResult(result);
        setCalculated(true);
    };

    // Split calculation into array of numbers and operators
    const splitString = (string) => {
        const arrResult = [];
        let temp = '';
        for (let i = 0; i < string.length; i++) {
            //Push operators
            if (operatorRegExp.test(string[i]) && string[i - 1] !== 'e') {
                if (temp) {
                    arrResult.push(temp);
                    temp = '';
                }
                arrResult.push(string[i]);
            }
            //Push numbers
            else if (/(\d|\.|e)/.test(string[i])) {
                temp += string[i];
            }
        }
        arrResult.push(temp);
        return arrResult;
    };

    const formatPosNeg = (array) => {
        for (let i = 0; i < array.length - 1; i++) {
            // Merge if '-'next to an operator
            if (plusMinusRegExp.test(array[i]) && (i === 0 || operatorRegExp.test(array[i - 1]))) {
                array[i] += array[i + 1];
                array.splice(i + 1, 1);
            }
        }
        return array;
    };

    // Calculate calculation
    const calculate = (calculatingArr) => {
        const circumulateArr = [];
        let currentOperator;

        for (let i = 0; i < calculatingArr.length; i++) {
            if (!operatorRegExp.test(calculatingArr[i])) {
                if (!mulDivRegExp.test(currentOperator)) {
                    // '-' into "+-";
                    if (currentOperator === '-') {
                        calculatingArr[i] = -calculatingArr[i];
                    }
                    circumulateArr.push(calculatingArr[i]);
                } else {
                    let val = circumulateArr.pop();
                    if (currentOperator === '*') {
                        val *= calculatingArr[i];
                        circumulateArr.push(val);
                    }
                    if (currentOperator === '/') {
                        if (calculatingArr[i] === 0) return;
                        val /= calculatingArr[i];
                        circumulateArr.push(val);
                    }
                }
            } else {
                currentOperator = calculatingArr[i];
            }
        }

        for (let i = 0; i < circumulateArr.length; i++) {
            circumulateArr[i] *= 1;
        }

        const result = circumulateArr.reduce((num1, num2) => num1 + num2, 0);
        if (isNaN(result)) return;
        else return result;
    };

    const getResult = (string) => {
        let calculatingArr = [];
        string = preProcess(string);
        calculatingArr = formatPosNeg(splitString(string));
        console.log(calculatingArr);
        return +calculate(calculatingArr).toFixed(12);
    };

    return (
        <div className="App h-screen">
            <div className="wrapper absolute left-1/2 top-1/2 w-336 max-w-[336px] -translate-x-1/2 -translate-y-1/2 p-1 bg-black border-2 border-solid border-gray-600">
                <Screen formular={formular} output={result}></Screen>
                <div className="btn__container flex flex-wrap w-324">
                    <Button value="AC" size="double-width" btnType="ac" onClick={acBtnOnclick}></Button>
                    <Button value="/" size="normal" btnType="operator" onClick={handleOperatorBtnClick}></Button>
                    <Button value="x" size="normal" btnType="operator" onClick={handleOperatorBtnClick}></Button>
                    <Button value="7" size="normal" btnType="number" onClick={handleNumberBtnClick}></Button>
                    <Button value="8" size="normal" btnType="number" onClick={handleNumberBtnClick}></Button>
                    <Button value="9" size="normal" btnType="number" onClick={handleNumberBtnClick}></Button>
                    <Button value="-" size="normal" btnType="operator" onClick={handleOperatorBtnClick}></Button>
                    <Button value="4" size="normal" btnType="number" onClick={handleNumberBtnClick}></Button>
                    <Button value="5" size="normal" btnType="number" onClick={handleNumberBtnClick}></Button>
                    <Button value="6" size="normal" btnType="number" onClick={handleNumberBtnClick}></Button>
                    <Button value="+" size="normal" btnType="operator" onClick={handleOperatorBtnClick}></Button>
                    <Button value="1" size="normal" btnType="number" onClick={handleNumberBtnClick}></Button>
                    <Button value="2" size="normal" btnType="number" onClick={handleNumberBtnClick}></Button>
                    <Button value="3" size="normal" btnType="number" onClick={handleNumberBtnClick}></Button>
                    <Button value="0" size="double-width" btnType="number" onClick={handleNumberBtnClick}></Button>
                    <Button value="." size="normal" btnType="decimal" onClick={handleDecimalBtnOnClick}></Button>
                    <Button
                        className="absolute bottom-[calc(4px)] right-[calc(4px)]"
                        value="="
                        size="double-height"
                        btnType="equal"
                        onClick={equalBtnClick}
                    ></Button>
                </div>
            </div>
        </div>
    );
}

export default App;
