export function createAuth(login = '', password = '', msg = '') {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" type="text/css" href="/styles.css" />
        <title>Auth</title>
    </head>
    <body>
        <div class="container">
            <form class="auth-form" action="http://167.99.141.158:10002/validate" name="auth" method="post">
                <h1 class="auth-form__header">
                    Авторизация
                </h1>
                <div class="auth-form__login">
                    <label class="auth-form__login-label">Логин:</label>
                    <input class="auth-form__login-input" name="login"  autocomplete="on" value="${login}"></input>
                </div>
                <div class="auth-form__password">
                    <label class="auth-form__password-label">Пароль:</label>
                    <input class="auth-form__password-input" name="password" type="password" autocomplete="on" value="${password}" ></input>
                </div>
    
                <div class="auth-form__footer">
                    <label class="auth-form__msg">${msg}</label>
                    <input class="auth-form__send-btn" type="submit">
                </div>
            </form>
        </div>
    </body>
    </html>`
}
