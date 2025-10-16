function registerUser(user) {
    localStorage.setItem('register_data', JSON.stringify(user));
}

function loginUser(user) {
    const string_value = localStorage.getItem("register_data");
    const json_value = JSON.parse(string_value);

    for (const u of json_value) {
        console.log(u["Usuario"]);
        console.log(user["Usuario"]);
        console.log(json_value[u]);
        console.log(user);
        if (u["Usuario"] === user["Usuario"] && u["Contraseña"] === user["Contraseña"]) {
            return true;
        }
    }
    return false;
}

export { registerUser, loginUser };
