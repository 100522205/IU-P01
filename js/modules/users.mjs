function registerUser(user) {
    const existingUsersString = localStorage.getItem('registered_users');
    let users = [];
    if (existingUsersString) {
        try {
            users = JSON.parse(existingUsersString);
            if (!Array.isArray(users)) { // Ensure it's an array if existing data was malformed
                users = [];
            }
        } catch (e) {
            console.error("Error parsing existing users from localStorage:", e);
            users = [];
        }
    }
    users.push(user);
    localStorage.setItem('registered_users', JSON.stringify(users));
}

function loginUser(user) {
    const string_value = localStorage.getItem("registered_users");
    let json_value = []; // Initialize json_value as an empty array by default

    if (string_value) { // Check if string_value is not null or empty
        try {
            const parsed_value = JSON.parse(string_value);
            // Ensure parsed_value is an array, otherwise, treat it as an empty array
            if (Array.isArray(parsed_value)) {
                json_value = parsed_value;
            } else {
                console.warn("Data retrieved from localStorage is not an array:", parsed_value);
            }
        } catch (e) {
            console.error("Error parsing JSON from localStorage:", e);
            // Handle parsing errors, e.g., by keeping json_value as an empty array
        }
    }

    for (const u of json_value) {
        // The next line `console.log(json_value[u]);` might also be problematic
        // if `u` is an object. You likely meant to access a property of `u`.
        // For now, we'll keep it as is, but it might need review.
        if (u["Usuario"] === user["Usuario"] && u["Contraseña"] === user["Contraseña"]) {
            return true;
        }
    }
    return false;
}

export { registerUser, loginUser };
