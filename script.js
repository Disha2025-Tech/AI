// Calculator state
let currentInput = '0';
let operator = null;
let previousInput = null;
let shouldResetDisplay = false;

// DOM elements
const display = document.getElementById('display');
const themeToggle = document.getElementById('themeToggle');

// Initialize calculator
document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();
    initializeTheme();
    setupThemeToggle();
    setupKeyboardSupport();
});

// Display functions
function updateDisplay() {
    display.textContent = formatNumber(currentInput);
}

function formatNumber(num) {
    if (num === 'Error') return num;
    
    const number = parseFloat(num);
    if (isNaN(number)) return '0';
    
    // Handle very large numbers with scientific notation
    if (Math.abs(number) >= 1e10) {
        return number.toExponential(5);
    }
    
    // Handle very small numbers
    if (Math.abs(number) < 1e-6 && number !== 0) {
        return number.toExponential(5);
    }
    
    // Format regular numbers
    const formatted = number.toString();
    
    // Add commas for large numbers (optional)
    if (Math.abs(number) >= 1000 && !formatted.includes('e')) {
        return number.toLocaleString('en-US', { maximumFractionDigits: 8 });
    }
    
    return formatted;
}

// Number input
function appendNumber(num) {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    if (num === '.') {
        if (currentInput.includes('.')) return;
        if (currentInput === '0' || currentInput === '') {
            currentInput = '0.';
        } else {
            currentInput += '.';
        }
    } else {
        if (currentInput === '0') {
            currentInput = num;
        } else {
            currentInput += num;
        }
    }
    
    updateDisplay();
}

// Operator input
function appendOperator(op) {
    if (operator !== null && !shouldResetDisplay) {
        calculate();
    }
    
    previousInput = currentInput;
    operator = op;
    shouldResetDisplay = true;
}

// Calculation
function calculate() {
    if (operator === null || previousInput === null) return;
    
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) {
        currentInput = 'Error';
        updateDisplay();
        return;
    }
    
    let result;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                currentInput = 'Error';
                updateDisplay();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Handle infinity and very large numbers
    if (!isFinite(result)) {
        currentInput = 'Error';
    } else {
        currentInput = result.toString();
    }
    
    operator = null;
    previousInput = null;
    shouldResetDisplay = true;
    updateDisplay();
}

// Clear functions
function clearAll() {
    currentInput = '0';
    operator = null;
    previousInput = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function clearEntry() {
    currentInput = '0';
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// Theme functionality
function initializeTheme() {
    const savedTheme = localStorage.getItem('calculator-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function setupThemeToggle() {
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('calculator-theme', newTheme);
    
    // Add a little animation effect
    themeToggle.style.transform = 'scale(0.9)';
    setTimeout(() => {
        themeToggle.style.transform = 'scale(1)';
    }, 150);
}

// Keyboard support
function setupKeyboardSupport() {
    document.addEventListener('keydown', handleKeyPress);
}

function handleKeyPress(event) {
    const key = event.key;
    
    // Prevent default behavior for calculator keys
    if ('0123456789+-*/.='.includes(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
        event.preventDefault();
    }
    
    // Numbers and decimal
    if ('0123456789'.includes(key)) {
        appendNumber(key);
    } else if (key === '.') {
        appendNumber('.');
    }
    
    // Operators
    else if (key === '+') {
        appendOperator('+');
    } else if (key === '-') {
        appendOperator('-');
    } else if (key === '*') {
        appendOperator('*');
    } else if (key === '/') {
        appendOperator('/');
    }
    
    // Special keys
    else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape') {
        clearAll();
    } else if (key === 'Backspace') {
        deleteLast();
    }
    
    // Theme toggle with 't' key
    else if (key.toLowerCase() === 't') {
        toggleTheme();
    }
}

// Button press animation
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
});

// Prevent context menu on long press (mobile)
document.addEventListener('contextmenu', function(e) {
    if (e.target.classList.contains('btn')) {
        e.preventDefault();
    }
});

// Handle orientation change
window.addEventListener('orientationchange', function() {
    setTimeout(updateDisplay, 100);
});