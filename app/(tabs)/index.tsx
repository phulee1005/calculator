import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Vibration } from 'react-native';
import { Entypo } from '@expo/vector-icons';

export default function App() {
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [currentNumber, setCurrentNumber] = useState<string>('');
    const [lastNumber, setLastNumber] = useState<string>('');

    const buttons: (string | number)[] = [
        'C', 'DEL', '/',
        7, 8, 9, '*',
        4, 5, 6, '-',
        1, 2, 3, '+',
        0, '.', '!', '^',
        '√', 'log', '=',
    ];

    // Hàm tính giai thừa
    function factorial(n: number): number {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        return n * factorial(n - 1);
    }

    // Hàm tính toán
    function calculator(): void {
        if (currentNumber.startsWith('log')) {
            let number = parseFloat(currentNumber.slice(3)); // Lấy số sau log
            if (number <= 0) {
                setCurrentNumber('Error'); // Kiểm tra số âm cho logarit
                return;
            }
            let result = Math.log10(number).toString(); // Tính log cơ số 10
            setCurrentNumber(result);
            return;
        }

        let lastArr = currentNumber[currentNumber.length - 1];

        if (lastArr === '/' || lastArr === '*' || lastArr === '-' || lastArr === '+' || lastArr === '.') {
            setCurrentNumber(currentNumber);
            return;
        }

        // Xử lý căn bậc 2
        if (currentNumber.startsWith('√')) {
            let number = parseFloat(currentNumber.slice(1));
            let result = Math.sqrt(number).toString();
            setCurrentNumber(result);
            return;
        }

        // Xử lý giai thừa
        if (currentNumber.endsWith('!')) {
            let number = parseInt(currentNumber.slice(0, -1));
            let result = factorial(number).toString();
            setCurrentNumber(result);
            return;
        }

        // Xử lý số mũ
        if (currentNumber.includes('^')) {
            let parts = currentNumber.split('^');
            if (parts.length === 2) {
                let base = parseFloat(parts[0]);
                let exponent = parseFloat(parts[1]);
                let result = Math.pow(base, exponent).toString();
                setCurrentNumber(result);
                return;
            }
        }

        let result = eval(currentNumber).toString();
        setCurrentNumber(result);
    }

    function handleInput(buttonPressed: string | number): void {
        if (['+', '-', '*', '/', '^'].includes(buttonPressed.toString())) {
            Vibration.vibrate(35);
            setCurrentNumber(currentNumber + buttonPressed);
            return;
        } else if ('0123456789.'.includes(buttonPressed.toString())) {
            Vibration.vibrate(35);
            setCurrentNumber(currentNumber + buttonPressed);
            return;
        } else if (buttonPressed === '√') {
            Vibration.vibrate(35);
            setCurrentNumber('√' + currentNumber);
            return;
        } else if (buttonPressed === 'log') {  // Xử lý nút log
            Vibration.vibrate(35);
            setCurrentNumber('log' + currentNumber);
            return;
        } else if (buttonPressed === '!') {
            Vibration.vibrate(35);
            setCurrentNumber(currentNumber + '!');
            return;
        }

        switch (buttonPressed) {
            case 'DEL':
                Vibration.vibrate(35);
                setCurrentNumber(currentNumber.substring(0, currentNumber.length - 1));
                return;
            case 'C':
                Vibration.vibrate(35);
                setLastNumber('');
                setCurrentNumber('');
                return;
            case '=':
                Vibration.vibrate(35);
                setLastNumber(currentNumber + '=');
                calculator();
                return;
        }
    }

    const styles = StyleSheet.create({
        results: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: darkMode ? '#303946' : '#fff',
        },
        buttons: {
            width: '100%',
            height: '35%',
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        resultText: {
            maxHeight: 45,
            color: "#00b9d6",
            margin: 15,
            fontSize: 35,
        },
        historyText: {
            color: darkMode ? '#B5B7BB' : '#7c7c7c',
            fontSize: 20,
            marginRight: 10,
            alignSelf: 'flex-end',
        },
        themeButton: {
            alignSelf: 'flex-start',
            bottom: '5%',
            margin: 15,
            backgroundColor: darkMode ? '#7b8084' : '#e5e5e5',
            alignItems: 'center',
            justifyContent: 'center',
            width: 50,
            height: 50,
            borderRadius: 25,
        },
        button: {
            borderColor: darkMode ? '#3f4d5b' : '#e5e5e5',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '24%',
            minHeight: '20%',
            flex: 1,
        },
        textButton: {
            color: darkMode ? '#b5b7bb' : '#7c7c7c',
            fontSize: 24,
        },
        specialButton: {
            backgroundColor: darkMode ? '#303946' : '#fff',
        },
    });

    return (
        <View>
            <View style={styles.results}>
                <TouchableOpacity style={styles.themeButton} onPress={() => setDarkMode(!darkMode)}>
                    <Entypo
                        name={darkMode ? 'light-up' : 'moon'}
                        size={28}
                        color={darkMode ? 'white' : 'black'}
                    />
                </TouchableOpacity>
                <Text style={styles.historyText}>{lastNumber}</Text>
                <Text style={styles.resultText}>{currentNumber}</Text>
            </View>
            <View style={styles.buttons}>
                {buttons.map((button) =>
                    button === '=' ? (
                        <TouchableOpacity
                            key={button}
                            style={[styles.button, { backgroundColor: (darkMode ? '#008080' : '#708090'), minWidth: '25%' }]} // Màu nút '='
                            onPress={() => handleInput(button)}
                        >
                            <Text style={[styles.textButton, { color: 'white', fontSize: 28 }]}>{button}</Text>
                        </TouchableOpacity>
                    ) : button === '/' || button === '*' || button === '-' || button === '+' || button === '^' ? (
                        <TouchableOpacity
                            key={button}
                            style={[styles.button, { backgroundColor: (darkMode ? '#008080' : '#708090') }]}
                            onPress={() => handleInput(button)}
                        >
                            <Text style={[styles.textButton, { color: 'white', fontSize: 28 }]}>{button}</Text>
                        </TouchableOpacity>
                    ) : button === '!' ? (
                        <TouchableOpacity
                            key={button}
                            style={[styles.button, styles.specialButton, { minWidth: '24%' }]}
                            onPress={() => handleInput(button)}
                        >
                            <Text style={[styles.textButton, { color: darkMode ? '#b5b7bb' : '#7c7c7c' }]}>{button}</Text>
                        </TouchableOpacity>
                    ) : button === '0' || button === '.' || button === '^' || button === '!' ? (
                        <TouchableOpacity
                            key={button}
                            style={[styles.button, { backgroundColor: (darkMode ? '#303946' : '#fff'), minWidth: '24%' }]}
                            onPress={() => handleInput(button)}
                        >
                            <Text style={styles.textButton}>{button}</Text>
                        </TouchableOpacity>
                    ) : button === 'DEL' ? (
                        <TouchableOpacity
                            key={button}
                            style={[styles.button, { backgroundColor: (darkMode ? '#414853' : '#ededed'), minWidth: '36%' }]}
                            onPress={() => handleInput(button)}
                        >
                            <Text style={styles.textButton}>{button}</Text>
                        </TouchableOpacity>
                    ) : button === 'C' ? (
                        <TouchableOpacity
                            key={button}
                            style={[styles.button, { backgroundColor: (darkMode ? '#414853' : '#ededed'), minWidth: '37%' }]}
                            onPress={() => handleInput(button)}
                        >
                            <Text style={styles.textButton}>{button}</Text>
                        </TouchableOpacity>
                    ) : button === '√' ? (
                        <TouchableOpacity
                            key={button}
                            style={[styles.button, { backgroundColor: (darkMode ? '#303946' : '#fff'), minWidth: '37%' }]}
                            onPress={() => handleInput(button)}
                        >
                            <Text style={styles.textButton}>{button}</Text>
                        </TouchableOpacity>
                    ) : button === 'log' ? (
                        <TouchableOpacity
                            key={button}
                            style={[styles.button, { backgroundColor: (darkMode ? '#303946' : '#fff'), minWidth: '38%' }]}
                            onPress={() => handleInput(button)}
                        >
                            <Text style={styles.textButton}>{button}</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            key={button}
                            style={[styles.button, { backgroundColor: (darkMode ? '#303946' : '#fff') }]}
                            onPress={() => handleInput(button)}
                        >
                            <Text style={styles.textButton}>{button}</Text>
                        </TouchableOpacity>
                    )
                )}
            </View>
        </View>
    );
}