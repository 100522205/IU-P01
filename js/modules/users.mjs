function registerUser(user) {
    const existingUsersString = localStorage.getItem('registered_users');
    let users = [];
    if (existingUsersString) {
        try {
            users = JSON.parse(existingUsersString);
            if (!Array.isArray(users)) { 
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
    let json_value = []; 

    if (string_value) { 
        try {
            const parsed_value = JSON.parse(string_value);
            if (Array.isArray(parsed_value)) {
                json_value = parsed_value;
            } else {
                console.warn("Data retrieved from localStorage is not an array:", parsed_value);
            }
        } catch (e) {
            console.error("Error parsing JSON from localStorage:", e);
        }
    }

    for (const u of json_value) {
        if (u["Usuario"] === user["Usuario"] && u["Contraseña"] === user["Contraseña"]) {
            return true;
        }
    }
    return false;
}

export { registerUser, loginUser };
