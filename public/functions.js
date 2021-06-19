function setup() {
    // const sessionId = localStorage.getItem('session');
    const sessionId = getCookie('session');
    if(sessionId) {
        document.querySelector('#authenticated-content').style.display = 'inline-block';
        document.querySelector('#login-content').style.display = 'none';
        document.querySelector('#register-content').style.display = 'none';
        document.querySelector('#toggle-register').style.display = 'none';
    } else {
        document.querySelector('#authenticated-content').style.display = 'none';
        document.querySelector('#login-content').style.display = 'inline-block';
        document.querySelector('#register-content').style.display = 'none';
        document.querySelector('#toggle-register').style.display = 'inline-block';
    }
}

function login() {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    if(username === '' || password === '') {
        document.querySelector('#feedback').innerHTML = "All details are required!";
        return;
    }

    document.querySelector('#feedback').innerHTML = '';

    fetch('/api/user/login/' + username + '/' + password)
        .then(r => r.json())
        .then(result => {
            console.log(result);
            if(result.status) {
                // localStorage.setItem('session', result.msg);
                setCookie('session', result.msg.token, 6, 'h', '');
                setCookie('username', result.msg.username, 6, 'h', '');
                setup();
            } else {
                document.querySelector('#feedback').innerHTML = result.msg;
            }
        });
}


function changePassword() {
    const password = document.querySelector('#passwordchange').value;
    const password2 = document.querySelector('#passwordchange2').value;

    if (password === '') {
        document.querySelector('#feedback-password').innerHTML = "Password cannot be empty";
        return;
    } else if (password !== password2) {
        document.querySelector('#feedback-password').innerHTML = "Passwords are not the same";
        return;
    }

    document.querySelector('#feedback-password').innerHTML = '';

    fetch('/api/password', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: getCookie('username'), session: getCookie('session'), password: password})
    })
        .then(r => r.json())
        .then(result => {
            console.log(result);
            if (result.status) {
                document.querySelector('#feedback-password').innerHTML = result.msg;
            } else {
                document.querySelector('#feedback-password').innerHTML = result.msg;
            }
        });
}


function register() {
    const name = document.querySelector('#nameR').value;
    const email = document.querySelector('#emailR').value;
    const username = document.querySelector('#usernameR').value;
    const password = document.querySelector('#passwordR').value;
    const passwordRepeat = document.querySelector('#passwordRR').value;

    if(name === '' || email === '' || username === '' || password === '' || passwordRepeat === '') {
        document.querySelector('#feedback-register').innerHTML = "All details are required!";
        return;
    } else if(password !== passwordRepeat) {
        document.querySelector('#feedback-register').innerHTML = "Passwords do not match!";
        return;
    }

    document.querySelector('#feedback-register').innerHTML = '';

    // /api/user/register/:name/:username/:email/:pass
    fetch('/api/user/register/' + name + '/' + username + '/' + email + '/' + password)
        .then(r => r.json())
        .then(result => {
            console.log(result);

            if(result.status) {
                document.querySelector('#feedback-register').innerHTML = result.msg;

                document.querySelector('#nameR').value = '';
                document.querySelector('#emailR').value = '';
                document.querySelector('#usernameR').value = '';
                document.querySelector('#passwordR').value = '';
                document.querySelector('#passwordRR').value = '';
            } else {
                document.querySelector('#feedback-register').innerHTML = result.msg;
            }
        });
}

function showRegister() {
    // const sessionId = localStorage.getItem('session');
    const sessionId = getCookie('session');
    const loginStyles = document.querySelector('#login-content').style.display;

    if(!sessionId) {
        if(loginStyles === 'inline-block') {
            document.querySelector('#login-content').style.display = 'none';
            document.querySelector('#register-content').style.display = 'inline-block';
            document.querySelector('#toggle-register').innerHTML = 'Go back to login';
        } else {
            document.querySelector('#login-content').style.display = 'inline-block';
            document.querySelector('#register-content').style.display = 'none';
            document.querySelector('#toggle-register').innerHTML = 'Don\'t have account? Register';
        }
    }
}


function getCookie(key) {
    const cookies = document.cookie.split('; ');

    for(const cookie of cookies) {
        const cookieKey = cookie.split('=')[0];
        // key=value -> split it using equal sign
        // [key, value]
        if(cookieKey === key) {
            return cookie.split('=')[1];
        }
    }

    return null;
}

// What do we need to set a cookie?
// - Key
// - Value
// - Expiry date
// - Any additional flags
//
// Instead of expiry date, we will provide how long the cookie should be valid for along with a unit e.g. days or hours
// setCookie('username', 'Igor', 5, 'days', '')
// document.cookie = 'username=Igor; date_from_now_offset_by_5_days;
function setCookie(key, value, validity, unit, flags) {
    let cookie = key + '=' + value + '; ';

    const currentTime = new Date().getTime();
    let multiplier = 0;

    if(unit === 'h') {
        multiplier = 1000 * 60 * 60;
    } else if(unit === 'd') {
        multiplier = 1000 * 60 * 60 * 24;
    } else if(unit === 'w') {
        multiplier = 1000 * 60 * 60 * 24 * 7;
    }

    const targetDate = new Date(currentTime + (multiplier * validity)).toUTCString();

    cookie += 'expires=' + targetDate + '; ' + (flags !== '' ? flags + ';' : '');
    document.cookie = cookie;

}

function destroyCookie(key) {
    const expiryDate = new Date(0).toUTCString();
    const cookie = key + '=; expires=' + expiryDate + ';';
    document.cookie = cookie;
}

function logout() {
    // localStorage.removeItem('session');
    destroyCookie('session');
    setup();
}
