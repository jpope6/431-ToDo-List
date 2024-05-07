export function confirmAction(message) {
    return confirm(message);
}

export function promptForInput(promptMessage, defaultValue) {
    return prompt(promptMessage, defaultValue);
}
